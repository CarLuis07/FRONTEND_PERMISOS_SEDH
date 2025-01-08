import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';

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
    cargo: ''
  };
  
  // Establecer fecha actual en zona horaria de Honduras (UTC-6)
  fecha: string = new Date().toLocaleString('es-HN', { 
    timeZone: 'America/Tegucigalpa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-'); // Fecha actual por defecto

  horas: number = 3;
  motivo: string = 'Asunto Personal.';
  citaMedica: number = 0; // 0 = No, 1 = Sí
  formInvalido: boolean = true;
  camposInvalidos = {
    fecha: false,
    motivo: false,
    horas: false
  };
  modalTitle: string = '';
  modalMessage: string = '';
  @ViewChild('modalContent') modalContent: any;
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private modalService: NgbModal) {}
  
  ngOnInit() {
    this.obtenerDatosEmpleado();
    this.validarFormulario();
  }

  obtenerDatosEmpleado() {   

    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.empleado.nombre = `${data[0].pri_nombre} ${data[0].seg_nombre} ${data[0].pri_apellido} ${data[0].seg_apellido}`;
        this.empleado.dependencia = data[0].nom_dependencia;
        this.empleado.cargo = data[0].nom_cargo;
      },
      error: (error) => {
        console.error('Error detallado:', error);
      }
    });
  }

  validarFormulario() {
    this.camposInvalidos = {
      fecha: !this.fecha,
      motivo: !this.motivo?.trim(),
      horas: this.horas < 1 || this.horas > 9
    };

    this.formInvalido = Object.values(this.camposInvalidos).some(invalid => invalid) || 
                        (this.citaMedica !== 0 && this.citaMedica !== 1);
  }

  onInputChange() {
    this.validarFormulario();
  }

  submitForm() {

    const fechaFormateada = new Date(this.fecha).toISOString().split('T')[0];

    const solicitud = {
      fecha_solicitud: fechaFormateada,
      horas_solicitadas: this.horas,
      motivo: this.motivo.trim(),
      catalogada_emergencia: this.citaMedica
    };

    this.agregarPermisoPersonal(solicitud);
  }
  
  agregarPermisoPersonal(solicitud: any) {
    this.http.post(this.apiUrl, solicitud).subscribe({
      next: () => {
        this.openModal('¡Éxito!', 'Solicitud enviada correctamente a su jefe inmediato.');
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al enviar la solicitud', error);
        this.openModal('¡Ups Lo Sentimos!', `Usted No cuenta con ${this.horas} horas disponibles para permisos personales este mes, intente menos horas.`);
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
    this.fecha = new Date().toISOString().split('T')[0];
    this.horas = 3;
    this.motivo = 'Asunto Personal.';
    this.citaMedica = 0; // No por defecto
  }
}


