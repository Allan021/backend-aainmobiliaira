const { Router } = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

function saleRoutes(controller) {
  const router = Router();
  router.get('/', authMiddleware, adminOnly, controller.list);
  router.post('/', authMiddleware, adminOnly, controller.create);
  router.get('/metrics', authMiddleware, adminOnly, controller.metrics);
  return router;
}

module.exports = saleRoutes;
