import { TechnicianRepository } from "../../../domain/repositories/TechnicianRepository";
import { Technician } from "../../../domain/entities/Technician";
import { Evaluation } from "../../../domain/entities/Evaluation";
import { TechnicianModel } from "../schemas/TechnicianSchema";

export class MongoTechnicianRepository implements TechnicianRepository {

    async save(technician: Technician): Promise<Technician> {
        // Mapeamos la Entidad de Dominio -> Documento de Mongoose
        const newTechnician = new TechnicianModel({
            fullName: technician.fullName,
            identificationNumber: technician.identificationNumber,
            area: technician.area,
            evaluationDate: technician.evaluationDate,
            evaluation: {
                protocols: technician.evaluation.protocols,
                intervention: technician.evaluation.intervention,
                productivity: technician.evaluation.productivity,
                practical: technician.evaluation.practical,
                theoretical: technician.evaluation.theoretical
            }
        });

        await newTechnician.save();
        
        // Devolvemos la entidad con el ID 
        technician.id = newTechnician._id.toString();
        return technician;
    }

    async findAll(): Promise<Technician[]> {
        const docs = await TechnicianModel.find();
        
        // Mapeamos de Mongoose -> Entidades de Dominio
       
        return docs.map(doc => new Technician(
            doc._id.toString(),
            doc.fullName,
            doc.identificationNumber,
            doc.area,
            doc.evaluationDate,
            new Evaluation(
                doc.evaluation.protocols,
                doc.evaluation.intervention,
                doc.evaluation.productivity,
                doc.evaluation.practical,
                doc.evaluation.theoretical
            )
        ));
    }
}