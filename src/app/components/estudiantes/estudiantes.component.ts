import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiantes/estudiantes.module';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [FormsModule], // Asegúrate de incluir FormsModule aquí
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css'],
})
export class EstudiantesComponent {
  estudiantes: Estudiante[] = [];
  nuevoEstudiante: Estudiante = new Estudiante('', '', '', 'M', new Date(), '', 0, 0);
  indiceEdicion: number | null = null;
  estudianteEnEdicion: Estudiante | null = null;

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.estudiantes = this.estudianteService.listarEstudiantes();
  }

  agregarEstudiante(): void {
    let calificacionFinal = (this.nuevoEstudiante.parcial1 + this.nuevoEstudiante.parcial2) / 2;
    let estadoAprobatorio = calificacionFinal >= 7 ? 'Aprobado' : 'Reprobado';

    const estudiante = new Estudiante(
      '',
      this.nuevoEstudiante.nombres,
      this.nuevoEstudiante.apellidos,
      this.nuevoEstudiante.sexo,
      new Date(),
      this.nuevoEstudiante.codigo,
      this.nuevoEstudiante.parcial1,
      this.nuevoEstudiante.parcial2
    );

    estudiante.calificacionFinal = calificacionFinal;
    estudiante.estadoAprobatorio = estadoAprobatorio;

    this.estudianteService.agregarEstudiante(estudiante);
    this.estudiantes = this.estudianteService.listarEstudiantes();
    this.nuevoEstudiante = new Estudiante('', '', '', 'M', new Date(), '', 0, 0);
  }

  eliminarEstudiante(index: number): void {
    this.estudianteService.eliminarEstudiante(index);
    this.estudiantes = this.estudianteService.listarEstudiantes();
  }

  cargarEstudiante(indice: number): void {
    this.indiceEdicion = indice;
    this.estudianteEnEdicion = { ...this.estudiantes[indice] };
  }

  actualizarEstudiante(): void {
    if (this.indiceEdicion !== null && this.estudianteEnEdicion) {
      const estudianteActualizado = new Estudiante(
        this.estudianteEnEdicion.cedula,
        this.estudianteEnEdicion.nombres,
        this.estudianteEnEdicion.apellidos,
        this.estudianteEnEdicion.sexo,
        this.estudianteEnEdicion.fechaNacimiento,
        this.estudianteEnEdicion.codigo,
        this.estudianteEnEdicion.parcial1,
        this.estudianteEnEdicion.parcial2
      );

      this.estudianteService.modificarEstudiante(this.indiceEdicion, estudianteActualizado);
      this.estudiantes = this.estudianteService.listarEstudiantes();

      this.indiceEdicion = null;
      this.estudianteEnEdicion = null;
    }
  }
}
