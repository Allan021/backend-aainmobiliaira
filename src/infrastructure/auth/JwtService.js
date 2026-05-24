const jwt = require('jsonwebtoken');
const env = require('../../config/env');

class JwtService {
  sign(payload) {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, env.jwt.secret);
  }
}

module.exports = JwtService;
