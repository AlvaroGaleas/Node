import { Evaluacion } from '../entities/evaluacion.entity';

export interface EvaluacionRepository {
  crear(evaluacion: Evaluacion): Promise<Evaluacion>;
  listarTodas(): Promise<Evaluacion[]>;
  buscarPorId(id: string): Promise<Evaluacion | null>;
  eliminar(id: string): Promise<boolean>;
}