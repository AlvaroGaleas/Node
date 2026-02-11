const DiaMercadoRepository = require('../../persistencia/mysql/repositorios/DiaMercadoRepository');
const AlquilerRepository = require('../../persistencia/mysql/repositorios/AlquilerRepository');
const AdministradorRepository = require('../../persistencia/mysql/repositorios/AdministradorRepository');
const IniciarDiaMercado = require('../../../aplicacion/casosuso/IniciarDiaMercado');
const AlquilarPuesto = require('../../../aplicacion/casosuso/AlquilarPuesto');

class MercadoController {
    constructor() {
        this.diaMercadoRepository = new DiaMercadoRepository();
        this.alquilerRepository = new AlquilerRepository();
        this.administradorRepository = new AdministradorRepository();
        this.iniciarDiaMercado = new IniciarDiaMercado(this.diaMercadoRepository);
        this.alquilarPuesto = new AlquilarPuesto(
            this.alquilerRepository,
            this.administradorRepository
        );
    }

    mostrarIniciarDia(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        // Obtener días de mercado anteriores
        this.diaMercadoRepository.listarPorAdministrador(req.session.administradorId)
            .then(diasMercado => {
                res.render('mercado/iniciar-dia', {
                    diasMercado,
                    administrador: {
                        id: req.session.administradorId,
                        nombreUsuario: req.session.nombreUsuario,
                        totalPuestos: req.session.totalPuestos,
                    },
                });
            })
            .catch(error => {
                res.render('mercado/iniciar-dia', {
                    error: error.message,
                    diasMercado: [],
                });
            });
    }

    async iniciarDia(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        try {
            const { fecha } = req.body;
            
            const diaMercado = await this.iniciarDiaMercado.ejecutar({
                administradorId: req.session.administradorId,
                fecha,
            });

            res.redirect(`/mercado/gestionar/${diaMercado.id}`);
        } catch (error) {
            this.diaMercadoRepository.listarPorAdministrador(req.session.administradorId)
                .then(diasMercado => {
                    res.render('mercado/iniciar-dia', {
                        error: error.message,
                        diasMercado,
                        datos: req.body,
                    });
                });
        }
    }

    async mostrarGestionar(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;

        try {
            const diaMercado = await this.diaMercadoRepository.buscarPorId(id);
            if (!diaMercado || diaMercado.administradorId !== req.session.administradorId) {
                throw new Error('Día de mercado no encontrado o no autorizado');
            }

            const alquileres = await this.alquilerRepository.buscarPorDiaMercado(id);
            const administrador = await this.administradorRepository.buscarPorId(req.session.administradorId);

            // Calcular puestos disponibles
            const puestosOcupados = alquileres.map(a => a.numeroPuesto);
            const puestosDisponibles = [];
            for (let i = 1; i <= administrador.totalPuestos; i++) {
                if (!puestosOcupados.includes(i)) {
                    puestosDisponibles.push(i);
                }
            }

            // Calcular total recaudado hasta el momento
            const totalRecaudado = alquileres
                .filter(a => a.pagado)
                .reduce((total, a) => total + a.calcularCosto(), 0);

            res.render('mercado/gestionar', {
                diaMercado,
                alquileres,
                puestosDisponibles,
                totalRecaudado,
                administrador,
            });
        } catch (error) {
            res.redirect('/mercado/iniciar-dia');
        }
    }

    async alquilarPuesto(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;

        try {
            const diaMercado = await this.diaMercadoRepository.buscarPorId(id);
            if (!diaMercado || diaMercado.administradorId !== req.session.administradorId) {
                throw new Error('No autorizado');
            }

            if (diaMercado.estado !== 'activo') {
                await this.diaMercadoRepository.actualizar(id, { estado: 'activo' });
            }

            const { numero_puesto, nombre, apellido, telefono, email, pagado } = req.body;

            await this.alquilarPuesto.ejecutar({
                diaMercadoId: id,
                administradorId: req.session.administradorId,
                numeroPuesto: parseInt(numero_puesto),
                nombre,
                apellido,
                telefono,
                email,
                pagado,
            });

            res.redirect(`/mercado/gestionar/${id}`);
        } catch (error) {
            res.redirect(`/mercado/gestionar/${id}?error=${encodeURIComponent(error.message)}`);
        }
    }

    mostrarFormularioPuesto(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;
        const { numero_puesto } = req.query;

        res.render('mercado/puesto-form', {
            diaMercadoId: id,
            numeroPuesto: numero_puesto,
        });
    }
}

module.exports = MercadoController;