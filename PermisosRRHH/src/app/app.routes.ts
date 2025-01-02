import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MenuPrincipalComponent } from './pages/menu-principal/menu-principal.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent },
  { path: 'menu-principal', component: MenuPrincipalComponent },
  // Ruta comodín para redireccionar a login si la ruta no coincide
  { path: '**', redirectTo: '' }
];
