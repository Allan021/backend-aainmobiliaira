class LoteController {
  constructor(loteUseCases) {
    this.lotes = loteUseCases;
  }

  listByLotification = async (req, res, next) => {
    try {
      const data = await this.lotes.listByLotification(req.params.lotificationId);
      res.json(data);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.lotes.getById(req.params.id);
      res.json(data);
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.lotes.create(req.params.lotificationId, req.body);
      res.status(201).json(data);
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.lotes.update(req.params.id, req.body);
      res.json(data);
    } catch (err) { next(err); }
  };

  delete = async (req, res, next) => {
    try {
      await this.lotes.delete(req.params.id);
      res.status(204).end();
    } catch (err) { next(err); }
  };

  addPago = async (req, res, next) => {
    try {
      const data = await this.lotes.addPago(req.params.loteId, req.body);
      res.status(201).json(data);
    } catch (err) { next(err); }
  };

  deletePago = async (req, res, next) => {
    try {
      await this.lotes.deletePago(req.params.loteId, req.params.pagoId);
      res.status(204).end();
    } catch (err) { next(err); }
  };
}

module.exports = LoteController;
