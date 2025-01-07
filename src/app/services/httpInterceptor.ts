import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  
  if (token) {
    if (!authService.isTokenValid()) {
      authService.logout();
      return next(req);
    }
  
    const modifiedReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
    });
    return next(modifiedReq);
  }
  
  return next(req);
};