import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { EvaluacionRepository } from '../../domain/repositories/evaluacion.repository';

export class EvaluacionUseCases {
  constructor(private repo: EvaluacionRepository) {}

  async crearEvaluacion(datos: any) {
    // 1. Simulación de búsqueda de técnico (Mock)
    let tecnicoSnapshot = { nombre: "Técnico Externo", area: "General" };
    if (datos.tecnico_id === "123") tecnicoSnapshot = { nombre: "Juan Pérez", area: "Mecánica" };

    // 2. Crear Entidad
    const nuevaEvaluacion = new Evaluacion(
      datos.tecnico_id,
      tecnicoSnapshot,
      datos.calificaciones,
      datos.incidentes
    );

    // 3. Aplicar Lógica de Negocio
    nuevaEvaluacion.calcularResultado();

    // 4. Persistir
    return await this.repo.crear(nuevaEvaluacion);
  }

  async listarEvaluaciones() {
    return await this.repo.listarTodas();
  }

  async buscarEvaluacion(id: string) {
    return await this.repo.buscarPorId(id);
  }

  async eliminarEvaluacion(id: string) {
    return await this.repo.eliminar(id);
  }
}