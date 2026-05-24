const { Router } = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

function loteRoutes(controller) {
  const router = Router({ mergeParams: true });

  // Nested under /api/lotificaciones/:lotificationId/lotes
  router.get('/', controller.listByLotification);
  router.post('/', authMiddleware, adminOnly, controller.create);

  // Standalone lote operations
  router.get('/:id', controller.getById);
  router.put('/:id', authMiddleware, adminOnly, controller.update);
  router.delete('/:id', authMiddleware, adminOnly, controller.delete);

  // Pagos nested under lote
  router.post('/:loteId/pagos', authMiddleware, adminOnly, controller.addPago);
  router.delete('/:loteId/pagos/:pagoId', authMiddleware, adminOnly, controller.deletePago);

  return router;
}

module.exports = loteRoutes;
