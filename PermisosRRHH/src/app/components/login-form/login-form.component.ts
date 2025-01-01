import { Component } from '@angular/core';

@Component({
  selector: 'app-login-form',
  imports: [],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  togglePasswordVisibility() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    const showPasswordCheckbox = document.getElementById('show-password') as HTMLInputElement;
   
  }
}
