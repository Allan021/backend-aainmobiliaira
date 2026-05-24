class SaleController {
  constructor(saleUseCases) {
    this.sales = saleUseCases;
  }

  list = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await this.sales.list({ page: Number(page) || 1, limit: Number(limit) || 20 });
      res.json(result);
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const sale = await this.sales.create(req.body);
      res.status(201).json(sale);
    } catch (err) { next(err); }
  };

  metrics = async (req, res, next) => {
    try {
      const metrics = await this.sales.getMetrics();
      res.json(metrics);
    } catch (err) { next(err); }
  };
}

module.exports = SaleController;
