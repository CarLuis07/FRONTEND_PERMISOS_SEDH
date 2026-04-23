import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reporte-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-empleados.component.html',
  styleUrl: './reporte-empleados.component.css'
})
export class ReporteEmpleadosComponent implements OnInit {
  reportes: any[] = [];
  apiUrl = `${environment.apiUrl}/reportePermisos`;
  mesBusqueda: number = new Date().getMonth() + 1;
  anioBusqueda: number = 2026;
  anios: number[] = [2026];
  nombresMeses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerReporte(this.mesBusqueda, this.anioBusqueda);
  }

  obtenerReporte(mes: number, anio: number) {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    this.http.get<any[]>(this.apiUrl, { params }).subscribe({
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
        console.error('Error al obtener reporte:', error);
      }
    });
  }

  buscarPorMes(): void {
    this.obtenerReporte(this.mesBusqueda, this.anioBusqueda);
  }
}