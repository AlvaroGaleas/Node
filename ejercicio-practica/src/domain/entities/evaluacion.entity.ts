export type Calificaciones = {
  CP: number; // Cumplimiento Protocolos
  CI: number; // Conocimiento Interno
  PR: number; // Productividad
  EP: number; // Examen Práctico
  ET: number; // Examen Teórico
};

export type Incidentes = {
  leves: number;
  grave: boolean; 
};

export class Evaluacion {
  constructor(
    public readonly tecnicoId: string,
    public readonly datosTecnicoSnapshot: { nombre: string; area: string }, // Snapshot para reporte
    public readonly calificaciones: Calificaciones,
    public readonly incidentes: Incidentes,
    public readonly fechaEvaluacion: Date = new Date()
  ) {}

  // Este es el método que contiene las reglas
  public procesarResultado() {
    let observaciones: string[] = [];
    let bloqueado = false; // "Flag" para No Certificado automático

    //Cálculo de Nota Base 
    const sumaNotas = 
      this.calificaciones.CP + 
      this.calificaciones.CI + 
      this.calificaciones.PR + 
      this.calificaciones.EP + 
      this.calificaciones.ET;
    
    let nf = sumaNotas / 5; // Nota Base

    //Penalización por incidentes de seguridad
    // "Por cada incidente leve... -2 puntos sobre la NF"
    const penalizacion = this.incidentes.leves * 2;
    if (penalizacion > 0) {
      nf -= penalizacion;
      observaciones.push(`Penalización: -${penalizacion} pts por ${this.incidentes.leves} incidentes leves.`);
    }

    // "La NF no puede ser menor que 0"
    if (nf < 0) nf = 0;

    //Mínimos obligatorios 
    // "Si EP < 60... NO CERTIFICADO"
    if (this.calificaciones.EP < 60) {
      bloqueado = true;
      observaciones.push("No certificado: EP menor a 60");
    }

    // "Si CP < 70... NO CERTIFICADO por incumplimiento de seguridad"
    if (this.calificaciones.CP < 70) {
      bloqueado = true;
      observaciones.push("No certificado: CP menor a 70 (Seguridad)");
    }

    // "Incidente grave... NO CERTIFICADO automáticamente"
    if (this.incidentes.grave) {
      bloqueado = true;
      observaciones.push("No certificado: Incidente grave registrado");
    }

    //Bonificación por excelencia
    // "Si NF >= 90 y no registra incidentes... +3 puntos"
    if (!bloqueado && nf >= 90 && this.incidentes.leves === 0 && !this.incidentes.grave) {
      nf += 3;
      if (nf > 100) nf = 100; // Tope 100
      observaciones.push("Certificado – Nivel A con bonificación por excelencia");
    }

    //Clasificación Final
    let estado = "NO CERTIFICADO";
    let clasificacion = null; // Nivel A, B, C

    if (bloqueado) {
      // Si fue bloqueado por mínimos o graves, ya es No Certificado, sin importar la NF
      estado = "NO CERTIFICADO";
    } else {
      // Reglas de Clasificación según la NF final
      if (nf >= 90) {
        estado = "CERTIFICADO";
        clasificacion = "Nivel A";
      } else if (nf >= 80) {
        estado = "CERTIFICADO";
        clasificacion = "Nivel B";
      } else if (nf >= 70) {
        estado = "CERTIFICADO";
        clasificacion = "Nivel C";
      } else {
        estado = "NO CERTIFICADO";
        observaciones.push("No certificado: NF menor a 70");
      }
    }

    return {
      datos_tecnico: this.datosTecnicoSnapshot,
      detalle_notas: this.calificaciones,
      reglas_aplicadas: observaciones,
      nota_final: parseFloat(nf.toFixed(2)), // Redondeo a 2 decimales
      estado,
      clasificacion
    };
  }
}