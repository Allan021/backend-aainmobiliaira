const supabase = require('../../config/supabase');
const PropertyRepository = require('../../domain/repositories/PropertyRepository');

class SupabasePropertyRepository extends PropertyRepository {
  async findAll({ dep, pay, status, search, page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('properties')
      .select('*, lotification:lotifications(id, name), images:property_images(id, url, public_id, order)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (dep) query = query.eq('dep_code', dep);
    if (pay === 'financing') query = query.eq('financing', true);
    if (pay === 'cash') query = query.eq('financing', false);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('properties')
      .select('*, lotification:lotifications(id, name), images:property_images(id, url, public_id, order)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(propertyData) {
    const { images, facebook_title, facebook_description, map_url, ...data } = propertyData;

    const { data: property, error } = await supabase
      .from('properties')
      .insert(data)
      .select()
      .single();
    if (error) throw error;

    if (images && images.length > 0) {
      const rows = images
        .filter(img => img.url)
        .map((img, i) => ({
          property_id: property.id,
          url: img.url,
          public_id: img.publicId || img.public_id || null,
          order: i,
        }));
      if (rows.length > 0) {
        await supabase.from('property_images').insert(rows);
      }
    }

    return { ...property, images: images || [] };
  }

  async update(id, updates) {
    const { images, facebook_title, facebook_description, map_url, ...data } = updates;

    const { data: property, error } = await supabase
      .from('properties')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    if (images !== undefined) {
      await supabase.from('property_images').delete().eq('property_id', id);
      if (images.length > 0) {
        const rows = images
          .filter(img => img.url)
          .map((img, i) => ({
            property_id: id,
            url: img.url,
            public_id: img.publicId || img.public_id || null,
            order: img.order ?? i,
          }));
        if (rows.length > 0) {
          await supabase.from('property_images').insert(rows);
        }
      }
    }

    return property;
  }

  async delete(id) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  }

  async addImage(propertyId, { url, publicId }) {
    const { count } = await supabase
      .from('property_images')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    const { data, error } = await supabase
      .from('property_images')
      .insert({
        property_id: propertyId,
        url,
        public_id: publicId || null,
        order: count || 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async saveFbPostId(id, fbPostId) {
    const { error } = await supabase
      .from('properties')
      .update({ fb_post_id: fbPostId })
      .eq('id', id);
    if (error) console.warn('[DB] saveFbPostId failed:', error.message);
  }

  async deleteImage(propertyId, imageId) {
    const { data, error } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId)
      .eq('property_id', propertyId)
      .select('public_id')
      .single();
    if (error) throw error;
    return data;
  }

  async count(filters = {}) {
    let query = supabase.from('properties').select('id', { count: 'exact', head: true });
    if (filters.status) query = query.eq('status', filters.status);
    const { count, error } = await query;
    if (error) throw error;
    return count;
  }
}

module.exports = SupabasePropertyRepository;
