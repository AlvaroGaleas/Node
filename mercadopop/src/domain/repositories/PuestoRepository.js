// Este archivo es un "Contrato".
// No tiene código real, solo define qué operaciones necesitamos.

export class PuestoRepository {
    
    // Método para guardar un puesto nuevo o actualizado
    async save(puesto) {
        throw new Error('Método save() no implementado');
    }

    // Método para buscar por ID
    async findById(id) {
        throw new Error('Método findById() no implementado');
    }

    // Método para buscar todos los puestos
    async findAll() {
        throw new Error('Método findAll() no implementado');
    }

    // Método para buscar puestos por estado (ej: 'LIBRE')
    async findByEstado(estado) {
        throw new Error('Método findByEstado() no implementado');
    }
}