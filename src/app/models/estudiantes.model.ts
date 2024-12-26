// src/app/models/estudiante.model.ts
export interface Estudiante {
  cedula: string;
  nombres: string;
  apellidos: string;
  sexo: 'M' | 'F';
  fechaNacimiento: string;  // o Date, si prefieres
  codigo: string;
  parcial1: number;
  parcial2: number;
  calificacionFinal: number;   // CF
  examenRecuperacion?: number; // Solo si 5.5 <= CF < 7
  notaDefinitiva?: number;     // ND
  estadoAprobatorio: 'Aprobado' | 'Reprobado';
}
