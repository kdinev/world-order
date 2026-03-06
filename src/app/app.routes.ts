import { Routes } from '@angular/router';
import { gameActiveGuard } from './guards/game-active.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadComponent: () =>
      import('./components/start-screen/start-screen').then(m => m.StartScreenComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [gameActiveGuard],
  },
  { path: '**', redirectTo: 'start' },
];
