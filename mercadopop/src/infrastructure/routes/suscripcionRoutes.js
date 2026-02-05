import express from 'express';
import { body } from 'express-validator'; 
import { validarCampos } from '../middlewares/validationMiddleware.js'; 

export function crearSuscripcionRouter(suscripcionController) {
    const router = express.Router();

    // POST /api/suscripciones
    router.post(
        '/', 
        [
            // REGLAS DE VALIDACIÓN
            body('usuarioId').isNumeric().withMessage('El ID de usuario debe ser numérico'),
            body('tipo').isIn(['DIARIO', 'PACK_4']).withMessage('El tipo debe ser DIARIO o PACK_4'),
            // EJECUTAR VALIDACIÓN
            validarCampos
        ],
        suscripcionController.crear
    );
    
    // Rutas
    router.post('/check-in', suscripcionController.usarCredito);
    router.get('/usuario/:usuarioId', suscripcionController.consultarActiva);
    router.get('/usuario/:usuarioId', suscripcionController.obtenerPorUsuario);

    return router;
}