const express = require('express');
const router = express.Router();

const courseControllers = require('../app/controllers/CourseController');

router.get('/create', courseControllers.create);
router.post('/store', courseControllers.store);
router.get('/:id/edit', courseControllers.edit);
router.put('/:id/', courseControllers.update);
router.delete('/:id/', courseControllers.delete);
router.get('/:slug', courseControllers.show);

module.exports = router;
