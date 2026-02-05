import Joi from 'joi'; 


export const evaluacionInputSchema = Joi.object({
  tecnico_id: Joi.string().required(), // ID de MongoDB
  calificaciones: Joi.object({
    CP: Joi.number().min(0).max(100).required(),
    CI: Joi.number().min(0).max(100).required(),
    PR: Joi.number().min(0).max(100).required(),
    EP: Joi.number().min(0).max(100).required(), 
    ET: Joi.number().min(0).max(100).required()
  }).required(),
  incidentes: Joi.object({
    leves: Joi.number().integer().min(0).default(0),
    grave: Joi.boolean().required()
  }).required()
});