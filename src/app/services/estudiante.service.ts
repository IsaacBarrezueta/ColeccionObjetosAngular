import { Injectable } from '@angular/core';
import { Estudiante } from '../models/estudiantes/estudiantes.module';

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {
  private estudiantes: Estudiante[] = [];

  constructor() {
    const data = localStorage.getItem('estudiantes');
    this.estudiantes = data ? JSON.parse(data) : [];
  }

  private guardarEnLocalStorage(): void {
    localStorage.setItem('estudiantes', JSON.stringify(this.estudiantes));
  }

  listarEstudiantes(): Estudiante[] {
    return this.estudiantes;
  }

  agregarEstudiante(estudiante: Estudiante): void {
    this.estudiantes.push(estudiante);
    this.guardarEnLocalStorage();
  }

  eliminarEstudiante(index: number): void {
    this.estudiantes.splice(index, 1);
    this.guardarEnLocalStorage();
  }

  modificarEstudiante(index: number, estudiante: Estudiante): void {
    this.estudiantes[index] = estudiante;
    this.guardarEnLocalStorage();
  }

  calcularEstadisticas(): { aprobados: number; reprobados: number; promedioGeneral: number; porcentajePorSexo: Record<string, number> } {
    const total = this.estudiantes.length;
    const aprobados = this.estudiantes.filter((e) => e.estadoAprobatorio === 'Aprobado').length;
    const promedioGeneral = this.estudiantes.reduce((sum, e) => sum + (e.calificacionFinal || 0), 0) / total;

    const porcentajePorSexo = this.estudiantes.reduce<Record<string, number>>((acc, estudiante) => {
      if (estudiante.estadoAprobatorio === 'Aprobado') {
        acc[estudiante.sexo] = (acc[estudiante.sexo] || 0) + 1;
      }
      return acc;
    }, {});

    for (const sexo in porcentajePorSexo) {
      if (porcentajePorSexo.hasOwnProperty(sexo)) {
        porcentajePorSexo[sexo] = (porcentajePorSexo[sexo] / total) * 100;
      }
    }

    return { aprobados, reprobados: total - aprobados, promedioGeneral, porcentajePorSexo };
  }
}
