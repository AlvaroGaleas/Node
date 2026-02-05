import { Puesto } from '../../domain/entities/Puesto.js';

export class PuestoService {
    constructor(puestoRepository) {
        this.puestoRepository = puestoRepository;
    }

    // CREATE
    async crearPuesto(datos) {
        // Asegúrate de pasar todos los datos al constructor de la entidad
        // OJO: El orden de los parámetros depende de tu entidad Puesto.js
        const puesto = new Puesto(
            null, 
            datos.numero, 
            datos.ubicacion, 
            datos.estado,
            datos.usuarioTitularId // <--- Importante pasar esto
        );

        // AQUÍ ESTÁ EL ERROR COMÚN: Faltaba el 'return'
        return await this.puestoRepository.save(puesto); 
    }

    // READ (Todos)
    async obtenerTodos() {
        return await this.puestoRepository.findAll();
    }

    // READ (Uno)
    async obtenerPorId(id) {
        return await this.puestoRepository.findById(id);
    }

    // UPDATE
    async actualizarPuesto(id, datos) {
        const puesto = await this.puestoRepository.findById(id);
        if (!puesto) throw new Error('Puesto no encontrado');

        // Actualizamos campos
        if (datos.numero) puesto.numero = datos.numero;
        if (datos.ubicacion) puesto.ubicacion = datos.ubicacion;
        if (datos.estado) puesto.estado = datos.estado;

        return await this.puestoRepository.update(puesto);
    }

    // DELETE
    async eliminarPuesto(id) {
        return await this.puestoRepository.delete(id);
    }
}