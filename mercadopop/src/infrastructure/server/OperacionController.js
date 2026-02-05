export class OperacionController {
    constructor(operacionService) {
        this.operacionService = operacionService;
    }

    abrirDia = async (req, res) => {
        try {
            // Si mandan fecha en el body la usamos, si no, usamos la fecha actual
            const fecha = req.body.fecha ? new Date(req.body.fecha) : new Date();
            
            const resultados = await this.operacionService.abrirMercado(fecha);
            
            res.status(201).json({
                mensaje: 'Día operativo iniciado en MongoDB',
                totalPuestosGenerados: resultados.length,
                fecha: fecha.toISOString().split('T')[0] // Muestra solo la parte YYYY-MM-DD
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    checkIn = async (req, res) => {
        try {
            const { puestoId, fecha } = req.body; // puestoId es el ID de MySQL
            
            if (!puestoId) return res.status(400).json({ error: 'Falta puestoId' });

            // Usamos la fecha que manden o la de hoy
            const fechaOperacion = fecha ? new Date(fecha) : new Date();

            const resultado = await this.operacionService.realizarCheckInTitular(puestoId, fechaOperacion);
            
            res.json(resultado);
        } catch (error) {
            // Si falla el cobro (sin saldo), devolvemos 400
            res.status(400).json({ error: error.message });
        }
    }
    registrarAusencia = async (req, res) => {
        try {
            const { puestoId, fecha } = req.body;
            const fechaOp = fecha ? new Date(fecha) : new Date();
            const result = await this.operacionService.liberarPorAusencia(puestoId, fechaOp);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    alquilarExterno = async (req, res) => {
        try {
            const { puestoId, nombreCliente, fecha } = req.body;
            const fechaOp = fecha ? new Date(fecha) : new Date();
            const result = await this.operacionService.alquilarAnonimo(
                puestoId, 
                { nombre: nombreCliente }, 
                fechaOp
            );
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    obtenerReporte = async (req, res) => {
        try {
            // Recibimos fecha por URL query (ej: ?fecha=2026-02-06) o usamos hoy
            const fechaQuery = req.query.fecha; 
            const fecha = fechaQuery ? new Date(fechaQuery) : new Date();
            
            const reporte = await this.operacionService.generarReporteDiario(fecha);
            res.json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    reportarIncidencia = async (req, res) => {
        try {
            const { puestoId, descripcion, fecha } = req.body;
            
            if (!descripcion) return res.status(400).json({ error: 'Falta la descripción de la incidencia' });

            const fechaOp = fecha ? new Date(fecha) : new Date();
            
            const result = await this.operacionService.registrarIncidencia(puestoId, descripcion, fechaOp);
            
            res.json({ 
                mensaje: 'Incidencia registrada correctamente', 
                incidenciasActuales: result.incidencias 
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}