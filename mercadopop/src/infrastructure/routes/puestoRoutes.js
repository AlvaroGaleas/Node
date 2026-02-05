import express from 'express';
// Nota: Importamos las clases, no las instancias. Las inyectaremos en el index.

export function crearPuestoRouter(puestoController) {
    const router = express.Router();

    router.post('/', puestoController.crear);
    router.get('/', puestoController.listar);
    router.get('/:id', puestoController.obtenerUno);
    router.put('/:id', puestoController.actualizar);
    router.delete('/:id', puestoController.eliminar);

    return router;
}