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
        console.log('Datos recibidos:', data); // Agregar log
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
      this.http.put(`${this.apiUrl}/${id}`, { estado }).subscribe({
        next: (response) => {
          this.obtenerTodasLasSolicitudes();
          this.modalService.dismissAll();
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

}
