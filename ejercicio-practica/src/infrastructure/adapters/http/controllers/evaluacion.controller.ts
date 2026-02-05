
import { Request, Response } from 'express';
import { evaluacionInputSchema } from '../validators/evaluacion.schema'; // Importamos el schema
import { RegistrarEvaluacionUseCase } from '../../../../application/use-cases/registrar-evaluacion.usecase';

export class EvaluacionController {
  
  constructor(private registrarEvaluacionUseCase: RegistrarEvaluacionUseCase) {}

  async registrar(req: Request, res: Response) {
    // VALIDACIÓN
    // Si los datos no cumplen las reglas de Joi, rebotamos la petición aquí mismo.
    const { error, value } = evaluacionInputSchema.validate(req.body);

    if (error) {
      // Retornamos 400 Bad Request con el mensaje de Joi
      return res.status(400).json({
        mensaje: "Error de validación en los datos de entrada",
        detalles: error.details.map(d => d.message)
      });
    }

    try {
      
      // Si pasa la validación, recién llamamos al Dominio (UseCase) con los datos limpios ('value')
      const resultado = await this.registrarEvaluacionUseCase.ejecutar(value);
      

      return res.status(201).json(resultado);

    } catch (err) {
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }
}