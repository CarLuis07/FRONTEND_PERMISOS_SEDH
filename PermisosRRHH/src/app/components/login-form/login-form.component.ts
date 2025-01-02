import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  login() {
    console.log('Intentando iniciar sesión con:', this.username);
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/menu-principal']);
      },
      (error) => {
        console.error('Error en login', error);
      }
    );
  }
}
