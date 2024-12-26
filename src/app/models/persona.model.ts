// src/app/models/persona.model.ts
export interface Persona {
  cedula: string;
  nombres: string;
  apellidos: string;
  sexo: 'M' | 'F';  
  fechaNacimiento: string; // Podrías usar Date en lugar de string
}
