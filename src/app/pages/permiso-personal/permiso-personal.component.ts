import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permiso-personal',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './permiso-personal.component.html',
  styleUrl: './permiso-personal.component.css'
})
export class PermisoPersonalComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/permisoPersonal`;

  empleado = {
    nombre: '',
    dependencia: '',
    cargo: '',
    horasDisponibles: 0
  };
  
  // Establecer fecha actual en zona horaria de Honduras (UTC-6)
  fecha: string = new Date().toLocaleString('es-HN', { 
    timeZone: 'America/Tegucigalpa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-'); // Fecha actual por defecto

  horas: number = 3;
  minutos: number = 0;
  motivo: string = 'Asunto Personal.';
  citaMedica: number = 0; // 0 = No, 1 = Sí
  formInvalido: boolean = true;
  camposInvalidos = {
    fecha: false,
    motivo: false,
    horas: false,
    minutos: false
  };
  modalTitle: string = '';
  modalMessage: string = '';
  @ViewChild('modalContent') modalContent: any;
  isLoading: boolean = true;
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private modalService: NgbModal, private router: Router) {}
  
  ngOnInit() {
    this.obtenerDatosEmpleado();
  }

  obtenerDatosEmpleado() {   
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.empleado.nombre = `${data[0].pri_nombre} ${data[0].seg_nombre} ${data[0].pri_apellido} ${data[0].seg_apellido}`;
        this.empleado.dependencia = data[0].nom_dependencia;
        this.empleado.cargo = data[0].nom_cargo;
        this.empleado.horasDisponibles = data[0].hor_disponibles;
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
      motivo: !this.motivo?.trim(),
      horas: this.horas < 1 || this.horas > 9,
      minutos: this.minutos < 0 || this.minutos > 59
    };

    this.formInvalido = Object.values(this.camposInvalidos).some(invalid => invalid) || 
                        (this.citaMedica !== 0 && this.citaMedica !== 1);
  }

  onInputChange() {
    this.validarFormulario();
  }

  formatearHorasMinutos(): string {
    const horasStr = this.horas.toString().padStart(2, '0');
    const minutosStr = this.minutos.toString().padStart(2, '0');
    return `${horasStr}:${minutosStr}`;
  }

  submitForm() {
    this.validarFormulario();
    if (!this.formInvalido) {
      const solicitud = {
        fecha_solicitud: this.fecha,
        horas_solicitadas: this.formatearHorasMinutos(),
        motivo: this.motivo,
        citaMedica: this.citaMedica
      };
      console.log(solicitud)
      this.agregarPermisoPersonal(solicitud);
    }
  }
  
  agregarPermisoPersonal(solicitud: any) {
    this.http.post(this.apiUrl, solicitud).subscribe({
      next: () => {
        this.openModal('¡Éxito!', 'Solicitud enviada correctamente a su jefe inmediato.');
        this.limpiarFormulario();
        setTimeout(() => {
          this.modalService.dismissAll();
          // Redirigir dentro del menú principal
          this.router.navigate(['/menu-principal/mis-solicitudes']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al enviar la solicitud', error);
        this.openModal('¡Ups Lo Sentimos!', `Usted No cuenta con ${this.horas}:${this.minutos} horas disponibles para permisos personales este mes, intente menos horas.`);
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
    this.fecha =new Date().toLocaleString('es-HN', { 
      timeZone: 'America/Tegucigalpa',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-');
    this.horas = 3;
    this.motivo = 'Asunto Personal.';
    this.citaMedica = 0; // No por defecto
  }
}