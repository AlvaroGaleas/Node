export class PuestoController {
    constructor(puestoService) {
        this.puestoService = puestoService;
    }

    crear = async (req, res) => {
        try {
            const puesto = await this.puestoService.crearPuesto(req.body);
            res.status(201).json(puesto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    listar = async (req, res) => {
        const puestos = await this.puestoService.obtenerTodos();
        res.json(puestos);
    }

    obtenerUno = async (req, res) => {
        const puesto = await this.puestoService.obtenerPorId(req.params.id);
        if (!puesto) return res.status(404).json({ error: 'No encontrado' });
        res.json(puesto);
    }

    actualizar = async (req, res) => {
        try {
            const puesto = await this.puestoService.actualizarPuesto(req.params.id, req.body);
            res.json(puesto);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    eliminar = async (req, res) => {
        const exito = await this.puestoService.eliminarPuesto(req.params.id);
        if (!exito) return res.status(404).json({ error: 'No encontrado' });
        res.status(204).send();
    }
}