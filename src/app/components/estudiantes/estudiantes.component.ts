// src/app/components/estudiantes/estudiantes.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiantes.model';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent {

  // Para manejar el formulario de crear/editar
  estudianteForm: Estudiante = this.nuevoEstudianteVacio();
  editIndex: number | null = null; // si es null => modo Crear

  constructor(
    private router: Router,
    public estudianteService: EstudianteService
  ) {}

  /** Crear un objeto "vacío" para el formulario */
  private nuevoEstudianteVacio(): Estudiante {
    return {
      cedula: '',
      nombres: '',
      apellidos: '',
      sexo: 'M',
      fechaNacimiento: '',
      codigo: '',
      parcial1: 0,
      parcial2: 0,
      calificacionFinal: 0,
      estadoAprobatorio: 'Reprobado'
    };
  }

  /** Lógica CRUD */
  editarEstudiante(i: number): void {
    this.editIndex = i;
    // Clonar para no alterar en vivo
    this.estudianteForm = { ...this.estudianteService.estudiantes[i] };
  }

  eliminarEstudiante(i: number): void {
    this.estudianteService.estudiantes.splice(i, 1);
    this.cancelarEdicion();
  }

  guardarEstudiante(): void {
    // Primero calculamos las notas
    this.calcularNotas(this.estudianteForm);

    if (this.editIndex === null) {
      // Crear
      this.estudianteService.estudiantes.push({ ...this.estudianteForm });
    } else {
      // Editar
      this.estudianteService.estudiantes[this.editIndex] = { ...this.estudianteForm };
    }

    this.cancelarEdicion();
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.estudianteForm = this.nuevoEstudianteVacio();
  }

  /**
   * Calcular CF y ND:
   * CF = (p1 + p2) / 2
   * Si CF >= 7 => Aprobado
   * Si CF < 5.5 => Reprobado
   * Si 5.5 <= CF < 7 => ND = CF*0.4 + ER*0.6 (si hay ER)
   */
  private calcularNotas(e: Estudiante): void {
    e.calificacionFinal = (e.parcial1 + e.parcial2) / 2;
    e.notaDefinitiva = undefined;

    if (e.calificacionFinal >= 7) {
      e.estadoAprobatorio = 'Aprobado';
      e.examenRecuperacion = undefined;
    } else if (e.calificacionFinal < 5.5) {
      e.estadoAprobatorio = 'Reprobado';
      e.examenRecuperacion = undefined;
    } else {
      // 5.5 <= CF < 7 => requiere ER
      if (e.examenRecuperacion !== undefined) {
        e.notaDefinitiva = e.calificacionFinal * 0.4 + e.examenRecuperacion * 0.6;
        e.estadoAprobatorio = e.notaDefinitiva >= 7 ? 'Aprobado' : 'Reprobado';
      } else {
        // No se ha ingresado ER -> "Reprobado" o "Pendiente" (tú decides)
        e.estadoAprobatorio = 'Reprobado';
      }
    }
  }

  /** Getter para mostrar campo ER sólo si CF está en [5.5, 7) */
  get requiereRecuperacion(): boolean {
    const cf = this.estudianteForm.calificacionFinal;
    return cf >= 5.5 && cf < 7;
  }

  /** Botón para ir a la pantalla de estadísticas */
  verEstadisticas(): void {
    this.router.navigate(['/estadisticas']);
  }
}
