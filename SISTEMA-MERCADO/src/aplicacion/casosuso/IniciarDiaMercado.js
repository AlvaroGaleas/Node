class IniciarDiaMercado {
    constructor(diaMercadoRepository) {
        this.diaMercadoRepository = diaMercadoRepository;
    }

    async ejecutar({ administradorId, fecha }) {
        // Validar que la fecha sea viernes
        const diaSemana = new Date(fecha).getDay();
        if (diaSemana !== 5) { // 5 = viernes
            throw new Error('El mercado solo funciona los viernes');
        }

        // Verificar si ya existe un día de mercado para esta fecha
        const existeDia = await this.diaMercadoRepository.buscarPorAdministradorYFecha(
            administradorId,
            fecha
        );

        if (existeDia) {
            throw new Error('Ya existe un día de mercado registrado para esta fecha');
        }

        // Crear día de mercado
        const diaMercado = await this.diaMercadoRepository.crear({
            administradorId,
            fecha,
            estado: 'pendiente',
            totalRecaudado: 0,
        });

        return diaMercado;
    }
}

module.exports = IniciarDiaMercado;