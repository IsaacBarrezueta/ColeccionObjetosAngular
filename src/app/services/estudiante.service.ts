// src/app/services/estudiante.service.ts
import { Injectable } from '@angular/core';
import { Estudiante } from '../models/estudiantes.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  // Lista inicial de ejemplo
  estudiantes: Estudiante[] = [
    {
      cedula: '0101010101',
      nombres: 'Juan',
      apellidos: 'Pérez',
      sexo: 'M',
      fechaNacimiento: '1999-03-15',
      codigo: 'EST001',
      parcial1: 8,
      parcial2: 5,
      calificacionFinal: 6.5,
      examenRecuperacion: 8,
      notaDefinitiva: 7.4,
      estadoAprobatorio: 'Aprobado'
    },
    {
      cedula: '0202020202',
      nombres: 'Ana',
      apellidos: 'Gómez',
      sexo: 'F',
      fechaNacimiento: '2000-01-10',
      codigo: 'EST002',
      parcial1: 4,
      parcial2: 3,
      calificacionFinal: 3.5,
      estadoAprobatorio: 'Reprobado'
    },
  ];

  constructor() { }

  // Podrías agregar métodos CRUD, pero 
  // con exponer "estudiantes" y manipularlo desde los componentes
  // es suficiente para la demo.
}
