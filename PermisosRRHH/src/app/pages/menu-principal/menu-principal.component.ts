import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {
  constructor(private router: Router) {}

  logout() {
    // Eliminar token
    localStorage.removeItem('token');
    
    // Redireccionar a la ruta raíz
    this.router.navigate(['/']);
  }
}
