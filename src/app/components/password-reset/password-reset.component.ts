import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Asegúrate de importar CommonModule y FormsModule aquí
})
export class PasswordResetComponent {
  apiUrl = `${environment.apiUrl}/change-password`;
  email: string = ''; 
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    if (!this.email || !this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las nuevas contraseñas no coinciden';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('email', this.email); 
    formData.append('currentPassword', this.currentPassword);
    formData.append('newPassword', this.newPassword);

    this.http.post<any>(this.apiUrl, formData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.error('Error en reset password', error);
          this.errorMessage = 'Error al cambiar la contraseña';
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      });
  }
}
