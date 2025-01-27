import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-permiso-oficial',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './permiso-oficial.component.html',
  styleUrl: './permiso-oficial.component.css'
})
export class PermisoOficialComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/permisoOficial`;

  empleado = {
    nombre: '',
    dependencia: '',
    cargo: ''
  };
 
  // Establecer fecha actual en zona horaria de Honduras (UTC-6)
  fecha: string = new Date().toLocaleString('es-HN', { 
    timeZone: 'America/Tegucigalpa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-'); // Fecha actual por defecto
  
  motivo: string = '';
  formInvalido: boolean = true;
  camposInvalidos = {
    fecha: false,
    motivo: false,
  };
  modalTitle: string = '';
  modalMessage: string = '';
  @ViewChild('modalContent') modalContent: any;
  isLoading: boolean = true;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private modalService: NgbModal) {}
  
  ngOnInit() {
    this.obtenerDatosEmpleado();
    this.validarFormulario();
  }

  obtenerDatosEmpleado() {   
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.empleado.nombre = `${data[0].pri_nombre} ${data[0].seg_nombre} ${data[0].pri_apellido} ${data[0].seg_apellido}`;
        this.empleado.dependencia = data[0].nom_dependencia;
        this.empleado.cargo = data[0].nom_cargo;
        this.isLoading = false;
        this.validarFormulario();
      },
      error: (error) => {
        console.error('Error detallado:', error);
        this.isLoading = false;
      }
    });
  }
  validarFormulario() {
    this.camposInvalidos = {
      fecha: !this.fecha,
      motivo: !this.motivo?.trim()
    }
   
    this.formInvalido = Object.values(this.camposInvalidos).some(invalid => invalid);
  }

  onInputChange() {
    this.validarFormulario();
  }

  submitForm() {
    const fechaFormateada = new Date(this.fecha).toISOString().split('T')[0];
    
    const solicitud = {
      fecha_solicitud: fechaFormateada,
      motivo: this.motivo.trim()
    };
    this.agregarPermisoOficial(solicitud);
  }

  agregarPermisoOficial(solicitud: any) {
    this.http.post(this.apiUrl, solicitud).subscribe({
      next: () => {
        this.openModal('¡Éxito!', 'Solicitud enviada correctamente a su jefe inmediato.');
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al enviar la solicitud', error);
        this.openModal('¡Ups Lo Sentimos!', error.error.message);
      }
    });
  }

  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalService.open(this.modalContent, {
      centered: true,
      backdrop: 'static'
    });
  }

  limpiarFormulario() {
    this.fecha = new Date().toLocaleString('es-HN', { 
      timeZone: 'America/Tegucigalpa',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-');
    this.motivo = '';
  }
}
