import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {provideNgxWebstorage, withLocalStorage} from 'ngx-webstorage';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config'
// import { ConfirmationService, MessageService } from 'primeng/api';
import Material from '@primeng/themes/material';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // HTTPClient (HTTP requests)
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.    
      // https://angular.dev/guide/http/interceptors
      withInterceptorsFromDi(),
    ),
    // Inject interceptor.
    /*{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // Here we inject (set up) modules and services we'll use globally in our application.
    MessageService,*/
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material,
        options: {
          darkModeSelector: false,
        },
      }
    }),
    // ngx-webstorage
    provideNgxWebstorage(
      withLocalStorage()
    ),
    // ConfirmationService,
  ]  
    
};
