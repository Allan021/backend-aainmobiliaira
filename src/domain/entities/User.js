class User {
  constructor({ id, email, name, role = 'admin', created_at }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = created_at;
  }
}

module.exports = User;
