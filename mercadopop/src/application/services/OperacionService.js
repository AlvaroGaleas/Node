export class OperacionService {
    // Inyectamos suscripcionService para poder descontar créditos
    constructor(puestoRepository, mongoOperacionRepository, suscripcionService, usuarioRepository) {
        this.puestoRepository = puestoRepository;
        this.mongoOperacionRepository = mongoOperacionRepository;
        this.suscripcionService = suscripcionService;
        this.usuarioRepository = usuarioRepository; // 2. Lo guardamos en 'this'
    }

    async abrirMercado(fecha = new Date()) {
        const puestos = await this.puestoRepository.findAll();
        const listaParaMongo = [];
        
        // Mapeamos los puestos y buscamos sus dueños
        for (const puesto of puestos) {
            let usuario = null;
            if (puesto.usuarioTitularId) {
                usuario = await this.usuarioRepository.findById(puesto.usuarioTitularId);
            }
            listaParaMongo.push({ puesto, usuario });
        }
        
        return await this.mongoOperacionRepository.inicializarDia(fecha, listaParaMongo);
    }

    // CHECK-IN TITULAR
    async realizarCheckInTitular(puestoIdMysql, fecha = new Date()) {
        // 1. Buscamos el registro en MongoDB para ese puesto hoy
        const operacion = await this.mongoOperacionRepository.buscarPorPuestoYFecha(puestoIdMysql, fecha);
        
        if (!operacion) {
            throw new Error('No se encontró registro operativo para este puesto en la fecha indicada.');
        }

        if (operacion.estado === 'OCUPADO_TITULAR') {
            throw new Error('El puesto ya tiene Check-in realizado.');
        }

        if (!operacion.titular || !operacion.titular.idMysql) {
            throw new Error('Este puesto no tiene un titular asignado. Debe ser un arriendo anónimo.');
        }

        //COBRAR: Descontar el crédito en MySQL
        // Si el usuario no tiene saldo, esto lanzará error y detendrá el proceso
        const resultadoCobro = await this.suscripcionService.realizarCheckIn(operacion.titular.idMysql);

        //ACTUALIZAR: Si cobró bien, marcamos en Mongo que ya llegó
        const datosCheckIn = {
            hora: new Date(),
            metodo: 'SISTEMA'
        };

        await this.mongoOperacionRepository.actualizarEstado(operacion._id, 'OCUPADO_TITULAR', datosCheckIn);

        return {
            mensaje: 'Check-in exitoso. Puesto ocupado y saldo descontado.',
            saldoRestante: resultadoCobro.creditosRestantes,
            operacionId: operacion._id
        };
    }
    //El titular no llegó, liberamos el puesto
    async liberarPorAusencia(puestoIdMysql, fecha = new Date()) {
        const operacion = await this.mongoOperacionRepository.buscarPorPuestoYFecha(puestoIdMysql, fecha);
        
        if (!operacion) throw new Error('Operación no encontrada.');
        if (operacion.estado !== 'ESPERANDO_CHECKIN') {
            throw new Error('Solo se pueden liberar puestos que estén esperando check-in.');
        }

        // Simplemente cambiamos el estado. No cobramos nada
        await this.mongoOperacionRepository.actualizarEstado(operacion._id, 'LIBERADO_AUSENCIA');

        return { mensaje: 'Puesto liberado por ausencia del titular.', operacionId: operacion._id };
    }

    async alquilarAnonimo(puestoIdMysql, datosCliente, fecha = new Date()) {
        const operacion = await this.mongoOperacionRepository.buscarPorPuestoYFecha(puestoIdMysql, fecha);
        
        if (!operacion) throw new Error('Operación no encontrada.');
        if (operacion.estado.includes('OCUPADO')) {
            throw new Error('El puesto ya está ocupado.');
        }

        const infoAnonimo = {
            nombre: datosCliente.nombre || 'Cliente Anónimo',
            montoCobrado: 3.50
        };

        const datosCheckIn = {
            hora: new Date(),
            metodo: 'EFECTIVO'
        };

        // Ahora sí llamamos al repositorio actualizado
        await this.mongoOperacionRepository.actualizarEstado(
            operacion._id, 
            'OCUPADO_ANONIMO', 
            datosCheckIn, 
            { ocupanteAnonimo: infoAnonimo } // Datos extra
        );

        return { mensaje: 'Alquiler anónimo registrado. Cobrar $3.50.', monto: 3.50 };
    }
    async generarReporteDiario(fecha = new Date()) {
        const operaciones = await this.mongoOperacionRepository.obtenerTodasPorFecha(fecha);

        // Inicializamos contadores
        const reporte = {
            fecha: fecha.toISOString().split('T')[0],
            totalPuestos: operaciones.length,
            ocupacion: {
                titulares: 0,
                anonimos: 0,
                vacios: 0
            },
            finanzas: {
                creditosConsumidos: 0, // Gente que entró con suscripción
                dineroEfectivo: 0      // Gente que pagó $3.50
            },
            detalleAnonimos: [] // Lista para saber quiénes pagaron cash
        };

        // Procesamos dato por dato (Iteración)
        operaciones.forEach(op => {
            if (op.estado === 'OCUPADO_TITULAR') {
                reporte.ocupacion.titulares++;
                reporte.finanzas.creditosConsumidos++;
            } else if (op.estado === 'OCUPADO_ANONIMO') {
                reporte.ocupacion.anonimos++;
                // Sumamos lo que se cobró (si existe el campo, si no 3.50 por defecto)
                const monto = op.ocupanteAnonimo?.montoCobrado || 0;
                reporte.finanzas.dineroEfectivo += monto;
                
                reporte.detalleAnonimos.push({
                    puesto: op.puesto.numero,
                    cliente: op.ocupanteAnonimo?.nombre,
                    monto: monto
                });
            } else {
                reporte.ocupacion.vacios++;
            }
        });

        return reporte;
    }
    async registrarIncidencia(puestoIdMysql, descripcion, fecha = new Date()) {
        const operacion = await this.mongoOperacionRepository.buscarPorPuestoYFecha(puestoIdMysql, fecha);
        
        if (!operacion) {
            throw new Error('No se puede registrar incidencia: Operación no encontrada para hoy.');
        }

        // Agregamos la hora para que quede registro exacto
        const notaConHora = `[${new Date().toLocaleTimeString()}] ${descripcion}`;

        return await this.mongoOperacionRepository.agregarIncidencia(operacion._id, notaConHora);
    }
}