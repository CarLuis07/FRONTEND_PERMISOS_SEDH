import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/token`;
  
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post<any>(this.apiUrl, formData);
  }
  
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000);
    const now = new Date();

    if (now > expirationDate) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}