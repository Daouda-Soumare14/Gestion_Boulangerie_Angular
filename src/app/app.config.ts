import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideToastr({
      positionClass: 'toast-top-full-width',  // Position: top-right, bottom-left, etc.
      timeOut: 5000,                     // Durée d'affichage
      closeButton: true,                 // Bouton fermer
      progressBar: true,                 // Barre de progression
      tapToDismiss: true,                // Clic pour fermer
      toastClass: 'ngx-toastr custom-toast',
    }
    ),
    provideAnimations()
  ],
};


