import { Routes } from '@angular/router';
import { gameActiveGuard } from './guards/game-active.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'start',
    loadComponent: () =>
      import('./components/start-screen/start-screen').then(m => m.StartScreenComponent),
    canActivate: [authGuard],
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard, gameActiveGuard],
  },
  { path: '**', redirectTo: 'login' },
];
