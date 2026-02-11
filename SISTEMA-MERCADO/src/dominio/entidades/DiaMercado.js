class DiaMercado {
    constructor({ id, administradorId, fecha, estado, totalRecaudado, fechaCreacion }) {
        this.id = id;
        this.administradorId = administradorId;
        this.fecha = fecha;
        this.estado = estado; // 'pendiente', 'activo', 'cerrado'
        this.totalRecaudado = totalRecaudado || 0;
        this.fechaCreacion = fechaCreacion;
    }

    esViernes() {
        const dia = new Date(this.fecha).getDay();
        return dia === 5; // 5 = viernes
    }

    puedeIniciar() {
        return this.estado === 'pendiente' && this.esViernes();
    }

    puedeCerrar() {
        return this.estado === 'activo';
    }
}

module.exports = DiaMercado;