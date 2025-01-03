import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-permiso-personal',
  imports: [CommonModule, FormsModule],
  templateUrl: './permiso-personal.component.html',
  styleUrl: './permiso-personal.component.css'
})
export class PermisoPersonalComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/permisoPersonal`;

  empleado = {
    nombre: '',
    dependencia: '',
    cargo: ''
  };
  fecha: string = '';
  horas: number = 1;
  motivo: string = '';
  citaMedica: string = 'no';
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit() {
    this.obtenerDatosEmpleado();
  }

  obtenerDatosEmpleado() {   

    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Datos del empleado:', data[0]);
        this.empleado.nombre = `${data[0].pri_nombre} ${data[0].seg_nombre} ${data[0].pri_apellido} ${data[0].seg_apellido}`;
        this.empleado.dependencia = data[0].nom_dependencia;
        this.empleado.cargo = data[0].nom_cargo;
      },
      error: (error) => {
        console.error('Error detallado:', error);
      }
    });
  }

  submitForm() {
    const solicitud = {
      fecha_solicitud: this.fecha,
      horas_solicitadas: this.horas,
      motivo: this.motivo,
      catalogada_emergencia: this.citaMedica,
    };
    
    this.http.post(this.apiUrl, solicitud).subscribe(
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