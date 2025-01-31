import { Routes } from '@angular/router';
import { PerfilEmpleadoComponent } from '../../components/perfil-empleado/perfil-empleado.component';
import { AgregarEmpleadoComponent } from '../../components/agregar-empleado/agregar-empleado.component';
import { ReporteEmpleadosComponent } from '../../components/reporte-empleados/reporte-empleados.component';
import { SolicitudesPendientesComponent } from '../../components/solicitudes-pendientes/solicitudes-pendientes.component';

export const ADMINISTRACION_ROUTES: Routes = [
  {
    path: 'perfil-empleado',
    component: PerfilEmpleadoComponent
  },
  {
    path: 'agregar-empleado',
    component: AgregarEmpleadoComponent
  },
  {
    path: 'reporte-empleados',
    component: ReporteEmpleadosComponent
  },
  {
    path: 'solicitudes-pendientes',
    component: SolicitudesPendientesComponent
  }
];