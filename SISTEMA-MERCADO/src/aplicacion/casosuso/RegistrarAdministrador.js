class RegistrarAdministrador {
    constructor(administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    async ejecutar({ nombreUsuario, email, password, totalPuestos }) {
        // Validaciones
        if (!nombreUsuario || !email || !password || !totalPuestos) {
            throw new Error('Todos los campos son requeridos');
        }

        if (totalPuestos < 1) {
            throw new Error('Debe tener al menos 1 puesto');
        }

        // Verificar si el email ya existe
        const existeEmail = await this.administradorRepository.buscarPorEmail(email);
        if (existeEmail) {
            throw new Error('El email ya está registrado');
        }

        // Verificar si el usuario ya existe
        const existeUsuario = await this.administradorRepository.buscarPorUsuario(nombreUsuario);
        if (existeUsuario) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        // Crear administrador
        const administrador = await this.administradorRepository.crear({
            nombreUsuario,
            email,
            passwordHash: password,
            totalPuestos: parseInt(totalPuestos),
        });

        return administrador;
    }
}

module.exports = RegistrarAdministrador;