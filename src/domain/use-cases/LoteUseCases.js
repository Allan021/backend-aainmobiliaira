class LoteUseCases {
  constructor(loteRepo) {
    this.loteRepo = loteRepo;
  }

  async listByLotification(lotificationId) {
    return this.loteRepo.findByLotification(lotificationId);
  }

  async getById(id) {
    const lote = await this.loteRepo.findById(id);
    if (!lote) throw Object.assign(new Error('Lote no encontrado'), { status: 404 });
    return lote;
  }

  async create(lotificationId, data) {
    return this.loteRepo.create(lotificationId, data);
  }

  async update(id, data) {
    return this.loteRepo.update(id, data);
  }

  async delete(id) {
    return this.loteRepo.delete(id);
  }

  async addPago(loteId, data) {
    return this.loteRepo.addPago(loteId, data);
  }

  async deletePago(loteId, pagoId) {
    return this.loteRepo.deletePago(loteId, pagoId);
  }
}

module.exports = LoteUseCases;
