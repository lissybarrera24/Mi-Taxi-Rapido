import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClientProfileService } from '../../application/services/client-profile.service';

/** Protege la pantalla de perfil durante la sesión de demostración. */
export const sessionActiveGuard: CanActivateFn = () => {
  const session = inject(ClientProfileService);
  const router = inject(Router);
  return session.isAuthenticated ? true : router.createUrlTree(['/login']);
};
