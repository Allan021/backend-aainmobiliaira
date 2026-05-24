class Property {
  constructor({
    id,
    title,
    type,
    municipio,
    departamento,
    dep_code,
    price,
    currency = 'L',
    area_varas,
    area_m2,
    financing,
    description,
    highlights = [],
    images = [],
    lotification_name,
    lotification_id,
    status = 'disponible',
    payment_methods = [],
    financing_prima,
    financing_plazo_meses,
    financing_tasa_anual,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.municipio = municipio;
    this.departamento = departamento;
    this.depCode = dep_code;
    this.price = price;
    this.currency = currency;
    this.areaVaras = area_varas;
    this.areaM2 = area_m2;
    this.financing = financing;
    this.description = description;
    this.highlights = highlights;
    this.images = images;
    this.lotificationName = lotification_name;
    this.lotificationId = lotification_id;
    this.status = status;
    this.paymentMethods = payment_methods;
    this.financingPrima = financing_prima;
    this.financingPlazoMeses = financing_plazo_meses;
    this.financingTasaAnual = financing_tasa_anual;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

module.exports = Property;
