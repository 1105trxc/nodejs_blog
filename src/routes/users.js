const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/register', userController.renderRegister);
router.post('/register', userController.register);
router.get('/login', userController.renderLogin);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;
