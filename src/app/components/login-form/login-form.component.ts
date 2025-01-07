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
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  login() {
    console.log('Intentando iniciar sesión con:', this.username);
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/menu-principal']);
        } else {
          console.error('No se recibió token en la respuesta');
          this.showError = true;
          this.errorMessage = 'Error en la autenticación';
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      },
      (error) => {
        console.error('Error en login', error);
        this.showError = true;
        this.errorMessage = 'Usuario o contraseña incorrectos';
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    );
  }
}
