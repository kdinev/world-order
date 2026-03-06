import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const gameActiveGuard: CanActivateFn = () => {
  const game = inject(GameService);
  const router = inject(Router);
  if (!game.isStarted()) {
    return router.createUrlTree(['/start']);
  }
  return true;
};
