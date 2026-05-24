class LeadUseCases {
  constructor(leadRepo) {
    this.leadRepo = leadRepo;
  }

  async list(filters) {
    return this.leadRepo.findAll(filters);
  }

  async getById(id) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) throw Object.assign(new Error('Lead no encontrado'), { status: 404 });
    return lead;
  }

  async create(data) {
    return this.leadRepo.create(data);
  }

  async updateStatus(id, status) {
    return this.leadRepo.update(id, { status });
  }

  async delete(id) {
    return this.leadRepo.delete(id);
  }
}

module.exports = LeadUseCases;
