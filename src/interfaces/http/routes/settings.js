const { Router } = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

function settingsRoutes(controller) {
  const router = Router();

  // Public GET
  router.get('/', controller.get);

  // Admin PUT
  router.put('/', authMiddleware, adminOnly, controller.update);

  return router;
}

module.exports = settingsRoutes;
