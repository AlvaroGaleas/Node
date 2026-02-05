import { Usuario } from '../../domain/entities/Usuario.js';
import bcrypt from 'bcryptjs'; // <--- Importante
import jwt from 'jsonwebtoken'; // <--- Importante

export class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async registrarUsuario(datos) {
        // 1. Validar si ya existe
        const existente = await this.usuarioRepository.findByCedula(datos.cedula);
        if (existente) {
            throw new Error('Ya existe un usuario con esa cédula.');
        }

        // 2. Encriptar contraseña
        const passPlano = datos.password || '1234'; 
        const passwordHash = await bcrypt.hash(passPlano, 10);

        // 3. Crear la entidad (FÍJATE EN EL NOMBRE DE LA VARIABLE 👇)
        const usuarioParaGuardar = new Usuario(
            null,                   // id
            datos.nombreCompleto,   // nombre
            datos.cedula,           // cedula
            datos.rol,              // rol
            passwordHash,           // password (hash)
            1                       // estado
        );

        // 4. Guardar (USAMOS EL MISMO NOMBRE 👇)
        return await this.usuarioRepository.save(usuarioParaGuardar);
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
    async login(cedula, password) {
        // 1. Buscar usuario por cédula
        const usuario = await this.usuarioRepository.findByCedula(cedula);
        if (!usuario) {
            throw new Error('Credenciales inválidas (Usuario no encontrado)');
        }

        // 2. Comparar contraseñas (La que escribe vs La encriptada)
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas (Contraseña incorrecta)');
        }

        // 3. Generar el Token (El "carnet digital")
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, // Datos que van dentro del token
            process.env.JWT_SECRET || 'secreto_temporal', // Llave secreta
            { expiresIn: '8h' } // El token expira en 8 horas
        );

        // 4. Devolver usuario (sin password) y el token
        return {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombreCompleto,
                rol: usuario.rol
            },
            token
        };
    }
}