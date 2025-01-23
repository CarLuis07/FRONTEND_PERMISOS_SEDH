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
  solicitudesEmergencia: any[] = [];
  apiUrl = `${environment.apiUrl}/misSolicitudes`;
  apiUrl2 = `${environment.apiUrl}/misSolicitudesEmergencia`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerTodasLasSolicitudes();
    this.obtenerSolicitudesEmergencia();
  }

  obtenerTodasLasSolicitudes() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (error) => {
        console.error('Error:', error);
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
        console.error('Error:', error);
        this.solicitudesEmergencia = [];
      }
    });
  }
}