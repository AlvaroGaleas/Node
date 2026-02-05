import SuscripcionModel from './models/sequelize/SuscripcionModel.js';
import { Suscripcion } from '../../domain/entities/Suscripcion.js';

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
        const sub = await SuscripcionModel.findOne({
            where: {
                usuarioId: usuarioId,
                activa: true
            }
        });
        return this._toDomain(sub);
    }
}