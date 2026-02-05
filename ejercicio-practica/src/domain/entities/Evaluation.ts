// src/domain/entities/Evaluation.ts

export class Evaluation {
    constructor(
        public protocols: number,    // 15%
        public intervention: number, // 25%
        public productivity: number, // 20%
        public practical: number,    // 30%
        public theoretical: number   // 10%
    ) {}

    // Método para calcular la nota final
    calculateFinalScore(): number {
        return (
            (this.protocols * 0.15) +
            (this.intervention * 0.25) +
            (this.productivity * 0.20) +
            (this.practical * 0.30) +
            (this.theoretical * 0.10)
        );
    }

    // Método para determinar el estado (Regla de negocio)
    isCertified(): boolean {
        // Regla < 60, NO CERTIFICADO
        if (this.practical < 60) {
            return false;
        }
        
        
        return this.calculateFinalScore() >= 60;
    }
}