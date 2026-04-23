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
  guardandoCambios: boolean = false;
  mensajeEdicion: string = '';
  errorEdicion: boolean = false;

  // Datos para selects de edición
  datosUrl = `${environment.apiUrl}/datos-sedh`;
  dependencias: any[] = [];
  cargos: any[] = [];
  filteredCargosEdicion: any[] = [];
  tiposContrataciones: any[] = [];
  estadosCiviles: any[] = [];
  
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
      idTipoContrato: null,
      cargo: data.cargo,
      idCargo: null,
      dependencia: data.nom_dependencia,
      idDependencia: null,
      jefeInmediato: data.jefe_inmediato,
      sexo: data.sexo === 'Masculino' ? 'M' : 'F',
      estadoCivil: data.estado_civil,
      idEstadoCivil: null,
      actLaboral: data.act_laboral,
      departamento: data.departamento,
      horasDisponibles: data.hor_disponibles
    };
  }

  toggleEdicion() {
    if (this.modoEdicion) {
      this.guardarCambios();
    } else {
      this.mensajeEdicion = '';
      this.modoEdicion = true;
      this.cargarDatosEdicion();
    }
  }

  cargarDatosEdicion() {
    if (this.dependencias.length > 0) {
      this.preSeleccionarCatalogos();
      return;
    }
    this.http.get<any>(this.datosUrl).subscribe({
      next: (response) => {
        this.dependencias = response.dependencias;
        this.cargos = response.cargos;
        this.tiposContrataciones = response.tipos_contrataciones;
        this.estadosCiviles = response.estados_civiles;
        this.preSeleccionarCatalogos();
      },
      error: (error) => console.error('Error al cargar datos:', error)
    });
  }

  preSeleccionarCatalogos() {
    const dep = this.dependencias.find(d => d.descripcion === this.empleado.dependencia);
    this.empleado.idDependencia = dep?.id ?? null;
    this.filtrarCargos();
    const cargo = this.filteredCargosEdicion.find(c => c.descripcion === this.empleado.cargo);
    this.empleado.idCargo = cargo?.id ?? null;
    const tipo = this.tiposContrataciones.find(t => t.descripcion === this.empleado.tipoContrato);
    this.empleado.idTipoContrato = tipo?.id ?? null;
    const estado = this.estadosCiviles.find(e => e.descripcion === this.empleado.estadoCivil);
    this.empleado.idEstadoCivil = estado?.id ?? null;
  }

  filtrarCargos() {
    this.filteredCargosEdicion = this.cargos.filter(
      c => c.id_dependencia === +this.empleado.idDependencia
    );
  }

  onDependenciaChangeEdicion() {
    this.empleado.idCargo = null;
    this.filtrarCargos();
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.mensajeEdicion = '';
    // Re-cargar datos originales
    this.buscarEmpleado();
  }

  guardarCambios() {
    this.guardandoCambios = true;
    this.mensajeEdicion = '';

    const body = {
      email_institucional: this.empleado.emailInstitucional,
      act_laboralmente: this.empleado.actLaboral,
      num_telefono: this.empleado.telefono,
      id_tipo_contratacion: this.empleado.idTipoContrato,
      id_cargo: this.empleado.idCargo,
      nombre_jefe: this.empleado.jefeInmediato,
      id_estado_civil: this.empleado.idEstadoCivil
    };

    this.http.put(`${environment.apiUrl}/empleados/actualizar`, body)
      .subscribe({
        next: () => {
          this.guardandoCambios = false;
          this.mensajeEdicion = 'Cambios guardados correctamente';
          this.errorEdicion = false;
          this.modoEdicion = false;

          // Actualizar textos visibles con los valores seleccionados
          const dep = this.dependencias.find(d => d.id === +this.empleado.idDependencia);
          if (dep) this.empleado.dependencia = dep.descripcion;

          const cargo = this.filteredCargosEdicion.find(c => c.id === +this.empleado.idCargo);
          if (cargo) this.empleado.cargo = cargo.descripcion;

          const tipo = this.tiposContrataciones.find(t => t.id === +this.empleado.idTipoContrato);
          if (tipo) this.empleado.tipoContrato = tipo.descripcion;

          const estado = this.estadosCiviles.find(e => e.id === +this.empleado.idEstadoCivil);
          if (estado) this.empleado.estadoCivil = estado.descripcion;

          setTimeout(() => { this.mensajeEdicion = ''; }, 3000);
        },
        error: (error) => {
          console.error('Error al guardar cambios:', error);
          this.guardandoCambios = false;
          this.mensajeEdicion = 'Error al guardar los cambios';
          this.errorEdicion = true;
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