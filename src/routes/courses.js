const express = require('express');
const router = express.Router();

const courseControllers = require('../app/controllers/CourseController');
const { requireAuth } = require('../app/middlewares/authMiddleware');

router.use(requireAuth);

router.get('/create', courseControllers.create);
router.post('/store', courseControllers.store);
router.post('/handle-form-actions', courseControllers.handleFormActions);
router.get('/:id/edit', courseControllers.edit);
router.put('/:id/', courseControllers.update);
router.patch('/:id/restore', courseControllers.restore);
router.delete('/:id/', courseControllers.delete);
router.delete('/:id/force', courseControllers.forceDelete);
router.get('/:slug', courseControllers.show);

module.exports = router;
