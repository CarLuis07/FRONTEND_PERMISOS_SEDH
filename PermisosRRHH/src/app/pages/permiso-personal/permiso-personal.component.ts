import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permiso-personal',
  imports: [CommonModule, FormsModule],
  templateUrl: './permiso-personal.component.html',
  styleUrl: './permiso-personal.component.css'
})
export class PermisoPersonalComponent {
  empleado = {
    nombre: '',
    dependencia: '',
    cargo: ''
  };
  fecha: string = '';
  horas: number = 1;
  motivo: string = '';
  citaMedica: string = 'no';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDatosEmpleado();
  }

  obtenerDatosEmpleado() {
    this.http.get<any>('http://localhost:8000/api/empleado').subscribe(
      data => {
        this.empleado.nombre = data.nombre;
        this.empleado.dependencia = data.dependencia;
        this.empleado.cargo = data.cargo;
      },
      error => {
        console.error('Error al obtener datos del empleado', error);
      }
    );
  }

  submitForm() {
    const solicitud = {
      nombre: this.empleado.nombre,
      dependencia: this.empleado.dependencia,
      cargo: this.empleado.cargo,
      fecha: this.fecha,
      horas: this.horas,
      motivo: this.motivo,
      citaMedica: this.citaMedica
    };
    
    this.http.post('http://localhost:8000/api/solicitud-permiso', solicitud).subscribe(
      response => {
        console.log('Solicitud enviada', response);
        // Aquí puedes agregar lógica para mostrar un mensaje de éxito o redirigir al usuario
      },
      error => {
        console.error('Error al enviar la solicitud', error);
      }
    );
  }
}
