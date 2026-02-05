import { Suscripcion } from '../../domain/entities/Suscripcion.js';

export class SuscripcionService {
    constructor(suscripcionRepository, usuarioRepository) {
        this.suscripcionRepository = suscripcionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async comprarSuscripcion(usuarioId, tipo) {
        // 1. Validar que el usuario exista
        const usuario = await this.usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new Error('El usuario no existe.');
        }

        // 2. Validar si ya tiene una suscripción activa (Opcional, pero recomendado)
        const activa = await this.suscripcionRepository.findActiveByUserId(usuarioId);
        if (activa) {
            throw new Error(`El usuario ya tiene una suscripción activa con ${activa.creditosTotales - activa.creditosUsados} créditos restantes.`);
        }

        // 3. Definir reglas del "Menú"
        let creditos = 0;
        let precio = 0;

        if (tipo === 'DIARIO') {
            creditos = 1;
            precio = 3.50;
        } else if (tipo === 'PACK_4') {
            creditos = 4;
            precio = 12.00;
        } else {
            throw new Error('Tipo de suscripción inválido. Use "DIARIO" o "PACK_4".');
        }

        // 4. Crear la entidad
        const nuevaSuscripcion = new Suscripcion(null, usuarioId, tipo, creditos);

        // 5. Guardar en BD
        const suscripcionGuardada = await this.suscripcionRepository.save(nuevaSuscripcion);

        // 6. Retornar info (incluyendo cuánto debe pagar)
        return {
            suscripcion: suscripcionGuardada,
            mensaje: `Suscripción ${tipo} creada. Debe pagar $${precio.toFixed(2)}`,
            montoAPagar: precio
        };

        
    }
    async realizarCheckIn(usuarioId) {
        // 1. Buscar suscripción activa
        const suscripcion = await this.suscripcionRepository.findActiveByUserId(usuarioId);
        
        if (!suscripcion) {
            throw new Error('El usuario no tiene suscripciones activas. Debe comprar un Pack o Pase Diario.');
        }

        // 2. Aplicar regla de negocio (La lógica está en la Entidad, no aquí)
        // Esto ejecuta: creditosUsados + 1. Y si llega al límite -> estado = FINALIZADA
        try {
            suscripcion.usarCredito(); 
        } catch (error) {
            throw new Error(error.message);
        }

        // 3. Guardar los cambios en la BD
        await this.suscripcionRepository.update(suscripcion);

        return {
            mensaje: 'Check-in exitoso. Crédito descontado.',
            creditosRestantes: suscripcion.creditosTotales - suscripcion.creditosUsados,
            estadoSuscripcion: suscripcion.estado
        };
    }
    async obtenerSuscripcionDeUsuario(usuarioId) {
        return await this.suscripcionRepository.findByUsuarioId(usuarioId);
    }
}