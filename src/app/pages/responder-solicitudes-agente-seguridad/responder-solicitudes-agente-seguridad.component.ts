import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Console } from 'node:console';

@Component({
  selector: 'app-responder-solicitudes-agente-seguridad',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './responder-solicitudes-agente-seguridad.component.html',
  styleUrl: './responder-solicitudes-agente-seguridad.component.css'
})
export class ResponderSolicitudesAgenteSeguridadComponent implements OnInit{

  solicitudes: any[] = [];
  apiUrl = `${environment.apiUrl}/aprobarSolicitudesAgente/`;

  empleado = {
    fecha: '',
    tipoSolicitud: '',
    nombre: '',
    estadoSolicitud: '',
    horaRetorno:''
  };

  modalTitle: string = '';
  modalMessage: string = '';
  horaEntrada: string = '';
  horaSalida: string = '';
  horaRetorno: string = '';
  @ViewChild('modalContent') modalContent: any;
  modalRef: any;

  constructor(private http: HttpClient, private modalService: NgbModal) {}
  
  fecha: string = new Date().toLocaleString('es-HN', { 
    timeZone: 'America/Tegucigalpa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-');

  solicitudSeleccionada: any = {};

  mot_rechazo: string = '';

  ngOnInit() {
    this.obtenerTodasLasSolicitudes();
  }

  obtenerTodasLasSolicitudes() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.solicitudes = data;
        console.log(this.solicitudes);
      },
      error: (error) => {
      }
    });
  }
  openModal(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.modalTitle = solicitud.nom_tipo_solicitud;
    
    // Validar estado de hora salida
    this.solicitudSeleccionada.horaSalidaBloqueada = solicitud.hor_salida !== null;
    
    // Validar si se puede mostrar hora retorno
    this.solicitudSeleccionada.horaRetornoBloqueada = !solicitud.hor_salida;
    
    const modalRef = this.modalService.open(this.modalContent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
  }

  abrirModal(content: any, solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.solicitudSeleccionada.hor_salida_registrada = solicitud.hor_salida !== null;
    this.horaRetorno = solicitud.hor_retorno || '';
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  enviarHoraSalida() {
    const token = localStorage.getItem('token');
    let userEmail = '';
    
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      userEmail = tokenData.sub;
    }

    const payload = {
      id_permiso: this.solicitudSeleccionada.id_permiso,
      tipo_permiso: this.solicitudSeleccionada.nom_tipo_solicitud,
      agente_aprobacion: userEmail,
      hor_salida: this.solicitudSeleccionada.hor_salida
    };
    
    this.http.put(this.apiUrl, payload).subscribe({
      next: (response) => {
        this.solicitudSeleccionada.hor_salida_registrada = true;
        this.obtenerTodasLasSolicitudes();
        this.modalService.dismissAll();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  enviarHoraRetorno() {
    const token = localStorage.getItem('token');
    let userEmail = '';
    
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      userEmail = tokenData.sub;
    }

    const payload = {
      id_permiso: this.solicitudSeleccionada.id_permiso,
      tipo_permiso: this.solicitudSeleccionada.nom_tipo_solicitud,
      agente_aprobacion: userEmail,
      hor_retorno: this.horaRetorno
    };
    
    // TODO: Agregar endpoint para hora retorno
    this.http.put(`${this.apiUrl}/retorno`, payload).subscribe({
      next: (response) => {
        this.obtenerTodasLasSolicitudes();
        this.modalService.dismissAll();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  limpiarFormulario() {
    this.mot_rechazo = '';
  }

  getHoraCompleta(hora: string, periodo: string): string {
    return `${hora} ${periodo}`;
  }
}
