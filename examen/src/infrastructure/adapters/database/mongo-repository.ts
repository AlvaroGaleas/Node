import mongoose, { Schema, Document } from 'mongoose';
import { EvaluacionRepository } from '../../../domain/repositories/evaluacion.repository';
import { Evaluacion } from '../../../domain/entities/evaluacion.entity';

//Definimos una interfaz para que TypeScript sepa qué tiene el documento
interface EvaluacionDocument extends Document {
  tecnico_id: string;
  fecha: Date;
  datosTecnico: any;
  notas: any;
  incidentes: any;
  resultado: any;
}

//Definición del Schema Mongoose
const EvaluacionSchema = new Schema({
  tecnico_id: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  datosTecnico: { type: Object, required: true },
  notas: { type: Object, required: true },
  incidentes: { type: Object, required: true },
  resultado: { type: Object, required: true }
});

// Vinculamos el modelo con la interfaz EvaluacionDocument
const EvaluacionModel = mongoose.model<EvaluacionDocument>('Evaluacion', EvaluacionSchema);

//Implementación del Repositorio
export class MongoRepository implements EvaluacionRepository {
  
  
  async crear(evaluacion: Evaluacion): Promise<Evaluacion> {
    const doc = new EvaluacionModel({
      tecnico_id: evaluacion.tecnicoId,
      fecha: evaluacion.fecha,
      datosTecnico: evaluacion.datosTecnico,
      notas: evaluacion.notas,
      incidentes: evaluacion.incidentes,
      resultado: evaluacion.resultado
    });

    await doc.save();

    // Convertimos el documento de Mongo a nuestra Entidad de Dominio
    return new Evaluacion(
      doc.tecnico_id,
      doc.datosTecnico,
      doc.notas,
      doc.incidentes,
      doc._id.toString(), // Convertimos el ObjectId a string
      doc.fecha,
      doc.resultado
    );
  }

  async listarTodas(): Promise<Evaluacion[]> {
    const docs = await EvaluacionModel.find().sort({ fecha: -1 });
    
    // Mapeamos cada documento a nuestra entidad
    return docs.map(doc => new Evaluacion(
      doc.tecnico_id,
      doc.datosTecnico,
      doc.notas,
      doc.incidentes,
      doc._id.toString(),
      doc.fecha,
      doc.resultado
    ));
  }

  async buscarPorId(id: string): Promise<Evaluacion | null> {
    // Validamos que sea un ID válido de Mongo antes de buscar para evitar crasheos
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const doc = await EvaluacionModel.findById(id);
    if (!doc) return null;

    return new Evaluacion(
      doc.tecnico_id,
      doc.datosTecnico,
      doc.notas,
      doc.incidentes,
      doc._id.toString(),
      doc.fecha,
      doc.resultado
    );
  }

  async eliminar(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const res = await EvaluacionModel.findByIdAndDelete(id);
    return !!res; // Retorna true si borró algo
  }
}