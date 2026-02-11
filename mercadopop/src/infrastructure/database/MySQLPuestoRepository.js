import PuestoModel from './models/sequelize/PuestoModel.js';
import { Puesto } from '../../domain/entities/Puesto.js';

export class MySQLPuestoRepository {

    // Helper para convertir de Sequelize - Dominio
    _toDomain(data) {
        if (!data) return null;
        const json = data.toJSON ? data.toJSON() : data; 
        return new Puesto(
            json.id, 
            json.numero, 
            json.ubicacion, 
            json.estado, 
            json.usuarioTitularId
        );
    }

    async save(puesto) {
        // Upsert: Si tiene ID, actualiza. Si no, crea.
        if (puesto.id) {
            await PuestoModel.update({
                numero: puesto.numero,
                ubicacion: puesto.ubicacion,
                estado: puesto.estado,
                usuarioTitularId: puesto.usuarioTitularId
            }, {
                where: { id: puesto.id }
            });
            return await this.findById(puesto.id);
        } else {
            const nuevo = await PuestoModel.create({
                numero: puesto.numero,
                ubicacion: puesto.ubicacion,
                estado: puesto.estado,
                usuarioTitularId: puesto.usuarioTitularId
            });
            return this._toDomain(nuevo);
        }
    }

    async findById(id) {
        const puesto = await PuestoModel.findByPk(id);
        return this._toDomain(puesto);
    }

    async findAll() {
        const puestos = await PuestoModel.findAll();
        return puestos.map(p => this._toDomain(p));
    }
}