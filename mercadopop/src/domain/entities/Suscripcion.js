export class Suscripcion {
    constructor(id, usuarioId, tipo, creditosTotales, creditosUsados = 0, estado = 'ACTIVA', fechaCompra = null) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.tipo = tipo; // 'DIARIO' o 'PACK_4'
        this.creditosTotales = creditosTotales;
        this.creditosUsados = creditosUsados;
        this.estado = estado;
        this.fechaCompra = fechaCompra;
    }

    // Regla de Negocio: ¿Le quedan créditos?
    tieneCreditosDisponibles() {
        return this.creditosUsados < this.creditosTotales;
    }

    // Regla de Negocio: Consumir un crédito (Check-in)
    usarCredito() {
        if (!this.tieneCreditosDisponibles()) {
            throw new Error('No quedan créditos disponibles en esta suscripción.');
        }
        this.creditosUsados++;
        
        // Si se acaban los créditos, la suscripción finaliza automáticamente
        if (this.creditosUsados >= this.creditosTotales) {
            this.estado = 'FINALIZADA';
        }
    }
}