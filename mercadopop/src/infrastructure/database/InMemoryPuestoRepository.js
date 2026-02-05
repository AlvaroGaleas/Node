import { PuestoRepository } from '../../domain/repositories/PuestoRepository.js';

export class InMemoryPuestoRepository extends PuestoRepository {
    constructor() {
        super();
        this.puestos = []; // Aquí guardaremos los datos temporalmente
    }

    async save(puesto) {
        this.puestos.push(puesto);
        return puesto;
    }

    async findAll() {
        return this.puestos;
    }

    async findById(id) {
        // Convertimos a número porque los params de URL vienen como string
        return this.puestos.find(p => p.id === Number(id));
    }

    async update(puestoActualizado) {
        const index = this.puestos.findIndex(p => p.id === puestoActualizado.id);
        if (index !== -1) {
            this.puestos[index] = puestoActualizado;
            return puestoActualizado;
        }
        return null;
    }

    async delete(id) {
        const index = this.puestos.findIndex(p => p.id === Number(id));
        if (index !== -1) {
            this.puestos.splice(index, 1);
            return true;
        }
        return false;
    }
}