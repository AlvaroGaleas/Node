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
            data.password, // <--- ¡AQUÍ ESTÁ LA CLAVE! (5to lugar)
            data.estado    // (6to lugar - opcional)
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

        // Devolvemos 'nuevo', que es la variable que acabamos de crear
        return this._toDomain(nuevo); 
    }

    async findById(id) {
        // Sequelize: .findByPk() reemplaza al SELECT WHERE id = ?
        const usuario = await UsuarioModel.findByPk(id);
        return this._toDomain(usuario);
    }

    async findByCedula(cedula) {
        // Sequelize: .findOne({ where: ... }) reemplaza al SELECT WHERE cedula = ?
        const usuario = await UsuarioModel.findOne({ where: { cedula } });
        return this._toDomain(usuario);
    }

    async findAll() {
        // Sequelize: .findAll() reemplaza al SELECT *
        const usuarios = await UsuarioModel.findAll();
        return usuarios.map(u => this._toDomain(u));
    }
    
    // update y delete serían .update() y .destroy() respectivamente
}