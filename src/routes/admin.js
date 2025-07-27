const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const { requireAdmin } = require('../app/middlewares/authMiddleware');

router.use(requireAdmin);

router.get('/stored/users', adminController.storedUsers);

module.exports = router;
