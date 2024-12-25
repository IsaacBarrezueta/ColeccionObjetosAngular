export class Estudiante {
  cedula: string;
  nombres: string;
  apellidos: string;
  sexo: 'M' | 'F';
  fechaNacimiento: Date;
  codigo: string;
  parcial1: number;
  parcial2: number;
  calificacionFinal: number;
  estadoAprobatorio: string;

  constructor(
    cedula: string,
    nombres: string,
    apellidos: string,
    sexo: 'M' | 'F',
    fechaNacimiento: Date,
    codigo: string,
    parcial1: number,
    parcial2: number
  ) {
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.sexo = sexo;
    this.fechaNacimiento = fechaNacimiento;
    this.codigo = codigo;
    this.parcial1 = parcial1;
    this.parcial2 = parcial2;
    this.calificacionFinal = (parcial1 + parcial2) / 2;
    this.estadoAprobatorio = Estudiante.calcularEstado(this.calificacionFinal);
  }

  // Método estático para calcular el estado
  static calcularEstado(calificacionFinal: number): string {
    if (calificacionFinal >= 7) {
      return 'Aprobado';
    } else if (calificacionFinal < 5.5) {
      return 'Reprobado';
    } else {
      return 'Recuperación';
    }
  }
}
