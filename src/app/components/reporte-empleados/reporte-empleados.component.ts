import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

interface DepGroup {
  nom_dependencia: string;
  totalEmpleados: number;
  totalPermisos: number;
  registros: any[];
}

@Component({
  selector: 'app-reporte-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './reporte-empleados.component.html',
  styleUrl: './reporte-empleados.component.css'
})
export class ReporteEmpleadosComponent implements OnInit {
  dependencias: DepGroup[] = [];
  depSeleccionada: DepGroup | null = null;

  apiUrl = `${environment.apiUrl}/reportePermisos`;
  mesBusqueda: number = new Date().getMonth() + 1;
  anioBusqueda: number = 2026;
  anios: number[] = [2026];
  nombresMeses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  @ViewChild('modalDetalle') modalDetalle: any;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit() {
    this.obtenerReporte(this.mesBusqueda, this.anioBusqueda);
  }

  obtenerReporte(mes: number, anio: number) {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    this.http.get<any[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        // Agrupar por dependencia
        const map = new Map<string, any[]>();
        for (const item of data) {
          if (!map.has(item.nom_dependencia)) {
            map.set(item.nom_dependencia, []);
          }
          map.get(item.nom_dependencia)!.push(item);
        }

        this.dependencias = Array.from(map.entries()).map(([nom, registros]) => ({
          nom_dependencia: nom,
          totalEmpleados: new Set(registros.map(r => r.empleado)).size,
          totalPermisos: registros.length,
          registros
        }));
      },
      error: (error) => {
        console.error('Error al obtener reporte:', error);
      }
    });
  }

  abrirModal(dep: DepGroup) {
    this.depSeleccionada = dep;
    this.modalService.open(this.modalDetalle, { size: 'xl', centered: true, scrollable: true });
  }

  buscarPorMes(): void {
    this.obtenerReporte(this.mesBusqueda, this.anioBusqueda);
  }
}