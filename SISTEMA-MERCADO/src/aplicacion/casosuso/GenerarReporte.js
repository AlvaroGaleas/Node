const { v4: uuidv4 } = require('uuid');

class GenerarReporte {
    constructor(diaMercadoRepository, alquilerRepository, reporteRepository, administradorRepository) {
        this.diaMercadoRepository = diaMercadoRepository;
        this.alquilerRepository = alquilerRepository;
        this.reporteRepository = reporteRepository;
        this.administradorRepository = administradorRepository;
    }

    async ejecutar(diaMercadoId) {
        // Obtener día de mercado
        const diaMercado = await this.diaMercadoRepository.buscarPorId(diaMercadoId);
        if (!diaMercado) {
            throw new Error('Día de mercado no encontrado');
        }

        // Obtener administrador
        const administrador = await this.administradorRepository.buscarPorId(diaMercado.administradorId);
        if (!administrador) {
            throw new Error('Administrador no encontrado');
        }

        // Obtener alquileres del día
        const alquileres = await this.alquilerRepository.buscarPorDiaMercado(diaMercadoId);

        // Calcular total recaudado
        const totalRecaudado = alquileres
            .filter(alquiler => alquiler.pagado)
            .reduce((total, alquiler) => total + alquiler.calcularCosto(), 0);

        // Determinar puestos ocupados y libres
        const puestosOcupados = alquileres.length;
        const puestosLibres = administrador.totalPuestos - puestosOcupados;

        // Crear detalles de puestos
        const detallesPuestos = [];
        for (let i = 1; i <= administrador.totalPuestos; i++) {
            const alquiler = alquileres.find(a => a.numeroPuesto === i);
            detallesPuestos.push({
                numero_puesto: i,
                ocupado: !!alquiler,
                nombre: alquiler ? alquiler.nombre : null,
                apellido: alquiler ? alquiler.apellido : null,
                telefono: alquiler ? alquiler.telefono : null,
                pagado: alquiler ? alquiler.pagado : false,
            });
        }

        // Crear reporte en MongoDB
        const reporte = await this.reporteRepository.crear({
            diaMercadoId: diaMercado.id,
            administradorId: diaMercado.administradorId,
            fecha: diaMercado.fecha,
            totalRecaudado,
            puestosOcupados,
            puestosLibres,
            detallesPuestos,
        });

        // Actualizar día de mercado con total recaudado
        await this.diaMercadoRepository.actualizar(diaMercadoId, {
            estado: 'cerrado',
            total_recaudado: totalRecaudado,
        });

        return {
            diaMercado,
            administrador,
            totalRecaudado,
            puestosOcupados,
            puestosLibres,
            detallesPuestos,
            reporte,
        };
    }
}

module.exports = GenerarReporte;