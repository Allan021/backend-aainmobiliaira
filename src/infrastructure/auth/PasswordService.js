const bcrypt = require('bcryptjs');

class PasswordService {
  async hash(password) {
    return bcrypt.hash(password, 12);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = PasswordService;
