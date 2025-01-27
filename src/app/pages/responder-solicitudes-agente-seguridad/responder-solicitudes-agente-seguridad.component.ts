import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responder-solicitudes-agente-seguridad',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './responder-solicitudes-agente-seguridad.component.html',
  styleUrl: './responder-solicitudes-agente-seguridad.component.css'
})
export class ResponderSolicitudesAgenteSeguridadComponent implements OnInit{

  solicitudes: any[] = [];
  apiUrl = `${environment.apiUrl}/aprobarSolicitudes`;
  apiUrl2= `${environment.apiUrl}/rechazarSolicitudes`;

  empleado = {
    fecha: '',
    tipoSolicitud: '',
    nombre: '',
    estadoSolicitud: ''
  };

  modalTitle: string = '';
  modalMessage: string = '';
  horaEntrada: string = '';
  horaSalida: string = '';
  @ViewChild('modalContent') modalContent: any;

  constructor(private http: HttpClient, private modalService: NgbModal) {}
  
  fecha: string = new Date().toLocaleString('es-HN', { 
    timeZone: 'America/Tegucigalpa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-');

  solicitudSeleccionada: any = null;
  mot_rechazo: string = '';

  ngOnInit() {
    this.obtenerTodasLasSolicitudes();
  }

  obtenerTodasLasSolicitudes() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (error) => {
      }
    });
  }
  openModal(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.modalTitle = solicitud.nom_tipo_solicitud;
    const modalRef = this.modalService.open(this.modalContent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
  }

  aprobarSolicitud() {
     
  }

  limpiarFormulario() {
    this.mot_rechazo = '';
  }

  getHoraCompleta(hora: string, periodo: string): string {
    return `${hora} ${periodo}`;
  }
}
