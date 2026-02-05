import mongoose from 'mongoose';

const OperacionDiariaSchema = new mongoose.Schema({
    fecha: { 
        type: Date, 
        required: true 
    },
    puesto: {
        idMysql: Number,
        numero: String,
        ubicacion: String
    },
    titular: {
        idMysql: Number,
        nombre: String,
        cedula: String
    },
    estado: {
        type: String,
        enum: ['ESPERANDO_CHECKIN', 'OCUPADO_TITULAR', 'LIBERADO_AUSENCIA', 'OCUPADO_ANONIMO'],
        default: 'ESPERANDO_CHECKIN'
    },
    checkIn: {
        hora: Date,
        metodo: { type: String, default: 'MANUAL' } 
    },
    ocupanteAnonimo: { 
        nombre: String,
        montoCobrado: Number // Aquí guardamos los $3.50 si se arrendó a otro
    },
    incidencias: [String] // Lista de notas ("Llegó tarde", "Puesto sucio")
});

// ÍNDICE COMPUESTO (Regla de Oro): 
// Evita que se dupliquen registros para el mismo puesto en la misma fecha.
OperacionDiariaSchema.index({ fecha: 1, "puesto.idMysql": 1 }, { unique: true });

export const OperacionDiariaModel = mongoose.model('OperacionDiaria', OperacionDiariaSchema);