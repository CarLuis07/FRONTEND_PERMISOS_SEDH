import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesEmergencia: any[] = [];
  isActualizando = false;
  apiUrl = `${environment.apiUrl}/misSolicitudes`;
  apiUrl2 = `${environment.apiUrl}/misSolicitudesEmergencia`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes() {
    if (this.isActualizando) return;
    this.isActualizando = true;
    forkJoin([
      this.http.get<any[]>(this.apiUrl),
      this.http.get<any[]>(this.apiUrl2)
    ]).subscribe({
      next: ([solicitudes, emergencia]) => {
        this.solicitudes = solicitudes;
        this.solicitudesEmergencia = emergencia;
        this.isActualizando = false;
      },
      error: () => {
        this.solicitudes = [];
        this.solicitudesEmergencia = [];
        this.isActualizando = false;
      }
    });
  }

  actualizarSolicitudes() {
    this.cargarSolicitudes();
  }
}