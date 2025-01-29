import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  apiUrl = `${environment.apiUrl}/token`;
  username: string = '';
  password: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
 
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña son requeridos';
      return;
    }
    
    this.loading = true;
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);

    this.http.post<any>(this.apiUrl, formData)
      .subscribe({
        next: (response) => {
          this.loading = false;
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
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log('Error completo:', error);
          console.log('Estado:', error.status);
          console.log('Mensaje:', error.error);
          
            if (error.status === 422 || error.status === 401) {
            this.errorMessage = 'Credenciales inválidas Intente de nuevo';
          }
          console.error('Error en login', error);
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      });
  }
}
