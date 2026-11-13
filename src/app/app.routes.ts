import type { Routes } from '@angular/router';
import { sessionActiveGuard } from './shared/guards/session-active.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./presentation/pages/login/login.page').then(p => p.LoginPage),
  },
  {
    path: 'profile',
    canActivate: [sessionActiveGuard],
    loadComponent: () => import('./presentation/pages/profile/profile.page').then(p => p.ProfilePage),
  },
  {
    path: 'register',
    loadComponent: () => import('./presentation/pages/register/register.page').then(p => p.RegisterPage),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./presentation/pages/verify-email/verify-email.page').then(p => p.VerifyEmailPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(p => p.HomePage),
  },
  {
    path: 'transactions',
    loadComponent: () => import('./transactions/pages/transactions/transactions.page').then(p => p.TransactionsPage),
  },
  { path: '**', redirectTo: 'login' },
];
