import express from 'express';
import mongoose from 'mongoose';
import { MongoRepository } from './infrastructure/adapters/database/mongo-repository';
import { EvaluacionUseCases } from './application/use-cases/evaluacion.usecases';
import { EvaluacionController } from './infrastructure/adapters/http/evaluacion.controller';

const app = express();
app.use(express.json());

// Instanciar Dependencias
const repository = new MongoRepository();
const useCases = new EvaluacionUseCases(repository);
const controller = new EvaluacionController(useCases);

// Definir Rutas 
app.post('/api/evaluaciones', (req, res) => controller.crear(req, res));
app.get('/api/evaluaciones', (req, res) => controller.listar(req, res));
app.get('/api/evaluaciones/:id', (req, res) => controller.obtenerUno(req, res));
app.delete('/api/evaluaciones/:id', (req, res) => controller.eliminar(req, res));

// Conectar y Arrancar
mongoose.connect('mongodb://localhost:27017/sistema-tecnico')
  .then(() => {
    console.log("🟢 MongoDB Conectado");
    app.listen(3000, () => console.log("Server en puerto 3000"));
  })
  .catch(err => console.error("Error Mongo:", err));