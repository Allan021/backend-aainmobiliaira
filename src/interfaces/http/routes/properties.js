const { Router } = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

function propertyRoutes(controller) {
  const router = Router();

  // Public
  router.get('/', controller.list);
  router.get('/stats', controller.stats);
  router.get('/:id', controller.getById);

  // Admin
  router.post('/', authMiddleware, adminOnly, controller.create);
  router.put('/:id', authMiddleware, adminOnly, controller.update);
  router.delete('/:id', authMiddleware, adminOnly, controller.delete);
  router.post('/:id/images', authMiddleware, adminOnly, upload.single('image'), controller.uploadImage);
  router.delete('/:id/images/:imageId', authMiddleware, adminOnly, controller.deleteImage);
  router.post('/:id/publish', authMiddleware, adminOnly, controller.publishToFacebook);

  return router;
}

module.exports = propertyRoutes;
