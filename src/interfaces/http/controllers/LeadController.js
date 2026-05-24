class LeadController {
  constructor(leadUseCases) {
    this.leads = leadUseCases;
  }

  list = async (req, res, next) => {
    try {
      const { status, page, limit } = req.query;
      const result = await this.leads.list({ status, page: Number(page) || 1, limit: Number(limit) || 20 });
      res.json(result);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const lead = await this.leads.getById(req.params.id);
      res.json(lead);
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const { name, email, phone, property_id, property_title } = req.body;
      if (!name || !email) return res.status(400).json({ error: 'Nombre y email requeridos' });
      const lead = await this.leads.create({ name, email, phone, property_id, property_title });
      res.status(201).json(lead);
    } catch (err) { next(err); }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const lead = await this.leads.updateStatus(req.params.id, status);
      res.json(lead);
    } catch (err) { next(err); }
  };

  delete = async (req, res, next) => {
    try {
      await this.leads.delete(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  };
}

module.exports = LeadController;
