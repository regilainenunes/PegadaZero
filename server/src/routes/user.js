const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Todas as rotas de usuário requerem autenticação
router.use(auth);

// Rotas para gerenciamento de usuário
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/', userController.deleteAccount);

module.exports = router;