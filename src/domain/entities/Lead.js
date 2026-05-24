class Lead {
  constructor({ id, name, email, phone, property_id, property_title, status = 'pendiente', notes, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.propertyId = property_id;
    this.propertyTitle = property_title;
    this.status = status;
    this.notes = notes;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

module.exports = Lead;
