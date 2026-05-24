class AuthController {
  constructor(authUseCases) {
    this.auth = authUseCases;
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
      const result = await this.auth.login(email, password);
      res.json(result);
    } catch (err) { next(err); }
  };

  register = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) return res.status(400).json({ error: 'Todos los campos son requeridos' });
      const result = await this.auth.register(email, password, name);
      res.status(201).json(result);
    } catch (err) { next(err); }
  };

  me = async (req, res, next) => {
    try {
      const user = await this.auth.me(req.user.id);
      res.json(user);
    } catch (err) { next(err); }
  };

  googleCallback = async (req, res, next) => {
    try {
      if (!req.user) return res.redirect('/admin/login?error=Google_Auth_Profile_Not_Found');
      const result = await this.auth.googleLogin(req.user);
      const env = require('../../../config/env');
      res.redirect(`${env.frontendUrl}/admin/login?token=${result.token}`);
    } catch (err) {
      console.error('Google callback error:', err);
      const env = require('../../../config/env');
      res.redirect(`${env.frontendUrl}/admin/login?error=Server_Error`);
    }
  };
}

module.exports = AuthController;
