// src/infraestructura/persistencia/mysql/repositorios/AdministradorRepository.js
const Administrador = require('../../../../dominio/entidades/Administrador');
const AdministradorModel = require('../modelos/AdministradorModel');

class AdministradorRepository {
    async crear(administradorData) {
        const administradorModel = await AdministradorModel.create({
            nombre_usuario: administradorData.nombreUsuario,
            email: administradorData.email,
            password_hash: administradorData.passwordHash,
            total_puestos: administradorData.totalPuestos,
        });
        
        return new Administrador({
            id: administradorModel.id,
            nombreUsuario: administradorModel.nombre_usuario,
            email: administradorModel.email,
            passwordHash: administradorModel.password_hash,
            totalPuestos: administradorModel.total_puestos,
            fechaCreacion: administradorModel.fecha_creacion,
        });
    }

    async buscarPorId(id) {
        const administradorModel = await AdministradorModel.findByPk(id);  // CORREGIDO: findByPk, no findOneByPK
        if (!administradorModel) return null;
        
        return new Administrador({
            id: administradorModel.id,
            nombreUsuario: administradorModel.nombre_usuario,
            email: administradorModel.email,
            passwordHash: administradorModel.password_hash,
            totalPuestos: administradorModel.total_puestos,
            fechaCreacion: administradorModel.fecha_creacion,
        });
    }

    async buscarPorEmail(email) {
        const administradorModel = await AdministradorModel.findOne({ where: { email } });
        if (!administradorModel) return null;
        
        return new Administrador({
            id: administradorModel.id,
            nombreUsuario: administradorModel.nombre_usuario,
            email: administradorModel.email,
            passwordHash: administradorModel.password_hash,
            totalPuestos: administradorModel.total_puestos,
            fechaCreacion: administradorModel.fecha_creacion,
        });
    }

    async buscarPorUsuario(nombreUsuario) {
        const administradorModel = await AdministradorModel.findOne({ 
            where: { nombre_usuario: nombreUsuario } 
        });
        if (!administradorModel) return null;
        
        return new Administrador({
            id: administradorModel.id,
            nombreUsuario: administradorModel.nombre_usuario,
            email: administradorModel.email,
            passwordHash: administradorModel.password_hash,
            totalPuestos: administradorModel.total_puestos,
            fechaCreacion: administradorModel.fecha_creacion,
        });
    }

    async actualizar(id, datos) {
        const [updated] = await AdministradorModel.update(datos, {
            where: { id },
            returning: true,
        });
        
        return updated;
    }
}

module.exports = AdministradorRepository;