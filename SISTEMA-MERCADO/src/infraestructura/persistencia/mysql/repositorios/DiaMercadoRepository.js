// src/infraestructura/persistencia/mysql/repositorios/DiaMercadoRepository.js
const DiaMercado = require('../../../../dominio/entidades/DiaMercado');
const DiaMercadoModel = require('../modelos/DiaMercadoModel');

class DiaMercadoRepository {
    async crear(diaMercadoData) {
        const diaMercadoModel = await DiaMercadoModel.create({
            administrador_id: diaMercadoData.administradorId,
            fecha: diaMercadoData.fecha,
            estado: diaMercadoData.estado,
            total_recaudado: diaMercadoData.totalRecaudado,
        });
        
        return new DiaMercado({
            id: diaMercadoModel.id,
            administradorId: diaMercadoModel.administrador_id,
            fecha: diaMercadoModel.fecha,
            estado: diaMercadoModel.estado,
            totalRecaudado: parseFloat(diaMercadoModel.total_recaudado),
            fechaCreacion: diaMercadoModel.fecha_creacion,
        });
    }

    async buscarPorId(id) {
        const diaMercadoModel = await DiaMercadoModel.findByPk(id);
        if (!diaMercadoModel) return null;
        
        return new DiaMercado({
            id: diaMercadoModel.id,
            administradorId: diaMercadoModel.administrador_id,
            fecha: diaMercadoModel.fecha,
            estado: diaMercadoModel.estado,
            totalRecaudado: parseFloat(diaMercadoModel.total_recaudado),
            fechaCreacion: diaMercadoModel.fecha_creacion,
        });
    }

    async buscarPorAdministradorYFecha(administradorId, fecha) {
        const diaMercadoModel = await DiaMercadoModel.findOne({
            where: {
                administrador_id: administradorId,
                fecha: fecha,
            },
        });
        
        if (!diaMercadoModel) return null;
        
        return new DiaMercado({
            id: diaMercadoModel.id,
            administradorId: diaMercadoModel.administrador_id,
            fecha: diaMercadoModel.fecha,
            estado: diaMercadoModel.estado,
            totalRecaudado: parseFloat(diaMercadoModel.total_recaudado),
            fechaCreacion: diaMercadoModel.fecha_creacion,
        });
    }

    async listarPorAdministrador(administradorId) {
        const diasMercadoModel = await DiaMercadoModel.findAll({
            where: { administrador_id: administradorId },
            order: [['fecha', 'DESC']],
        });
        
        return diasMercadoModel.map(model => new DiaMercado({
            id: model.id,
            administradorId: model.administrador_id,
            fecha: model.fecha,
            estado: model.estado,
            totalRecaudado: parseFloat(model.total_recaudado),
            fechaCreacion: model.fecha_creacion,
        }));
    }

    async actualizar(id, datos) {
        const [updated] = await DiaMercadoModel.update(datos, {
            where: { id },
            returning: true,
        });
        
        return updated;
    }
}

module.exports = DiaMercadoRepository;