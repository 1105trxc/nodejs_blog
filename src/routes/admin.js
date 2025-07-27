const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const { requireAdmin } = require('../app/middlewares/authMiddleware');

router.use(requireAdmin);

router.post('/handle-form-actions', adminController.handleFormActions);
router.get('/stored/users', adminController.storedUsers);
router.delete('/users/:id/', adminController.delete);

module.exports = router;
