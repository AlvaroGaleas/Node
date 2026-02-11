import UsuarioModel from './models/sequelize/UsuarioModel.js';
import { Usuario } from '../../domain/entities/Usuario.js';
import bcrypt from 'bcryptjs';

export class MySQLUsuarioRepository {

    // Helper privado para convertir de Modelo Sequelize a Entidad de Dominio
    _toDomain(modeloSequelize) {
        if (!modeloSequelize) return null;
        const data = modeloSequelize.toJSON();
        return new Usuario(
            data.id,
            data.nombreCompleto,
            data.cedula,
            data.rol,
            data.password, 
            data.estado   
        );
    }

    async save(usuario) {
        
        const nuevo = await UsuarioModel.create({  
            nombreCompleto: usuario.nombreCompleto,
            cedula: usuario.cedula,
            rol: usuario.rol,
            password: usuario.password, 
            estado: usuario.estado      
        });

        return this._toDomain(nuevo); 
    }

    async findById(id) {
        const usuario = await UsuarioModel.findByPk(id);
        return this._toDomain(usuario);
    }

    async findByCedula(cedula) {
        const usuario = await UsuarioModel.findOne({ where: { cedula } });
        return this._toDomain(usuario);
    }

    async findAll() {
        const usuarios = await UsuarioModel.findAll();
        return usuarios.map(u => this._toDomain(u));
    }
}