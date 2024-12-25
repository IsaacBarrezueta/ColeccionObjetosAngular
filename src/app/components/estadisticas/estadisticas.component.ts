import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit {
  estadisticas: {
    aprobados: number;
    reprobados: number;
    promedioGeneral: number;
    porcentajePorSexo: Record<string, number>;
  } = {
    aprobados: 0,
    reprobados: 0,
    promedioGeneral: 0,
    porcentajePorSexo: {},
  };

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.estadisticas = this.estudianteService.calcularEstadisticas();
  }
}
