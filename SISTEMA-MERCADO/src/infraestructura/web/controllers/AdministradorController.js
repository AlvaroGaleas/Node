const AdministradorRepository = require('../../persistencia/mysql/repositorios/AdministradorRepository');
const RegistrarAdministrador = require('../../../aplicacion/casosuso/RegistrarAdministrador');
const AdministradorModel = require('../../persistencia/mysql/modelos/AdministradorModel');

class AdministradorController {
    constructor() {
        this.administradorRepository = new AdministradorRepository();
        this.registrarAdministrador = new RegistrarAdministrador(this.administradorRepository);
    }

    mostrarRegistro(req, res) {
        res.render('administrador/registro');
    }

    async registrar(req, res) {
        try {
            const { nombre_usuario, email, password, total_puestos } = req.body;
            
            const administrador = await this.registrarAdministrador.ejecutar({
                nombreUsuario: nombre_usuario,
                email,
                password,
                totalPuestos: total_puestos,
            });

            // Iniciar sesión automáticamente
            req.session.administradorId = administrador.id;
            req.session.nombreUsuario = administrador.nombreUsuario;
            req.session.totalPuestos = administrador.totalPuestos;

            res.redirect('/mercado/iniciar-dia');
        } catch (error) {
            res.render('administrador/registro', {
                error: error.message,
                datos: req.body,
            });
        }
    }

    mostrarLogin(req, res) {
        res.render('administrador/login');
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const administradorModel = await AdministradorModel.findOne({ where: { email } });
            if (!administradorModel) {
                throw new Error('Credenciales incorrectas');
            }

            const passwordValido = await administradorModel.validarPassword(password);
            if (!passwordValido) {
                throw new Error('Credenciales incorrectas');
            }

            req.session.administradorId = administradorModel.id;
            req.session.nombreUsuario = administradorModel.nombre_usuario;
            req.session.totalPuestos = administradorModel.total_puestos;

            res.redirect('/mercado/iniciar-dia');
        } catch (error) {
            res.render('administrador/login', {
                error: error.message,
                datos: req.body,
            });
        }
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/admin/login');
    }

    dashboard(req, res) {
        if (!req.session.administradorId) {
            return res.redirect('/admin/login');
        }
        res.render('administrador/dashboard', {
            administrador: {
                nombreUsuario: req.session.nombreUsuario,
                totalPuestos: req.session.totalPuestos,
            },
        });
    }
}

module.exports = AdministradorController;