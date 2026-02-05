import { Evaluacion } from '../entities/evaluacion.entity';

export interface EvaluacionRepository {
  guardar(evaluacion: Evaluacion): Promise<Evaluacion>;
  listarTodas(): Promise<any[]>; 
  eliminar(id: string): Promise<boolean>; 
}