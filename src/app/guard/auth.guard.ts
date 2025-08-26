import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('auth_token');

  if (token) {
    return true;
  } else {
    // Stocke l'URL demandée pour redirection après login
    localStorage.setItem('redirectUrl', state.url);
    
     const modal = document.getElementById('authModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
    return false;
  }
};
