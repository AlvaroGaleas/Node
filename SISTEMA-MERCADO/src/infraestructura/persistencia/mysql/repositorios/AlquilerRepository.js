// src/infraestructura/persistencia/mysql/repositorios/AlquilerRepository.js
const Alquiler = require('../../../../dominio/entidades/Alquiler');
const AlquilerModel = require('../modelos/AlquilerModel');

class AlquilerRepository {
    async crear(alquilerData) {
        const alquilerModel = await AlquilerModel.create({
            dia_mercado_id: alquilerData.diaMercadoId,
            numero_puesto: alquilerData.numeroPuesto,
            nombre: alquilerData.nombre,
            apellido: alquilerData.apellido,
            telefono: alquilerData.telefono,
            email: alquilerData.email,
            pagado: alquilerData.pagado,
            fecha_pago: alquilerData.fechaPago,
        });
        
        return new Alquiler({
            id: alquilerModel.id,
            diaMercadoId: alquilerModel.dia_mercado_id,
            numeroPuesto: alquilerModel.numero_puesto,
            nombre: alquilerModel.nombre,
            apellido: alquilerModel.apellido,
            telefono: alquilerModel.telefono,
            email: alquilerModel.email,
            pagado: alquilerModel.pagado,
            fechaPago: alquilerModel.fecha_pago,
            fechaCreacion: alquilerModel.fecha_creacion,
        });
    }

    async buscarPorDiaMercado(diaMercadoId) {
        const alquileresModel = await AlquilerModel.findAll({
            where: { dia_mercado_id: diaMercadoId },
            order: [['numero_puesto', 'ASC']],
        });
        
        return alquileresModel.map(model => new Alquiler({
            id: model.id,
            diaMercadoId: model.dia_mercado_id,
            numeroPuesto: model.numero_puesto,
            nombre: model.nombre,
            apellido: model.apellido,
            telefono: model.telefono,
            email: model.email,
            pagado: model.pagado,
            fechaPago: model.fecha_pago,
            fechaCreacion: model.fecha_creacion,
        }));
    }

    async buscarPorPuesto(diaMercadoId, numeroPuesto) {
        const alquilerModel = await AlquilerModel.findOne({
            where: {
                dia_mercado_id: diaMercadoId,
                numero_puesto: numeroPuesto,
            },
        });
        
        if (!alquilerModel) return null;
        
        return new Alquiler({
            id: alquilerModel.id,
            diaMercadoId: alquilerModel.dia_mercado_id,
            numeroPuesto: alquilerModel.numero_puesto,
            nombre: alquilerModel.nombre,
            apellido: alquilerModel.apellido,
            telefono: alquilerModel.telefono,
            email: alquilerModel.email,
            pagado: alquilerModel.pagado,
            fechaPago: alquilerModel.fecha_pago,
            fechaCreacion: alquilerModel.fecha_creacion,
        });
    }

    async actualizar(id, datos) {
        const [updated] = await AlquilerModel.update(datos, {
            where: { id },
            returning: true,
        });
        
        return updated;
    }

    async eliminar(id) {
        return await AlquilerModel.destroy({ where: { id } });
    }
}

module.exports = AlquilerRepository;