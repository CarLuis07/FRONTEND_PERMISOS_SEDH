import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-perfil-empleado',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-empleado.component.html',
  styleUrl: './perfil-empleado.component.css'
})
export class PerfilEmpleadoComponent {
  searchQuery: string = '';
  empleado: any = null;
  modoEdicion: boolean = false;
  
  constructor(private http: HttpClient) {}

  buscarEmpleado() {
    this.http.get(`${environment.apiUrl}/empleados/buscar/${this.searchQuery}`)
      .subscribe({
        next: (data: any) => {
          this.empleado = data;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  toggleEdicion() {
    if (this.modoEdicion) {
      this.guardarCambios();
    }
    this.modoEdicion = !this.modoEdicion;
  }

  guardarCambios() {
    this.http.put(`${environment.apiUrl}/empleados/${this.empleado.id}`, this.empleado)
      .subscribe({
        next: (response: any) => {
          console.log('Cambios guardados');
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }
}