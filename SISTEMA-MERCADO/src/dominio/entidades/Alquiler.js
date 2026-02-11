class Alquiler {
    constructor({ id, diaMercadoId, numeroPuesto, nombre, apellido, telefono, email, pagado, fechaPago, fechaCreacion }) {
        this.id = id;
        this.diaMercadoId = diaMercadoId;
        this.numeroPuesto = numeroPuesto;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.pagado = pagado;
        this.fechaPago = fechaPago;
        this.fechaCreacion = fechaCreacion;
    }

    get nombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    calcularCosto() {
        return 3; // Costo fijo por día
    }

    marcarComoPagado() {
        this.pagado = true;
        this.fechaPago = new Date();
    }
}

module.exports = Alquiler;