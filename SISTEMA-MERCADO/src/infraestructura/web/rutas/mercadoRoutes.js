const express = require('express');
const router = express.Router();
const MercadoController = require('../controllers/MercadoController');
const authMiddleware = require('../middleware/authMiddleware');

const mercadoController = new MercadoController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/iniciar-dia', mercadoController.mostrarIniciarDia);
router.post('/iniciar-dia', mercadoController.iniciarDia);
router.get('/gestionar/:id', mercadoController.mostrarGestionar);
router.get('/alquilar-puesto/:id', mercadoController.mostrarFormularioPuesto);
router.post('/alquilar-puesto/:id', mercadoController.alquilarPuesto);

module.exports = router;