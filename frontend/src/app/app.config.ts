import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { API_URL } from './core/tokens';
import { environment } from './environments/environment'
import { routes } from './app.routes';
import { Chart, registerables } from 'chart.js';
import { provideHttpClient } from '@angular/common/http';
Chart.register(...registerables);
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_URL, useValue: environment.apiUrl },
  ]
};
