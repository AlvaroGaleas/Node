import { Technician } from "../entities/Technician";


export interface TechnicianRepository {
    save(technician: Technician): Promise<Technician>;
    findAll(): Promise<Technician[]>;
  
}