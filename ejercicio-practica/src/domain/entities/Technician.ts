import { Evaluation } from './Evaluation';

export class Technician {
    constructor(
        public id: string, // ID único 
        public fullName: string,
        public identificationNumber: string,
        public area: string,
        public evaluationDate: Date,
        public evaluation: Evaluation // Relación con la evaluación
    ) {}
}