class PropertyUseCases {
  constructor(propertyRepo, imageService, facebookService = null) {
    this.propertyRepo = propertyRepo;
    this.imageService = imageService;
    this.facebook = facebookService;
  }

  async list(filters) {
    return this.propertyRepo.findAll(filters);
  }

  async getById(id) {
    const property = await this.propertyRepo.findById(id);
    if (!property) throw Object.assign(new Error('Propiedad no encontrada'), { status: 404 });
    return property;
  }

  async create(data) {
    return this.propertyRepo.create(data);
  }

  async publishToFacebook(id, overrides = {}) {
    if (!this.facebook) return { skipped: true, reason: 'Facebook not configured' };
    const property = await this.propertyRepo.findById(id);
    if (!property) throw Object.assign(new Error('Propiedad no encontrada'), { status: 404 });
    if (property.status !== 'disponible') return { skipped: true, reason: 'Not disponible' };

    // Merge facebook-only fields from the request (not stored in DB)
    const fbData = { ...property };
    if (overrides.facebook_title) fbData.facebook_title = overrides.facebook_title;
    if (overrides.facebook_description) fbData.facebook_description = overrides.facebook_description;

    const result = await this.facebook.postProperty(fbData);
    if (result?.id) {
      await this.propertyRepo.saveFbPostId(id, result.id).catch(() => {});
    }
    return { posted: true, postId: result?.id };
  }

  async update(id, data) {
    const before = await this.propertyRepo.findById(id).catch(() => null);
    const property = await this.propertyRepo.update(id, data);

    // Merge facebook-only fields (not persisted in DB) for the Facebook service
    const fbOverrides = {};
    if (data.facebook_title) fbOverrides.facebook_title = data.facebook_title;
    if (data.facebook_description) fbOverrides.facebook_description = data.facebook_description;

    if (this.facebook && before && before.status !== property.status) {
      if (property.status === 'disponible') {
        const full = await this.propertyRepo.findById(id).catch(() => property);
        this.facebook.postProperty({ ...full, ...fbOverrides }).then(result => {
          if (result?.id) this.propertyRepo.saveFbPostId(id, result.id).catch(() => {});
        }).catch(err => console.error('[Facebook] Post failed:', err.message));
      } else if (property.status === 'vendido') {
        this.facebook.postSold(property).catch(err =>
          console.error('[Facebook] Sold post failed:', err.message)
        );
      }
    }

    return property;

  }

  async delete(id) {
    if (this.facebook) {
      const property = await this.propertyRepo.findById(id).catch(() => null);
      if (property?.fb_post_id) {
        await this.facebook.deletePost(property.fb_post_id).catch(err =>
          console.warn('[Facebook] Delete post failed:', err.message)
        );
      }
    }
    return this.propertyRepo.delete(id);
  }

  async uploadImage(propertyId, fileBuffer) {
    const result = await this.imageService.upload(fileBuffer, {
      folder: `aa-inmobiliaria/properties/${propertyId}`,
    });
    await this.propertyRepo.addImage(propertyId, result);
    return result;
  }

  async deleteImage(propertyId, imageId) {
    const img = await this.propertyRepo.deleteImage(propertyId, imageId);
    if (img?.public_id) {
      await this.imageService.destroy(img.public_id).catch(err =>
        console.warn('[Cloudinary] Delete failed:', err.message)
      );
    }
    return { deleted: true };
  }

  async getStats() {
    const [total, disponible, apartado, vendido] = await Promise.all([
      this.propertyRepo.count(),
      this.propertyRepo.count({ status: 'disponible' }),
      this.propertyRepo.count({ status: 'apartado' }),
      this.propertyRepo.count({ status: 'vendido' }),
    ]);
    return { total, disponible, apartado, vendido };
  }
}

module.exports = PropertyUseCases;
