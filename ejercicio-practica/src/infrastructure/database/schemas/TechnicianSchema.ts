import mongoose, { Schema, Document } from 'mongoose';

// 1. Esquema de Evaluación 
const EvaluationSchema = new Schema({
    protocols: { type: Number, required: true },
    intervention: { type: Number, required: true },
    productivity: { type: Number, required: true },
    practical: { type: Number, required: true },
    theoretical: { type: Number, required: true }
}, { _id: false });

// 2. Esquema del Técnico (El documento principal)
const TechnicianSchema = new Schema({
    fullName: { type: String, required: true },
    identificationNumber: { type: String, required: true, unique: true },
    area: { type: String, required: true },
    evaluationDate: { type: Date, default: Date.now },
    // EMBEBIDO:
    evaluation: { type: EvaluationSchema, required: true }
});

// Definimos la interfaz para TypeScript
export interface ITechnicianDocument extends Document {
    fullName: string;
    identificationNumber: string;
    area: string;
    evaluationDate: Date;
    evaluation: {
        protocols: number;
        intervention: number;
        productivity: number;
        practical: number;
        theoretical: number;
    };
}

export const TechnicianModel = mongoose.model<ITechnicianDocument>('Technician', TechnicianSchema);