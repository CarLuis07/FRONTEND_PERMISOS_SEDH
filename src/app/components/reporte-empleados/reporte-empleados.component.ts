import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reporte-empleados',
  imports: [CommonModule],
  templateUrl: './reporte-empleados.component.html',
  styleUrl: './reporte-empleados.component.css'
})
export class ReporteEmpleadosComponent implements OnInit, OnDestroy {
  reportes: any[] = [];
  apiUrl = `${environment.apiUrl}/reportePermisos`;
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerReporte();
    this.iniciarActualizacionAutomatica();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  obtenerReporte() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Procesar los datos para calcular rowspans
        let currentDep = '';
        let currentEmp = '';
        let rowspanDep = 0;
        let rowspanEmp = 0;
        
        // Primer paso: calcular rowspans
        this.reportes = data.map((item, index, array) => {
          if (item.nom_dependencia !== currentDep) {
            currentDep = item.nom_dependencia;
            rowspanDep = array.filter(x => x.nom_dependencia === currentDep).length;
            item.showDep = true;
            item.rowspanDep = rowspanDep;
          } else {
            item.showDep = false;
          }

          if (item.empleado !== currentEmp) {
            currentEmp = item.empleado;
            rowspanEmp = array.filter(x => 
              x.nom_dependencia === currentDep && 
              x.empleado === currentEmp
            ).length;
            item.showEmp = true;
            item.rowspanEmp = rowspanEmp;
            item.empleadoClass = 'empleado-' + (index % 2 === 0 ? 'par' : 'impar');
          } else {
            item.showEmp = false;
          }

          return item;
        });
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  iniciarActualizacionAutomatica() {
    this.intervalId = setInterval(() => {
      this.obtenerReporte();
    }, 10000);
  }
}