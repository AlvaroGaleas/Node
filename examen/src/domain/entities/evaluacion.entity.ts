export class Evaluacion {
  constructor(
    public readonly tecnicoId: string,
    public readonly datosTecnico: { nombre: string; area: string }, // Snapshot
    public readonly notas: { CP: number; CI: number; PR: number; EP: number; ET: number },
    public readonly incidentes: { leves: number; grave: boolean },
    public readonly id?: string, // 
    public readonly fecha: Date = new Date(),
    public resultado?: any // Aquí guardaremos el cálculo final
  ) {}

  // LÓGICA DE NEGOCIO
  public calcularResultado() {
    let observaciones: string[] = [];
    let esCertificado = true;
    let nivel = "";

    // Promedio Base 
    const suma = this.notas.CP + this.notas.CI + this.notas.PR + this.notas.EP + this.notas.ET;
    let nf = suma / 5;

    // Reglas de Veto (Mínimos Obligatorios)
    if (this.notas.EP < 60) {
      esCertificado = false;
      observaciones.push("NO CERTIFICADO: Examen Práctico (EP) menor a 60.");
    }
    if (this.notas.CP < 70) {
      esCertificado = false;
      observaciones.push("NO CERTIFICADO: Cumplimiento Protocolos (CP) menor a 70.");
    }
    if (this.incidentes.grave) {
      esCertificado = false;
      observaciones.push("NO CERTIFICADO: Incidente Grave registrado.");
    }

    // Penalizaciones (-2 puntos por incidente leve)
    const penalizacion = this.incidentes.leves * 2;
    if (penalizacion > 0) {
      nf -= penalizacion;
      observaciones.push(`Penalización: -${penalizacion} pts por incidentes leves.`);
    }
    if (nf < 0) nf = 0; // La nota no puede ser negativa

    // Bonificación (+3 puntos si NF >= 90 y 0 incidentes)
    if (esCertificado && nf >= 90 && this.incidentes.leves === 0 && !this.incidentes.grave) {
      nf += 3;
      if (nf > 100) nf = 100; // Tope 100
      observaciones.push("BONIFICACIÓN: +3 pts por Excelencia.");
    }

    // Clasificación Final
    if (!esCertificado) {
      nivel = "NO CERTIFICADO";
    } else {
      if (nf >= 90) nivel = "Nivel A";
      else if (nf >= 80) nivel = "Nivel B";
      else if (nf >= 70) nivel = "Nivel C";
      else {
        nivel = "NO CERTIFICADO";
        esCertificado = false;
        observaciones.push("NO CERTIFICADO: Nota Final insuficiente.");
      }
    }

    // Guardamos el resultado procesado
    this.resultado = {
      nota_final: parseFloat(nf.toFixed(2)),
      es_certificado: esCertificado,
      nivel: nivel,
      observaciones: observaciones
    };
  }
}