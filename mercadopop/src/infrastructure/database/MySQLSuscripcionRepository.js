import SuscripcionModel from './models/sequelize/SuscripcionModel.js';
import { Suscripcion } from '../../domain/entities/Suscripcion.js';
import PuestoModel from './models/sequelize/PuestoModel.js';

export class MySQLSuscripcionRepository {

    _toDomain(data) {
        if (!data) return null;
        const json = data.toJSON ? data.toJSON() : data;
        return new Suscripcion(
            json.id,
            json.usuarioId,
            json.tipo,
            json.creditosTotales,
            json.creditosUsados,
            json.fechaInicio,
            json.activa
        );
    }

    async save(suscripcion) {
        if (suscripcion.id) {
            // Actualizar
            await SuscripcionModel.update({
                creditosUsados: suscripcion.creditosUsados,
                activa: suscripcion.activa
            }, {
                where: { id: suscripcion.id }
            });
            return await this.findById(suscripcion.id);
        } else {
            // Crear nueva
            const nueva = await SuscripcionModel.create({
                usuarioId: suscripcion.usuarioId,
                tipo: suscripcion.tipo,
                creditosTotales: suscripcion.creditosTotales,
                creditosUsados: 0,
                activa: true,
                fechaInicio: new Date()
            });
            return this._toDomain(nueva);
        }
    }

    async findById(id) {
        const sub = await SuscripcionModel.findByPk(id);
        return this._toDomain(sub);
    }

    
    async findActiveByUserId(usuarioId) {
    console.log('--- BUSCANDO SUSCRIPCIÓN ACTIVA ---'); // <--- Agrega esto
    const sub = await SuscripcionModel.findOne({
        where: { usuarioId: usuarioId, activa: true }
    });
    return this._toDomain(sub);
    }
    async update(suscripcion) {
        // Actualizamos en la BD los créditos usados y si sigue activa
        await SuscripcionModel.update({
            creditosUsados: suscripcion.creditosUsados,
            activa: suscripcion.activa
        }, {
            where: { id: suscripcion.id }
        });
        
        // Devolvemos la versión actualizada
        return await this.findById(suscripcion.id);
    }
    async findByUsuarioId(usuarioId) {
        // 1. Buscamos la suscripción activa
        const suscripcion = await SuscripcionModel.findOne({
            where: { 
                usuarioId: usuarioId,
                activa: 1 
            }
        });

        // Si no hay suscripción, no seguimos
        if (!suscripcion) return null;

        // 2. AQUÍ ESTÁ EL TRUCO: Buscamos el puesto usando la relación que ya tienes en la tabla 'puestos'
        // Buscamos donde 'usuario_titular_id' sea igual a nuestro usuario
        const puesto = await PuestoModel.findOne({
            where: { usuarioTitularId: usuarioId }
        });

        // 3. Convertimos a objeto simple
        const datosSuscripcion = suscripcion.toJSON();

        // 4. Si encontramos el puesto, se lo "pegamos" a la respuesta
        if (puesto) {
            datosSuscripcion.puesto = puesto.toJSON(); // Aquí va el nombre, numero (TEST-5), etc.
            datosSuscripcion.puestoId = puesto.id;     // ¡Esto es lo que necesita el botón de Check-in!
        }

        return datosSuscripcion;
    }
}