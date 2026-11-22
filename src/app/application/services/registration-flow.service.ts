import { Injectable } from '@angular/core';
import { User } from '../../domain/models/user.interface';

/**
 * Estado mínimo del flujo entre pantallas. No almacena contraseñas ni
 * simula peticiones a servidores de autenticación.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationFlowService {
  private pendingEmailAddress: string | null = null;

  prepareEmailVerification(user: User): void {
    // Aquí se podrá integrar posteriormente el caso de uso / API de registro.
    this.pendingEmailAddress = user.email;
  }

  get emailToVerify(): string | null {
    return this.pendingEmailAddress;
  }

  get maskedEmail(): string {
    const email = this.pendingEmailAddress;
    if (!email) return 'your email address';

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const firstCharacter = localPart.charAt(0);
    const lastCharacter = localPart.length > 1 ? localPart.charAt(localPart.length - 1) : '';
    const hiddenCharacters = '*'.repeat(Math.max(1, localPart.length - 2));
    return `${firstCharacter}${hiddenCharacters}${lastCharacter}@${domain}`;
  }
}
