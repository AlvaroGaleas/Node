import express from 'express';
import mongoose from 'mongoose';
// Importa tus clases nuevas
import { EvaluacionController } from './infrastructure/adapters/http/controllers/evaluacion.controller';
import { RegistrarEvaluacionUseCase } from './application/use-cases/registrar-evaluacion.usecase';

class MockRepository { async guardar(e: any) { return e; } } 

const PORT = 3000;
const app = express();

app.use(express.json());

//INYECCIÓN DE DEPENDENCIAS

const repositorio = new MockRepository() as any; 
const registrarEvaluacionUseCase = new RegistrarEvaluacionUseCase(repositorio);
const evaluacionController = new EvaluacionController(registrarEvaluacionUseCase);

//RUTA

app.post('/api/evaluaciones', (req, res) => evaluacionController.registrar(req, res));



const startServer = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/evaluacion-tecnica');
        console.log('Conectado a MongoDB Exitosamente');
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar:', error);
    }
};

startServer();