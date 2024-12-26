// src/app/models/estudiante.model.ts

export interface Estudiante {
  cedula: string;
  nombres: string;
  apellidos: string;
  sexo: 'M' | 'F';
  fechaNacimiento: string;  // Puede ser Date si prefieres
  codigo: string;
  parcial1: number;
  parcial2: number;
  calificacionFinal: number;     // CF = (p1 + p2)/2
  examenRecuperacion?: number;   // Solo se usa si 5.5 <= CF < 7
  notaDefinitiva?: number;       // ND = CF*0.4 + ER*0.6 (cuando aplica)
  // Estado Aprobatorio puede ser: "Aprobado", "Reprobado" o "En recuperación"
  estadoAprobatorio: 'Aprobado' | 'Reprobado' | 'En recuperación';
}
