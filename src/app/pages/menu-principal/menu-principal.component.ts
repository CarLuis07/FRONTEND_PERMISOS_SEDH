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
  userRole: number = 1;

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      this.userRole = tokenData.role;
    }
  }

  logout() {
    // Eliminar token
    localStorage.removeItem('token');
    
    // Redireccionar a la ruta raíz
    this.router.navigate(['/']);
  }
}
