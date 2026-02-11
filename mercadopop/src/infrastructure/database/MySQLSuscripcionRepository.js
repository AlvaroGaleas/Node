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
    // Asegúrate de tener esto arriba: import PuestoModel from './models/sequelize/PuestoModel.js';

    async findByUsuarioId(usuarioId) {
        // PASO A: Buscamos la suscripción activa (Corregimos 'estado' por 'activa')
        const suscripcion = await SuscripcionModel.findOne({
            where: { 
                usuarioId: usuarioId,
                activa: 1  // <--- ¡CORREGIDO! Usamos el nombre real de la columna en MySQL
            }
        });

        // Si no tiene plan activo, retornamos null
        if (!suscripcion) return null;

        // PASO B: Buscamos el Puesto en la tabla correcta ('puestos')
        // Buscamos qué puesto tiene a este usuario como titular
        const puesto = await PuestoModel.findOne({
            where: { usuarioTitularId: usuarioId }
        });

        // PASO C: Unimos los datos manualmente
        const datos = suscripcion.toJSON();

        // Si encontramos puesto, se lo agregamos a la respuesta
        if (puesto) {
            datos.puesto = puesto.toJSON();
            datos.puestoId = puesto.id; // <--- ¡Esto activará el botón en el Frontend!
        }

        // PASO D: Calculamos el Saldo
        // (4 créditos totales - 0 usados = 4 restantes)
        const total = datos.creditosTotales || datos.creditos_totales || 0;
        const usados = datos.creditosUsados || datos.creditos_usados || 0;
        datos.creditosRestantes = total - usados;

        return datos;
    }
}