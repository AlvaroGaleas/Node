import express from 'express';
import { body } from 'express-validator';
import { validarCampos } from '../middlewares/validationMiddleware.js';

export function crearUsuarioRouter(usuarioController) {
    const router = express.Router();

    // POST /api/usuarios (Crear Usuario)
    router.post(
        '/', 
        [
            //REGLAS DE VALIDACIÓN
            body('nombreCompleto').notEmpty().withMessage('El nombre es obligatorio'),
            body('cedula').isLength({ min: 10 }).withMessage('La cédula debe tener al menos 10 caracteres'),
            body('rol').isIn(['ADMIN', 'TITULAR', 'ARRENDATARIO']).withMessage('Rol inválido (Use: ADMIN, TITULAR o ARRENDATARIO)'),            
            //EJECUTAR MIDDLEWARE
            validarCampos
        ],
        usuarioController.crear
    );

    router.get('/', usuarioController.listar);
    router.get('/:id', usuarioController.obtenerPorId);
    router.post('/login', usuarioController.login);

    return router;
}