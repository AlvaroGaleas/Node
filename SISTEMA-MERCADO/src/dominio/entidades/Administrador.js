class Administrador {
    constructor({ id, nombreUsuario, email, passwordHash, totalPuestos, fechaCreacion }) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.passwordHash = passwordHash;
        this.totalPuestos = totalPuestos;
        this.fechaCreacion = fechaCreacion;
    }

    validarPassword(password) {
        // Este método se implementará en el servicio
        return true;
    }

    puedeGestionarPuesto(numeroPuesto) {
        return numeroPuesto > 0 && numeroPuesto <= this.totalPuestos;
    }
}

module.exports = Administrador;