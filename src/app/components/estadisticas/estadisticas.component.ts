// src/app/components/estadisticas/estadisticas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Importa todo lo necesario de ng-apexcharts:
import {
  NgApexchartsModule,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiantes.model';

/**
 * Definimos tipos de configuración para el gráfico Pie.
 */
export interface ChartOptionsPie {
  series: ApexNonAxisChartSeries;  // Los datos (números) que se grafican
  chart: ApexChart;                // Tipo de gráfica y configuraciones
  labels: string[];                // Etiquetas para cada serie
  responsive: ApexResponsive[];    // Config. responsiva
  legend: ApexLegend;              // Leyenda (posición, etc.)
  title: ApexTitleSubtitle;        // Título del gráfico
}

/**
 * Definimos tipos de configuración para el gráfico de Barras.
 */
export interface ChartOptionsBar {
  series: any[];                   // Los datos (números) que se grafican
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;               // Opcional, solo si necesitamos
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  // Importamos CommonModule (para *ngIf, *ngFor) y NgApexchartsModule (para <apx-chart>)
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  // Variables de texto o números como antes
  porcentajeAprobados = 0;
  porcentajeReprobados = 0;
  porcentajeAprobadosHombres = 0;
  porcentajeAprobadosMujeres = 0;
  promedioGeneral = 0;
  estudiantesSobrePromedio: Estudiante[] = [];

  // Configuración para el gráfico Pie (Aprobados vs. Reprobados)
  chartOptionsPie: ChartOptionsPie = {
    series: [],
    chart: {
      type: 'pie'
    },
    labels: ['Aprobados', 'Reprobados'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    legend: {
      position: 'right'
    },
    title: {
      text: 'Distribución Aprobados vs. Reprobados',
      align: 'center'
    }
  };

  // Configuración para el gráfico de Barras (Aprobados Hombres vs. Mujeres)
  chartOptionsBar: ChartOptionsBar = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        distributed: true,  // barras de colores distintos
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['Hombres', 'Mujeres']
    },
    title: {
      text: 'Aprobados por Sexo',
      align: 'center'
    }
  };

  constructor(
    private router: Router,
    public estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    // Calcula primero los porcentajes y promedios
    this.calcularEstadisticas();
    // Luego carga la data en los gráficos
    this.generarGraficos();
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

    // Contar cuántos Aprobados / Reprobados (excluyendo "En recuperación" si así lo deseas)
    const aprobados = lista.filter(e => e.estadoAprobatorio === 'Aprobado').length;
    const reprobados = lista.filter(e => e.estadoAprobatorio === 'Reprobado').length;
    this.porcentajeAprobados = (aprobados / total) * 100;
    this.porcentajeReprobados = (reprobados / total) * 100;

    // Aprobados Hombres / Mujeres
    const aprobHombres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'M').length;
    const aprobMujeres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'F').length;

    const totalHombres = lista.filter(e => e.sexo === 'M').length;
    const totalMujeres = lista.filter(e => e.sexo === 'F').length;

    this.porcentajeAprobadosHombres = totalHombres === 0 
      ? 0 
      : (aprobHombres / totalHombres) * 100;
    this.porcentajeAprobadosMujeres = totalMujeres === 0 
      ? 0
      : (aprobMujeres / totalMujeres) * 100;

    // Promedio general (usamos ND si existe, sino CF)
    const sum = lista.reduce((acc, e) => {
      const notaFinal = e.notaDefinitiva != null ? e.notaDefinitiva : e.calificacionFinal;
      return acc + notaFinal;
    }, 0);
    this.promedioGeneral = sum / total;

    // Quienes están sobre ese promedio
    this.estudiantesSobrePromedio = lista.filter(e => {
      const notaFinal = e.notaDefinitiva != null ? e.notaDefinitiva : e.calificacionFinal;
      return notaFinal > this.promedioGeneral;
    });
  }

  /**
   * Generamos los datos (series) para ambas gráficas
   * y las asignamos a "chartOptionsPie" y "chartOptionsBar".
   */
  generarGraficos(): void {
    // Gráfico Pie: # de Aprobados vs # de Reprobados
    const aprobados = this.estudianteService.estudiantes.filter(e => e.estadoAprobatorio === 'Aprobado').length;
    const reprobados = this.estudianteService.estudiantes.filter(e => e.estadoAprobatorio === 'Reprobado').length;

    // Asignamos a "series" la cantidad (no el porcentaje, puedes cambiarlo si gustas).
    this.chartOptionsPie.series = [aprobados, reprobados];

    // Gráfico de Barras: Aprobados Hombres vs Aprobados Mujeres
    const aprobHombres = this.estudianteService.estudiantes.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'M').length;
    const aprobMujeres = this.estudianteService.estudiantes.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'F').length;

    this.chartOptionsBar.series = [
      {
        name: 'Aprobados',
        data: [aprobHombres, aprobMujeres]
      }
    ];
  }

  /** Botón para volver a la pantalla de estudiantes */
  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
}
