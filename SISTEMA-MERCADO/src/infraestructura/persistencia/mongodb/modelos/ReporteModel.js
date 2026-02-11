const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
    reporte_id: {
        type: String,
        required: true,
        unique: true,
    },
    dia_mercado_id: {
        type: String,
        required: true,
    },
    administrador_id: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    total_recaudado: {
        type: Number,
        required: true,
        default: 0,
    },
    puestos_ocupados: {
        type: Number,
        required: true,
        default: 0,
    },
    puestos_libres: {
        type: Number,
        required: true,
        default: 0,
    },
    detalles_puestos: [{
        numero_puesto: Number,
        ocupado: Boolean,
        nombre: String,
        apellido: String,
        telefono: String,
        pagado: Boolean,
    }],
    fecha_generacion: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: 'reportes_diarios',
});

const ReporteModel = mongoose.model('Reporte', reporteSchema);

module.exports = ReporteModel;