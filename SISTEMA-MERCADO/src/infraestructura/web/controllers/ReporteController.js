const ReporteRepository = require('../../persistencia/mongodb/repositorios/ReporteRepository');
const DiaMercadoRepository = require('../../persistencia/mysql/repositorios/DiaMercadoRepository');
const AlquilerRepository = require('../../persistencia/mysql/repositorios/AlquilerRepository');
const AdministradorRepository = require('../../persistencia/mysql/repositorios/AdministradorRepository');
const GenerarReporte = require('../../../aplicacion/casosuso/GenerarReporte');

class ReporteController {
    constructor() {
        this.reporteRepository = new ReporteRepository();
        this.diaMercadoRepository = new DiaMercadoRepository();
        this.alquilerRepository = new AlquilerRepository();
        this.administradorRepository = new AdministradorRepository();
        this.generarReporte = new GenerarReporte(
            this.diaMercadoRepository,
            this.alquilerRepository,
            this.reporteRepository,
            this.administradorRepository
        );
    }

    async generarReporteDiario(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;

        try {
            const resultado = await this.generarReporte.ejecutar(id);
            
            res.render('reportes/diario', {
                reporte: resultado.reporte,
                diaMercado: resultado.diaMercado,
                administrador: resultado.administrador,
                totalRecaudado: resultado.totalRecaudado,
                puestosOcupados: resultado.puestosOcupados,
                puestosLibres: resultado.puestosLibres,
                detallesPuestos: resultado.detallesPuestos,
            });
        } catch (error) {
            res.redirect(`/mercado/gestionar/${id}?error=${encodeURIComponent(error.message)}`);
        }
    }

    async mostrarReporteDiario(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;

        try {
            const reporte = await this.reporteRepository.buscarPorDiaMercado(id);
            if (!reporte) {
                throw new Error('Reporte no encontrado');
            }

            // Verificar que el reporte pertenezca al administrador
            if (reporte.administrador_id !== req.session.administradorId) {
                throw new Error('No autorizado');
            }

            const diaMercado = await this.diaMercadoRepository.buscarPorId(id);
            const administrador = await this.administradorRepository.buscarPorId(req.session.administradorId);

            res.render('reportes/diario', {
                reporte,
                diaMercado,
                administrador,
                totalRecaudado: reporte.total_recaudado,
                puestosOcupados: reporte.puestos_ocupados,
                puestosLibres: reporte.puestos_libres,
                detallesPuestos: reporte.detalles_puestos,
            });
        } catch (error) {
            res.redirect('/mercado/iniciar-dia');
        }
    }

    async mostrarHistorico(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        try {
            const reportes = await this.reporteRepository.buscarPorAdministrador(
                req.session.administradorId
            );

            const administrador = await this.administradorRepository.buscarPorId(
                req.session.administradorId
            );

            res.render('reportes/historico', {
                reportes,
                administrador,
            });
        } catch (error) {
            res.render('reportes/historico', {
                error: error.message,
                reportes: [],
            });
        }
    }

    // Endpoint para Power BI
    async obtenerMetricasAPI(req, res) {
        if (!req.session.administradorId) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        try {
            const { fecha_inicio, fecha_fin } = req.query;
            
            const reportes = await this.reporteRepository.buscarPorRangoFechas(
                req.session.administradorId,
                fecha_inicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días por defecto
                fecha_fin || new Date()
            );

            // Calcular métricas para Power BI
            const metricas = {
                administrador_id: req.session.administradorId,
                rango_fechas: {
                    inicio: fecha_inicio,
                    fin: fecha_fin,
                },
                datos: reportes.map(reporte => ({
                    fecha: reporte.fecha,
                    total_recaudado: reporte.total_recaudado,
                    puestos_ocupados: reporte.puestos_ocupados,
                    puestos_libres: reporte.puestos_libres,
                    tasa_ocupacion: (reporte.puestos_ocupados / 
                        (reporte.puestos_ocupados + reporte.puestos_libres)) * 100,
                    promedio_ingreso_por_puesto: reporte.puestos_ocupados > 0 ? 
                        reporte.total_recaudado / reporte.puestos_ocupados : 0,
                })),
                resumen: {
                    total_recaudado: reportes.reduce((sum, r) => sum + r.total_recaudado, 0),
                    promedio_diario: reportes.length > 0 ? 
                        reportes.reduce((sum, r) => sum + r.total_recaudado, 0) / reportes.length : 0,
                    total_dias: reportes.length,
                    mejor_dia: reportes.length > 0 ? 
                        reportes.reduce((max, r) => r.total_recaudado > max.total_recaudado ? r : max) : null,
                },
            };

            res.json(metricas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ReporteController;