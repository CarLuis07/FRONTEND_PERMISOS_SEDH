import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const userRole = tokenData.role;

    // Verificar roles en la ruta actual
    if (route.data?.['roles'] && !route.data['roles'].includes(userRole)) {
      console.log('Acceso denegado en ruta actual');
      router.navigate(['/menu-principal']);
      return false;
    }

    // Verificar roles en la ruta padre si existe
    if (route.parent?.data?.['roles'] && !route.parent.data['roles'].includes(userRole)) {
      console.log('Acceso denegado en ruta padre');
      router.navigate(['/menu-principal']);
      return false;
    }


    return true;

  } catch (error) {
    console.error('Error al decodificar token:', error);
    router.navigate(['/']);
    return false;
  }
};