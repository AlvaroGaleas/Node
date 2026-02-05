export class Puesto {
    constructor(id, numero, ubicacion, estado = 'LIBRE', usuarioTitularId = null) {
        this.id = id;
        this.numero = numero;       // Ej: "Lote A-12"
        this.ubicacion = ubicacion; // Ej: "Pasillo Central"
        this.estado = estado;       // LIBRE, OCUPADO, MANTENIMIENTO
        this.usuarioTitularId = usuarioTitularId;
    }

    // Regla de Negocio: Validar si está disponible
    estaDisponible() {
        return this.estado === 'LIBRE';
    }

    // Regla de Negocio: Ocupar puesto
    ocupar() {
        if (!this.estaDisponible()) {
            throw new Error('El puesto ya está ocupado o en mantenimiento.');
        }
        this.estado = 'OCUPADO';
    }

    // Regla de Negocio: Liberar puesto (ej. por ausencia)
    liberar() {
        this.estado = 'LIBRE';
    }
}