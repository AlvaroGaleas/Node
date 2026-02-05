import { Request, Response } from 'express';
import { TechnicianService } from '../../../../application/services/TechnicianService';

export class TechnicianController {
    
    constructor(private technicianService: TechnicianService) {}

    // Método para crear (POST)
    async create(req: Request, res: Response) {
        try {
            const body = req.body;
            // Llamamos al servicio
            const technician = await this.technicianService.registerTechnician(body);

            // Formateamos la respuesta
            const finalScore = technician.evaluation.calculateFinalScore();
            const isCertified = technician.evaluation.isCertified();

            res.status(201).json({
                message: "Evaluación registrada correctamente",
                datos_tecnico: {
                    nombre: technician.fullName,
                    identificacion: technician.identificationNumber,
                    area: technician.area
                },
                detalle_calificaciones: technician.evaluation, // objeto embebido
                nota_final: finalScore.toFixed(2), // Redondeado a 2 decimales
                estado: isCertified ? "CERTIFICADO" : "NO CERTIFICADO"
            });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Método para listar (GET)
    async getAll(req: Request, res: Response) {
        try {
            const technicians = await this.technicianService.getAllTechnicians();
            res.json(technicians);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener técnicos" });
        }
    }
}