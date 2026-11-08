import { Routes } from '@angular/router';

/** Rutas de ejemplo: fusiona estas entradas con las rutas existentes de tu app. */
export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('./presentation/pages/register/register.page').then((page) => page.RegisterPage),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./presentation/pages/verify-email/verify-email.page').then((page) => page.VerifyEmailPage),
  },
  { path: '**', redirectTo: 'register' },
];
