const { Router } = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

function leadRoutes(controller) {
  const router = Router();

  // Public — create lead from WhatsApp modal
  router.post('/', controller.create);

  // Admin
  router.get('/', authMiddleware, adminOnly, controller.list);
  router.get('/:id', authMiddleware, adminOnly, controller.getById);
  router.patch('/:id/status', authMiddleware, adminOnly, controller.updateStatus);
  router.delete('/:id', authMiddleware, adminOnly, controller.delete);

  return router;
}

module.exports = leadRoutes;
