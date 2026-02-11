const express = require('express');
const router = express.Router();
const AdministradorController = require('../controllers/AdministradorController');
const authMiddleware = require('../middleware/authMiddleware');

const administradorController = new AdministradorController();

// Rutas públicas
router.get('/registro', administradorController.mostrarRegistro);
router.post('/registro', administradorController.registrar);
router.get('/login', administradorController.mostrarLogin);
router.post('/login', administradorController.login);
router.get('/logout', administradorController.logout);

// Rutas protegidas
router.get('/dashboard', authMiddleware, administradorController.dashboard);

module.exports = router;