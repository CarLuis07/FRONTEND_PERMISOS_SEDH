import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MenuPrincipalComponent } from './pages/menu-principal/menu-principal.component';
import { PermisoPersonalComponent } from './pages/permiso-personal/permiso-personal.component';
import { PermisoOficialComponent } from './pages/permiso-oficial/permiso-oficial.component';
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { MisSolicitudesComponent } from './pages/mis-solicitudes/mis-solicitudes.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { authGuard } from './services/auth.guard';
import { ResponderSolicitudesJefeRrhhComponent } from './pages/responder-solicitudes-jefe-rrhh/responder-solicitudes-jefe-rrhh.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent },
  { path: 'menu-principal', component: MenuPrincipalComponent,
    canActivate: [authGuard], children: [
    { path: 'permiso-personal', component: PermisoPersonalComponent },
    { path: 'permiso-oficial', component: PermisoOficialComponent },
    { path: 'vacaciones', component: VacacionesComponent },
    { path: 'mis-solicitudes', component: MisSolicitudesComponent },
    { 
      path: 'solicitudes', 
      component: SolicitudesComponent,
      data: { roles: [2] } // roles jefeInmediato a RRHH
    },
    { 
      path: 'responder-solicitudes-jefe-rrhh', 
      component: ResponderSolicitudesJefeRrhhComponent,
      data: { roles: [3] } // solo rol RRHH
    }
  ]},
  // Ruta comodín para redireccionar a login si la ruta no coincide
  { path: '**', redirectTo: '' },
  {
    path: 'menu',
    component: MenuPrincipalComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'permiso-personal',
        component: PermisoPersonalComponent,
        canActivate: [authGuard]
      },
    ]
  }
];
