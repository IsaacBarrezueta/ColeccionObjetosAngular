// src/app/components/estadisticas/estadisticas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiantes.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  porcentajeAprobados = 0;
  porcentajeReprobados = 0;
  porcentajeAprobadosHombres = 0;
  porcentajeAprobadosMujeres = 0;
  promedioGeneral = 0;
  estudiantesSobrePromedio: Estudiante[] = [];

  constructor(
    private router: Router,
    public estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.calcularEstadisticas();
  }

  calcularEstadisticas(): void {
    const lista = this.estudianteService.estudiantes;
    const total = lista.length;
    if (total === 0) {
      this.porcentajeAprobados = 0;
      this.porcentajeReprobados = 0;
      this.porcentajeAprobadosHombres = 0;
      this.porcentajeAprobadosMujeres = 0;
      this.promedioGeneral = 0;
      this.estudiantesSobrePromedio = [];
      return;
    }

    // Aprobados / Reprobados
    const aprobados = lista.filter(e => e.estadoAprobatorio === 'Aprobado').length;
    const reprobados = total - aprobados;
    this.porcentajeAprobados = (aprobados / total) * 100;
    this.porcentajeReprobados = (reprobados / total) * 100;

    // Aprobados por sexo
    const aprobadosHombres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'M').length;
    const aprobadosMujeres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'F').length;
    const totalHombres = lista.filter(e => e.sexo === 'M').length;
    const totalMujeres = lista.filter(e => e.sexo === 'F').length;

    this.porcentajeAprobadosHombres = (totalHombres === 0) 
      ? 0 
      : (aprobadosHombres / totalHombres) * 100;
    this.porcentajeAprobadosMujeres = (totalMujeres === 0) 
      ? 0
      : (aprobadosMujeres / totalMujeres) * 100;

    // Promedio general (ND si existe, sino CF)
    const sum = lista.reduce((acc, e) => {
      const notaFinal = (e.notaDefinitiva != null) ? e.notaDefinitiva : e.calificacionFinal;
      return acc + notaFinal;
    }, 0);
    this.promedioGeneral = sum / total;

    // Quienes superan ese promedio
    this.estudiantesSobrePromedio = lista.filter(e => {
      const notaFinal = (e.notaDefinitiva != null) ? e.notaDefinitiva : e.calificacionFinal;
      return notaFinal > this.promedioGeneral;
    });
  }

  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
}
