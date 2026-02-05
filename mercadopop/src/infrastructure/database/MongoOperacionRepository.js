import { OperacionDiariaModel } from './models/OperacionDiariaModel.js';

export class MongoOperacionRepository {

    // 1. Iniciar el día: Recibe una lista de puestos y usuarios de MySQL
    // y crea los documentos en Mongo.
    async inicializarDia(fecha, listaPuestosConUsuario) {
        const operaciones = listaPuestosConUsuario.map(item => ({
            fecha: fecha,
            puesto: {
                idMysql: item.puesto.id,
                numero: item.puesto.numero,
                ubicacion: item.puesto.ubicacion
            },
            titular: item.usuario ? {
                idMysql: item.usuario.id,
                nombre: item.usuario.nombreCompleto,
                cedula: item.usuario.cedula
            } : null,
            estado: 'ESPERANDO_CHECKIN'
        }));

        // ordered: false permite que si uno falla (ej: duplicado), los demás sigan
        try {
            return await OperacionDiariaModel.insertMany(operaciones, { ordered: false });
        } catch (error) {
            // Ignoramos error de duplicados (E11000) por si se corre 2 veces el script
            if (error.code === 11000) {
                console.log('Algunos registros ya existían para esta fecha.');
                return []; 
            }
            throw error;
        }
    }

    // 2. Buscar por Puesto y Fecha
    async buscarPorPuestoYFecha(puestoId, fecha) {
        // Usamos inicio y fin del día para asegurar la búsqueda
        const inicioDia = new Date(fecha); inicioDia.setHours(0,0,0,0);
        const finDia = new Date(fecha); finDia.setHours(23,59,59,999);

        return await OperacionDiariaModel.findOne({
            "puesto.idMysql": puestoId,
            fecha: { $gte: inicioDia, $lte: finDia }
        });
    }

    // Modifica este método para recibir un cuarto parámetro opcional "datosExtra"
    async actualizarEstado(idMongo, nuevoEstado, datosCheckIn = null, datosExtra = null) {
        const update = { estado: nuevoEstado };
        if (datosCheckIn) update.checkIn = datosCheckIn;
        
        // Si vienen datos del anónimo, los agregamos al update
        if (datosExtra && datosExtra.ocupanteAnonimo) {
            update.ocupanteAnonimo = datosExtra.ocupanteAnonimo;
        }

        return await OperacionDiariaModel.findByIdAndUpdate(idMongo, update, { new: true });
    }
    async obtenerTodasPorFecha(fecha) {
        const inicioDia = new Date(fecha); inicioDia.setHours(0,0,0,0);
        const finDia = new Date(fecha); finDia.setHours(23,59,59,999);

        // Traemos todo lo que pasó ese día
        return await OperacionDiariaModel.find({
            fecha: { $gte: inicioDia, $lte: finDia }
        });
    }
    async agregarIncidencia(idMongo, nota) {
        return await OperacionDiariaModel.findByIdAndUpdate(
            idMongo,
            { $push: { incidencias: nota } }, 
            { new: true }
        );
    }
}