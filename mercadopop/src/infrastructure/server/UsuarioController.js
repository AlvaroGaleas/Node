export class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    crear = async (req, res) => {
        try {
            const usuario = await this.usuarioService.registrarUsuario(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    listar = async (req, res) => {
        try {
            const usuarios = await this.usuarioService.listarUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            // Fíjate que aquí llamamos al nombre nuevo que acabamos de poner en el servicio
            const usuario = await this.usuarioService.obtenerUsuarioPorId(id);
            res.json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    obtenerUno = async (req, res) => {
        const usuario = await this.usuarioService.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'No encontrado' });
        res.json(usuario);
    }

    actualizar = async (req, res) => {
        try {
            const usuario = await this.usuarioService.actualizarUsuario(req.params.id, req.body);
            res.json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    eliminar = async (req, res) => {
        const exito = await this.usuarioService.eliminarUsuario(req.params.id);
        if (!exito) return res.status(404).json({ error: 'No encontrado' });
        res.status(204).send();
    }
}