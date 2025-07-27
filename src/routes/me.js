const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
const { requireAuth } = require('../app/middlewares/authMiddleware');

router.use(requireAuth);

router.get('/stored/courses', meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);

module.exports = router;
