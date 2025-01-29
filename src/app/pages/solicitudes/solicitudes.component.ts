import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})

export class SolicitudesComponent implements OnInit {
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
        console.error('Error al obtener solicitudes:', error);
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
    
  actualizarSolicitud(id: number, estado: string) {
    const token = localStorage.getItem('token');
    let userEmail = '';
      
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      userEmail = tokenData.sub;
    }
    
    const payload = {
      id_permiso: this.solicitudSeleccionada.id_permiso,
      tipo_permiso: this.solicitudSeleccionada.nom_tipo_solicitud,
      pri_aprobacion: userEmail,
      mot_rechazo: estado === 'RECHAZADO' ? this.mot_rechazo : null,
      hor_rechazadas: estado === 'RECHAZADO' && 
                     this.solicitudSeleccionada.nom_tipo_solicitud === 'PERMISO PERSONAL' ? 
                     this.solicitudSeleccionada.hor_solicitadas : '00:00'
    };
    
    const url = estado === 'RECHAZADO' ? this.apiUrl2 : this.apiUrl;
    
    this.http.put(url, payload).subscribe({
      next: (response) => {
        this.obtenerTodasLasSolicitudes();
        this.modalService.dismissAll();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  aprobarSolicitud() {
    this.actualizarSolicitud(this.solicitudSeleccionada.id, 'APROBADO');  
  }

  rechazarSolicitud() {
    if (!this.mot_rechazo.trim()) {
      alert('Debe ingresar el MOTIVO DE RECHAZO para no aprobar la solicitud.');
      return;
    }
    this.actualizarSolicitud(this.solicitudSeleccionada.id, 'RECHAZADO');
  }

  limpiarFormulario() {
    this.mot_rechazo = '';
  }
}
