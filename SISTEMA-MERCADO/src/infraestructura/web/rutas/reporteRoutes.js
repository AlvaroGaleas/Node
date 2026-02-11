const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');
const authMiddleware = require('../middleware/authMiddleware');

const reporteController = new ReporteController();

// Rutas protegidas
router.use(authMiddleware);

router.post('/generar/:id', reporteController.generarReporteDiario);
router.get('/diario/:id', reporteController.mostrarReporteDiario);
router.get('/historico', reporteController.mostrarHistorico);
router.get('/api/metricas', reporteController.obtenerMetricasAPI);

module.exports = router;