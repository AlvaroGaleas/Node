export class Usuario {
    constructor(id, nombreCompleto, cedula, rol = 'ARRENDATARIO', estado = 1) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.cedula = cedula;
        this.rol = rol; // 'ADMIN', 'ARRENDATARIO', 'OPERADOR'
        this.estado = estado;
    }

    // Regla de Negocio: Validar si es administrador
    esAdmin() {
        return this.rol === 'ADMIN';
    }
}