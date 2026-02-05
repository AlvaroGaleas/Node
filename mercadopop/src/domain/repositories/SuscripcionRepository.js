export class SuscripcionRepository {
    async save(suscripcion) { throw new Error('Not implemented'); }
    async findById(id) { throw new Error('Not implemented'); }
    
    // Necesitamos buscar la suscripción activa de un usuario específico
    async findActiveByUserId(usuarioId) { throw new Error('Not implemented'); }
    
    async update(suscripcion) { throw new Error('Not implemented'); }
}