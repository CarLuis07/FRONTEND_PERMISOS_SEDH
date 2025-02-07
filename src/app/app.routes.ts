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
import { ResponderSolicitudesAgenteSeguridadComponent } from './pages/responder-solicitudes-agente-seguridad/responder-solicitudes-agente-seguridad.component';
import { AdministracionSistemaRrhhComponent } from './pages/administracion-sistema-rrhh/administracion-sistema-rrhh.component';
import { ADMINISTRACION_ROUTES } from './pages/administracion-sistema-rrhh/administracion-sistema-rrhh-routes';


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
      data: { roles: [2, 3] } //  roles jefeInmediato y jefe RRHH
    },
    { 
      path: 'responder-solicitudes-jefe-rrhh', 
      component: ResponderSolicitudesJefeRrhhComponent,
      data: { roles: [3] } // solo rol jefe RRHH
    },
    { 
      path: 'responder-solicitudes-agente-seguridad', 
      component: ResponderSolicitudesAgenteSeguridadComponent,
      data: { roles: [4] } // solo rol agente de seguridad
    },
    { 
      path: 'administracion-sistema-rrhh', 
      component: AdministracionSistemaRrhhComponent,
      data: { roles: [5] }, // solo rol agente de asistente de RRHH
      children: ADMINISTRACION_ROUTES
    },
    
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
