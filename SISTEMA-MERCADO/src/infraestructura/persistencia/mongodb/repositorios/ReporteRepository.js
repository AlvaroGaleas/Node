const { v4: uuidv4 } = require('uuid');
const ReporteModel = require('../modelos/ReporteModel');

class ReporteRepository {
    async crear(reporteData) {
        const reporte = new ReporteModel({
            reporte_id: uuidv4(),
            dia_mercado_id: reporteData.diaMercadoId,
            administrador_id: reporteData.administradorId,
            fecha: reporteData.fecha,
            total_recaudado: reporteData.totalRecaudado,
            puestos_ocupados: reporteData.puestosOcupados,
            puestos_libres: reporteData.puestosLibres,
            detalles_puestos: reporteData.detallesPuestos,
        });
        
        return await reporte.save();
    }

    async buscarPorDiaMercado(diaMercadoId) {
        return await ReporteModel.findOne({ dia_mercado_id: diaMercadoId });
    }

    async buscarPorAdministrador(administradorId) {
        return await ReporteModel.find({ administrador_id: administradorId })
            .sort({ fecha: -1 });
    }

    async buscarPorRangoFechas(administradorId, fechaInicio, fechaFin) {
        return await ReporteModel.find({
            administrador_id: administradorId,
            fecha: {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin),
            },
        }).sort({ fecha: 1 });
    }
}

module.exports = ReporteRepository;