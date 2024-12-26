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
  // Form para crear/editar
  estudianteForm: Estudiante = this.nuevoEstudianteVacio();
  editIndex: number | null = null; // null => modo “crear”

  // (Opcional) Podemos usar esta bandera para resaltar
  // el campo de examen de recuperación si se entró por “Nota Recuperación”.
  modoRecuperacion = false;

  constructor(
    private router: Router,
    public estudianteService: EstudianteService
  ) {}

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
      estadoAprobatorio: 'Reprobado' // Valor por defecto
    };
  }

  /** Cuando se clickea “Actualizar” o “Nota Recuperación”,
   *  abrimos el mismo formulario con los datos del estudiante. */
  editarEstudiante(i: number, modoRecuperacion: boolean = false): void {
    this.editIndex = i;
    this.modoRecuperacion = modoRecuperacion; // Si llamamos con true, enfocamos el ER
    // Clonamos para no alterar la lista en vivo
    this.estudianteForm = { ...this.estudianteService.estudiantes[i] };
  }

  eliminarEstudiante(i: number): void {
    this.estudianteService.estudiantes.splice(i, 1);
    this.estudianteService.guardarEnLocalStorage();
    this.cancelarEdicion();
  }

  guardarEstudiante(): void {
    // Antes de guardar, calculamos notas
    this.calcularNotas(this.estudianteForm);

    if (this.editIndex === null) {
      // Crear
      this.estudianteService.estudiantes.push({ ...this.estudianteForm });
    } else {
      // Actualizar
      this.estudianteService.estudiantes[this.editIndex] = { ...this.estudianteForm };
    }

    this.estudianteService.guardarEnLocalStorage();
    this.cancelarEdicion();
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.modoRecuperacion = false;
    this.estudianteForm = this.nuevoEstudianteVacio();
  }

  /**
   * Lógica de cálculo de CF, ND y estado:
   * - CF = (P1 + P2) / 2
   * - Si CF >= 7 => Aprobado
   * - Si CF < 5.5 => Reprobado
   * - Si 5.5 <= CF < 7 => En recuperación (y ND se calcula si hay examenRecuperacion)
   */
  private calcularNotas(e: Estudiante): void {
    e.calificacionFinal = (e.parcial1 + e.parcial2) / 2;

    if (e.calificacionFinal >= 7) {
      e.estadoAprobatorio = 'Aprobado';
      e.examenRecuperacion = undefined;
      e.notaDefinitiva = undefined;
    } else if (e.calificacionFinal < 5.5) {
      e.estadoAprobatorio = 'Reprobado';
      e.examenRecuperacion = undefined;
      e.notaDefinitiva = undefined;
    } else {
      // Entre 5.5 y 7 => En recuperación
      e.estadoAprobatorio = 'En recuperación';

      if (e.examenRecuperacion !== undefined && e.examenRecuperacion !== null) {
        // Si ya ingresó ER, calculamos ND
        e.notaDefinitiva = e.calificacionFinal * 0.4 + e.examenRecuperacion * 0.6;
        e.estadoAprobatorio = (e.notaDefinitiva >= 7) ? 'Aprobado' : 'Reprobado';
      } else {
        e.notaDefinitiva = undefined;
      }
    }
  }

  /** Getter para mostrar campo "Examen de Recuperación" en el form
   *  si (CF en [5.5,7) y estado = "En recuperación"). */
  get requiereRecuperacion(): boolean {
    const e = this.estudianteForm;
    return e.estadoAprobatorio === 'En recuperación'
      && e.calificacionFinal >= 5.5
      && e.calificacionFinal < 7;
  }

  /** Para el router a /estadisticas */
  verEstadisticas(): void {
    this.router.navigate(['/estadisticas']);
  }
}
