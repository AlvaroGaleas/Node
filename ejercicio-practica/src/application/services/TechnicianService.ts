import { Technician } from "../../domain/entities/Technician";
import { Evaluation } from "../../domain/entities/Evaluation";
import { TechnicianRepository } from "../../domain/repositories/TechnicianRepository";
import { CreateTechnicianDTO } from "../dtos/CreateTechnicianDTO";

export class TechnicianService {
    
    // Inyección de dependencias: El servicio recibe el repositorio, no lo crea.
    constructor(private readonly technicianRepository: TechnicianRepository) {}

    async registerTechnician(data: CreateTechnicianDTO): Promise<Technician> {
        // Entidad de Evaluación
        const evaluation = new Evaluation(
            data.scores.protocols,
            data.scores.intervention,
            data.scores.productivity,
            data.scores.practical,
            data.scores.theoretical
        );

        //Crear la Entidad del Técnico       
        
        const technician = new Technician(
            "", // El ID se asignará al persistir
            data.fullName,
            data.identificationNumber,
            data.area,
            new Date(), // Fecha de evaluación actual
            evaluation  // Aquí está la RELACIÓN EMBEBIDA
        );

        // 3. Persistir usando el Puerto (sin saber qué BD es)
        const savedTechnician = await this.technicianRepository.save(technician);
        
        return savedTechnician;
    }

    async getAllTechnicians(): Promise<Technician[]> {
        return await this.technicianRepository.findAll();
    }
}