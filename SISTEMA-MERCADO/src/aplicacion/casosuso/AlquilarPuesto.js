class AlquilarPuesto {
    constructor(alquilerRepository, administradorRepository) {
        this.alquilerRepository = alquilerRepository;
        this.administradorRepository = administradorRepository;
    }

    async ejecutar({ diaMercadoId, administradorId, numeroPuesto, nombre, apellido, telefono, email, pagado }) {
        // Validar que el puesto esté dentro del rango del administrador
        const administrador = await this.administradorRepository.buscarPorId(administradorId);
        if (!administrador) {
            throw new Error('Administrador no encontrado');
        }

        if (!administrador.puedeGestionarPuesto(numeroPuesto)) {
            throw new Error(`Número de puesto inválido. Debe estar entre 1 y ${administrador.totalPuestos}`);
        }

        // Verificar si el puesto ya está ocupado
        const puestoOcupado = await this.alquilerRepository.buscarPorPuesto(
            diaMercadoId,
            numeroPuesto
        );

        if (puestoOcupado) {
            throw new Error('El puesto ya está ocupado');
        }

        // Crear alquiler
        const alquiler = await this.alquilerRepository.crear({
            diaMercadoId,
            numeroPuesto,
            nombre,
            apellido,
            telefono,
            email,
            pagado: pagado === 'true' || pagado === true,
            fechaPago: (pagado === 'true' || pagado === true) ? new Date() : null,
        });

        return alquiler;
    }
}

module.exports = AlquilarPuesto;