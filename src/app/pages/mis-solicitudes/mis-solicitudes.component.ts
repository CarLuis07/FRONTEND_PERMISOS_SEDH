import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudEmergencias: any[] = [];
  apiUrl = `${environment.apiUrl}/misSolicitudes`;
  apiUrl2 = `${environment.apiUrl}/misSolicitudesEmergencia`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerTodasLasSolicitudes();
  }

  obtenerTodasLasSolicitudes() {
    combineLatest([
      this.http.get<any[]>(this.apiUrl),
      this.http.get<any[]>(this.apiUrl2)
    ]).subscribe({
      next: ([solicitudes, emergencias]) => {
        this.solicitudes = solicitudes;
        this.solicitudEmergencias = emergencias;
        console.log('Solicitudes regulares:', solicitudes);
        console.log('Solicitudes emergencia:', emergencias);
      },
      error: (error) => {
        console.error('Error al obtener solicitudes:', error);
      }
    });
  }
}
