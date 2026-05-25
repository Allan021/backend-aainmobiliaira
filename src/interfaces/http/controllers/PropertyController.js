class PropertyController {
  constructor(propertyUseCases) {
    this.properties = propertyUseCases;
  }

  list = async (req, res, next) => {
    try {
      const { dep, pay, status, search, page, limit } = req.query;
      const result = await this.properties.list({ dep, pay, status, search, page: Number(page) || 1, limit: Number(limit) || 20 });
      res.json(result);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const property = await this.properties.getById(req.params.id);
      res.json(property);
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const property = await this.properties.create(req.body);
      res.status(201).json(property);
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const property = await this.properties.update(req.params.id, req.body);
      res.json(property);
    } catch (err) { next(err); }
  };

  delete = async (req, res, next) => {
    try {
      await this.properties.delete(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  };

  uploadImage = async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Imagen requerida' });
      const result = await this.properties.uploadImage(req.params.id, req.file.buffer);
      res.json(result);
    } catch (err) { next(err); }
  };

  deleteImage = async (req, res, next) => {
    try {
      const result = await this.properties.deleteImage(req.params.id, req.params.imageId);
      res.json(result);
    } catch (err) { next(err); }
  };

  publishToFacebook = async (req, res, next) => {
    try {
      const result = await this.properties.publishToFacebook(req.params.id, req.body);
      res.json(result);
    } catch (err) { next(err); }
  };

  stats = async (req, res, next) => {
    try {
      const stats = await this.properties.getStats();
      res.json(stats);
    } catch (err) { next(err); }
  };
}

module.exports = PropertyController;
