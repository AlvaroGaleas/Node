import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errors.mapped() // Devuelve un objeto detallado del error
        });
    }
    next(); // Si todo está bien, deja pasar al controlador
};