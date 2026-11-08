import type { Routes } from '@angular/router';

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
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((page) => page.HomePage),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./transactions/pages/transactions/transactions.page').then((page) => page.TransactionsPage),
  },
  { path: '**', redirectTo: 'register' },
];
