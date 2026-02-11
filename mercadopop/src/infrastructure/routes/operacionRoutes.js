import express from 'express';
// 1. IMPORTAR VALIDATORS
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validationMiddleware.js';

export function crearOperacionRouter(operacionController) {
    const router = express.Router();

    // Apertura (Validar fecha si la envían)
    router.post(
        '/apertura', 
        [
            body('fecha').optional().isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
            validarCampos
        ],
        operacionController.abrirDia
    );
    /**
   * @swagger
   * /operaciones/check-in:
   * post:
   * summary: Realizar Check-in de un titular
   * tags: [Operaciones]
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema:
   * type: object
   * required:
   * - puestoId
   * properties:
   * puestoId:
   * type: integer
   * description: ID del puesto en MySQL
   * fecha:
   * type: string
   * format: date
   * description: Fecha de operación (YYYY-MM-DD)
   * responses:
   * 200:
   * description: Check-in exitoso
   * 400:
   * description: Error de validación o falta de saldo
   */


    // Check-in (Validar puestoId)
    router.post(
        '/check-in', 
        [
            body('puestoId').isNumeric().withMessage('El ID del puesto debe ser numérico'),
            validarCampos
        ],
        operacionController.checkIn
    );

    // Incidencia (Validar que no envíen descripción vacía)
    router.post(
        '/incidencia', 
        [
            body('puestoId').isNumeric(),
            body('descripcion').notEmpty().withMessage('La descripción de la incidencia es obligatoria'),
            validarCampos
        ],
        operacionController.reportarIncidencia
    );

    // Alquiler Anónimo (Validar nombre del cliente)
    router.post(
        '/alquiler-anonimo',
        [
            body('puestoId').isNumeric(),
            body('nombreCliente').notEmpty().withMessage('El nombre del cliente es obligatorio'),
            validarCampos
        ],
        operacionController.alquilarExterno
    );

    // otras rutas (GET reporte, POST ausencia, etc.
    router.post('/ausencia', operacionController.registrarAusencia);
    router.get('/reporte', operacionController.obtenerReporte);

    return router;
}