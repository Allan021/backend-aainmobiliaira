class SaleUseCases {
  constructor(saleRepo) {
    this.saleRepo = saleRepo;
  }

  async list(filters) {
    return this.saleRepo.findAll(filters);
  }

  async create(data) {
    return this.saleRepo.create(data);
  }

  async getMetrics() {
    return this.saleRepo.getMetrics();
  }
}

module.exports = SaleUseCases;
