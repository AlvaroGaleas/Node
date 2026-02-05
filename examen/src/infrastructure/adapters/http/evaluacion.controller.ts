import { Request, Response } from 'express';
import { EvaluacionUseCases } from '../../../application/use-cases/evaluacion.usecases';
import { EvaluacionSchema } from './evaluacion.schema';

export class EvaluacionController {
  constructor(private useCases: EvaluacionUseCases) {}

  async crear(req: Request, res: Response) {
    const { error, value } = EvaluacionSchema.validate(req.body); // Validación
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const resultado = await this.useCases.crearEvaluacion(value);
      res.status(201).json(resultado);
    } catch (e) {
      res.status(500).json({ error: "Error interno" });
    }
  }

  async listar(req: Request, res: Response) {
    const lista = await this.useCases.listarEvaluaciones();
    res.json(lista);
  }

  async obtenerUno(req: Request, res: Response) {
    const item = await this.useCases.buscarEvaluacion(req.params.id as string);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    res.json(item);
  }

  async eliminar(req: Request, res: Response) {
    const exito = await this.useCases.eliminarEvaluacion(req.params.id as string);
    if (!exito) return res.status(404).json({ error: "No encontrado para eliminar" });
    res.json({ mensaje: "Eliminado correctamente" });
  }
}