import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./timezone/timezone.component').then((m) => m.TimezoneComponent),
  },
];
