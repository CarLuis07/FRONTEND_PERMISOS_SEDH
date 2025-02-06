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
        let rowspanDep = 1;
        let rowspanEmp = 1;
        let employeeCount = 0;
        
        this.reportes = data.map((item, index) => {
          if (index > 0) {
            if (item.nom_dependencia === data[index - 1].nom_dependencia) {
              item.showDep = false;
              data[index - 1].rowspanDep = rowspanDep += 1;
            } else {
              rowspanDep = 1;
              item.showDep = true;
            }
            
            if (item.empleado === data[index - 1].empleado) {
              item.showEmp = false;
              data[index - 1].rowspanEmp = rowspanEmp += 1;
              item.empleadoClass = data[index - 1].empleadoClass;
            } else {
              rowspanEmp = 1;
              item.showEmp = true;
              employeeCount++;
              item.empleadoClass = employeeCount % 2 === 0 ? 'empleado-par' : 'empleado-impar';
            }
          } else {
            item.showDep = true;
            item.showEmp = true;
            item.empleadoClass = 'empleado-impar';
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