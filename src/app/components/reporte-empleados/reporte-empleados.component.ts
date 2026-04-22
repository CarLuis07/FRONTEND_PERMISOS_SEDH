import { Component, OnInit, OnDestroy } from '@angular/core';
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
    // Iniciar con el mes actual
    const mesActual = new Date().getMonth() + 1; // getMonth() devuelve 0-11
    this.obtenerReporte(mesActual);
    this.iniciarActualizacionAutomatica();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  obtenerReporte(mes?: number) {
    // Crear un objeto HttpParams para enviar el parámetro mes de forma segura
    let params = new HttpParams();
    
    // Si se proporciona un mes específico, usarlo
    if (mes && mes >= 1 && mes <= 12) {
      params = params.set('Mes', mes.toString());
    } else {
      // Si no se especifica mes o es inválido, usar el mes actual
      const mesActual = new Date().getMonth() + 1;
      params = params.set('Mes', mesActual.toString());
    }

    // Usar HttpParams en la petición
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
    
    // Si hay un mes válido seleccionado, usarlo para la búsqueda
    if (this.mesBusqueda && this.mesBusqueda >= 1 && this.mesBusqueda <= 12) {
      this.obtenerReporte(this.mesBusqueda);
    } else {
      // Si no hay mes seleccionado o es inválido, usar el mes actual
      const mesActual = new Date().getMonth() + 1;
      this.obtenerReporte(mesActual);
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
      if (this.mesBusqueda && this.mesBusqueda >= 1 && this.mesBusqueda <= 12) {
        this.obtenerReporte(this.mesBusqueda);
      } else {
        const mesActual = new Date().getMonth() + 1;
        this.obtenerReporte(mesActual);
      }
    }, 10000);
  }
}