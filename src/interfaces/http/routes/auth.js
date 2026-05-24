const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth');
const passport = require('passport');

function authRoutes(controller) {
  const router = Router();
  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.get('/me', authMiddleware, controller.me);

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/admin/login?error=Google_Auth_Failed' }), controller.googleCallback);

  return router;
}

module.exports = authRoutes;
