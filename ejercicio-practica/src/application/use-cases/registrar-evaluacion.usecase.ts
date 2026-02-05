import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { EvaluacionRepository } from '../../domain/repositories/evaluacion.repository';

export class RegistrarEvaluacionUseCase {
  
  constructor(private readonly evaluacionRepository: EvaluacionRepository) {}

  async ejecutar(datosEntrada: any) {

    const nuevaEvaluacion = new Evaluacion(
      datosEntrada.tecnico_id,
      { nombre: "Técnico Demo", area: "Mantenimiento" }, // Esto idealmente vendría de buscar al técnico
      datosEntrada.calificaciones,
      datosEntrada.incidentes
    );


    const resultadoProcesado = nuevaEvaluacion.procesarResultado();

  
    await this.evaluacionRepository.guardar(nuevaEvaluacion);

    return resultadoProcesado;
  }
}