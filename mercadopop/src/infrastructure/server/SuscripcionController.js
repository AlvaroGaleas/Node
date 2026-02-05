export class SuscripcionController {
    constructor(suscripcionService) {
        this.suscripcionService = suscripcionService;
    }

    crear = async (req, res) => {
        try {
            const { usuarioId, tipo } = req.body;
            
            if (!usuarioId || !tipo) {
                return res.status(400).json({ error: 'Faltan datos: usuarioId y tipo son obligatorios' });
            }

            const resultado = await this.suscripcionService.comprarSuscripcion(usuarioId, tipo);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Endpoint para consultar estado
    consultarActiva = async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const activa = await this.suscripcionService.suscripcionRepository.findActiveByUsuarioId(usuarioId);
            if (!activa) return res.status(404).json({ message: 'No tiene suscripciones activas' });
            res.json(activa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    usarCredito = async (req, res) => {
        try {
            const { usuarioId } = req.body;
            if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });

            const resultado = await this.suscripcionService.realizarCheckIn(usuarioId);
            res.json(resultado);
        } catch (error) {
            // Si dice que no tiene saldo, es un 402 (Payment Required) o 409 (Conflict)
            // Usaremos 400
            res.status(400).json({ error: error.message });
        }
    }
    // Método para obtener la suscripción del usuario logueado
    obtenerPorUsuario = async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const suscripcion = await this.suscripcionService.obtenerSuscripcionDeUsuario(usuarioId);
            
            if (!suscripcion) {
                return res.status(404).json({ error: 'No tienes puestos asignados.' });
            }
            
            res.json(suscripcion);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}