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
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Variables para el modal de edición de horas
  mostrarModal: boolean = false;
  nuevasHoras: string | null = null;
  mensajeHoras: string = '';
  errorHoras: boolean = false;
  actualizandoHoras: boolean = false;
  
  constructor(private http: HttpClient) {}

  buscarEmpleado() {
    if (!this.searchQuery) {
      this.errorMessage = 'Por favor ingrese un correo institucional';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const payload = {
      email_institucional: this.searchQuery
    };
    
    this.http.post(`${environment.apiUrl}/empleados/buscar`, payload)
      .subscribe({
        next: (data: any) => {
          this.empleado = this.mapearDatosEmpleado(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'No se encontró el empleado o hubo un error en la búsqueda';
          this.isLoading = false;
          this.empleado = null;
        }
      });
  }

  mapearDatosEmpleado(data: any) {
    return {
      emailInstitucional: data.email_institucional,
      nombre: `${data.pri_nombre} ${data.seg_nombre} ${data.pri_apellido} ${data.seg_apellido}`,
      fechaIngreso: data.fech_ingreso_laboral,
      dni: data.num_identidad,
      telefono: data.num_telefono,
      tipoContrato: data.tipo_contratacion,
      cargo: data.cargo,
      dependencia: data.nom_dependencia,
      jefeInmediato: data.id_sup_inmediato,
      sexo: data.sexo === 'Masculino' ? 'M' : 'F',
      estadoCivil: data.estado_civil,
      departamento: data.departamento,
      municipio: data.municipio,
      horasDisponibles: data.hor_disponibles
    };
  }

  toggleEdicion() {
    if (this.modoEdicion) {
      this.guardarCambios();
    }
    this.modoEdicion = !this.modoEdicion;
  }

  guardarCambios() {
    // Aquí necesitaríamos mapear de vuelta los datos para el API
    const datosActualizados = {
      email_institucional: this.empleado.emailInstitucional,
      // Agregar los demás campos según sea necesario
    };
    
    this.http.put(`${environment.apiUrl}/empleados/${this.empleado.emailInstitucional}`, datosActualizados)
      .subscribe({
        next: () => {
          console.log('Cambios guardados');
          // Mostrar mensaje de éxito
        },
        error: (error) => {
          console.error('Error al guardar cambios:', error);
          // Mostrar mensaje de error
        }
      });
  }
  
  // Métodos para el modal de edición de horas
  abrirModalHoras() {
    this.mostrarModal = true;
    this.nuevasHoras = this.empleado.horasDisponibles;
    this.mensajeHoras = '';
    document.body.classList.add('modal-open');
  }
  
  cerrarModalHoras() {
    this.mostrarModal = false;
    document.body.classList.remove('modal-open');
  }
  
  actualizarHoras() {
    if (!this.nuevasHoras) {
      this.mensajeHoras = 'Por favor ingrese un valor para las horas disponibles';
      this.errorHoras = true;
      return;
    }

    this.actualizandoHoras = true;
    this.mensajeHoras = '';

    const token = localStorage.getItem('token');
    let actualizadoPor = '';
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      actualizadoPor = payload.sub || '';
    }

    const horaFormateada = /^\d{2}:\d{2}$/.test(this.nuevasHoras)
      ? `${this.nuevasHoras}:00`
      : this.nuevasHoras;

    const body = {
      email_institucional: this.empleado.emailInstitucional,
      hor_disponibles: horaFormateada,
      actualizado_por: actualizadoPor
    };

    this.http.put(`${environment.apiUrl}/actualizarHorasDisponibles/`, body)
      .subscribe({
        next: (response: any) => {
          this.actualizandoHoras = false;
          this.mensajeHoras = 'Horas disponibles actualizadas correctamente';
          this.errorHoras = false;
          this.empleado.horasDisponibles = this.nuevasHoras;
          
          // Cerrar el modal después de 1.5 segundos
          setTimeout(() => {
            this.cerrarModalHoras();
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar horas:', error);
          this.actualizandoHoras = false;
          this.mensajeHoras = 'Error al actualizar las horas disponibles';
          this.errorHoras = true;
        }
      });
  }
}