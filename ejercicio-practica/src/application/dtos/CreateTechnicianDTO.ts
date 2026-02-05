export interface CreateTechnicianDTO {
    fullName: string;
    identificationNumber: string;
    area: string;
    // Datos para la evaluación
    scores: {
        protocols: number;    // 15%
        intervention: number; // 25%
        productivity: number; // 20%
        practical: number;    // 30%
        theoretical: number;  // 10%
    };
}