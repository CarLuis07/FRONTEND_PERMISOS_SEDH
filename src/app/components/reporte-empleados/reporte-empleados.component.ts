import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reporte-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-empleados.component.html',
  styleUrl: './reporte-empleados.component.css'
})
export class ReporteEmpleadosComponent implements OnInit, OnDestroy {
  reportes: any[] = [];
  apiUrl = `${environment.apiUrl}/reportePermisos`;
  intervalId: any;
  mesBusqueda: number | null = null;
  esMesValido: boolean = true;
  nombresMeses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

  obtenerReporte(mes?: number) {
    let url = this.apiUrl;
    
    // Si se proporciona un mes, añadir como parámetro de consulta
    if (mes) {
      url += `?mes=${mes}`;
    }

    this.http.get<any[]>(url).subscribe({
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

  validarMes(): void {
    if (this.mesBusqueda === null) {
      this.esMesValido = true;
      return;
    }
    
    this.esMesValido = this.mesBusqueda >= 1 && this.mesBusqueda <= 12;
  }

  buscarPorMes(): void {
    if (!this.esMesValido) {
      return;
    }
    
    // Detener la actualización automática durante la búsqueda
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Si no hay mes o es 0, obtener todos los reportes
    if (!this.mesBusqueda) {
      this.obtenerReporte();
    } else {
      // Obtener reportes por mes
      this.obtenerReporte(this.mesBusqueda);
    }
    
    // Reiniciar la actualización automática después de la búsqueda
    this.iniciarActualizacionAutomatica();
  }

  iniciarActualizacionAutomatica() {
    // Solo iniciar actualización si no hay una búsqueda por mes activa
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      if (!this.mesBusqueda) {
        this.obtenerReporte();
      } else {
        this.obtenerReporte(this.mesBusqueda);
      }
    }, 10000);
  }
}