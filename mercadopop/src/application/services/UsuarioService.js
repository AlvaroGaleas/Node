import { Usuario } from '../../domain/entities/Usuario.js';

export class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async registrarUsuario(datos) {
        // 1. Validar si ya existe la cédula
        const existente = await this.usuarioRepository.findByCedula(datos.cedula);
        if (existente) {
            throw new Error('Ya existe un usuario con esa cédula.');
        }

        // 2. Crear la entidad
        const nuevoUsuario = new Usuario(
            null, 
            datos.nombreCompleto, 
            datos.cedula, 
            datos.rol
        );

        // 3. Guardar
        return await this.usuarioRepository.save(nuevoUsuario);
    }

    async listarUsuarios() {
        return await this.usuarioRepository.findAll();
    }
    async obtenerUsuarioPorId(id) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado.');
        }
        return usuario;
    }

    async actualizarUsuario(id, datos) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) throw new Error('Usuario no encontrado');

        // Actualizamos solo lo que viene
        if (datos.nombreCompleto) usuario.nombreCompleto = datos.nombreCompleto;
        if (datos.rol) usuario.rol = datos.rol;
        // La cédula usualmente no se edita por seguridad

        return await this.usuarioRepository.update(usuario);
    }

    async eliminarUsuario(id) {
        return await this.usuarioRepository.delete(id);
    }
}