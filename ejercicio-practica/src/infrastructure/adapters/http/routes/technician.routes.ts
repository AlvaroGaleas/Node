import { Router } from 'express';
import { MongoTechnicianRepository } from '../../../database/repositories/MongoTechnicianRepository';
import { TechnicianService } from '../../../../application/services/TechnicianService';
import { TechnicianController } from '../controllers/TechnicianController';

const router = Router();



const repository = new MongoTechnicianRepository();
const service = new TechnicianService(repository);
const controller = new TechnicianController(service);

// Definir la ruta POST
router.post('/technicians', (req, res) => controller.create(req, res));

export default router;