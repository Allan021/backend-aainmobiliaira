class Sale {
  constructor({ id, reference, property_id, property_title, buyer_name, buyer_email, buyer_phone, price, payment_method, date, notes, created_at }) {
    this.id = id;
    this.reference = reference;
    this.propertyId = property_id;
    this.propertyTitle = property_title;
    this.buyerName = buyer_name;
    this.buyerEmail = buyer_email;
    this.buyerPhone = buyer_phone;
    this.price = price;
    this.paymentMethod = payment_method;
    this.date = date;
    this.notes = notes;
    this.createdAt = created_at;
  }
}

module.exports = Sale;
