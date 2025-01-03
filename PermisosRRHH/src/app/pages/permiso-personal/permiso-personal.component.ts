import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  fecha: string = new Date().toISOString().split('T')[0]; // Fecha actual por defecto
  horas: number = 1;
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
  modalContent: any;
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, @Inject(NgbModal) private modalService: NgbModal) {}
  
  ngOnInit() {
    this.obtenerDatosEmpleado();
    this.validarFormulario();
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
    console.log('Enviando solicitud:', solicitud);
    this.http.post(this.apiUrl, solicitud).subscribe({
      next: (response) => {
        console.log('Solicitud enviada', response);
        this.openModal('¡Éxito!', 'Solicitud enviada correctamente');
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al enviar la solicitud', error);
        this.openModal('Error', 'No cuenta con horas disponibles para permisos personales');
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
    this.horas = 1;
    this.motivo = 'Asunto Personal.';
    this.citaMedica = 0; // No por defecto
  }
}
