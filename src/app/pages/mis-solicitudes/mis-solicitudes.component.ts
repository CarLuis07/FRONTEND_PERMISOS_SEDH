import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit, OnDestroy {
  solicitudes: any[] = [];
  solicitudesEmergencia: any[] = [];
  apiUrl = `${environment.apiUrl}/misSolicitudes`;
  apiUrl2 = `${environment.apiUrl}/misSolicitudesEmergencia`;
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerTodasLasSolicitudes();
    this.obtenerSolicitudesEmergencia();
    this.iniciarActualizacionAutomatica();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  obtenerTodasLasSolicitudes() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (error) => {
        this.solicitudes = [];
      }
    });
  }

  obtenerSolicitudesEmergencia() {
    this.http.get<any[]>(this.apiUrl2).subscribe({
      next: (data) => {
        this.solicitudesEmergencia = data;
      },
      error: (error) => {
        this.solicitudesEmergencia = [];
      }
    });
  }

  iniciarActualizacionAutomatica() {
    this.intervalId = setInterval(() => {
      this.obtenerTodasLasSolicitudes();
      this.obtenerSolicitudesEmergencia();
    }, 10000);
  }
}