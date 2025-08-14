import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token');

  if (token) {
    // Si le token existe, l'utilisateur est authentifié
    return true;
  } else {
    // Si le token n'existe pas, rediriger vers la page de connexion
    router.navigate(['login']);
    return false;
  }
};
