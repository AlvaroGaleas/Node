import express from 'express';

export function crearPuestoRouter(puestoController) {
    const router = express.Router();

    router.post('/', puestoController.crear);
    router.get('/', puestoController.listar);
    router.get('/:id', puestoController.obtenerUno);
    router.put('/:id', puestoController.actualizar);
    router.delete('/:id', puestoController.eliminar);

    return router;
}