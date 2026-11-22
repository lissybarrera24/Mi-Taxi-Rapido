import { Injectable } from '@angular/core';

export interface ClientProfile {
  fullName: string;
  identity: string;
  phone: string;
  email: string;
}

/**
 * Estado en memoria para la demostración académica.
 * No valida credenciales reales ni guarda contraseñas.
 */
@Injectable({ providedIn: 'root' })
export class ClientProfileService {
  private active = false;
  private currentProfile: ClientProfile = {
    fullName: 'Cliente Demo',
    identity: '0000000000000',
    phone: '99999999',
    email: 'demo@ejemplo.com',
  };

  get isAuthenticated(): boolean {
    return this.active;
  }

  get profile(): ClientProfile {
    return { ...this.currentProfile };
  }

  startDemoSession(email: string): void {
    this.active = true;
    this.currentProfile = { ...this.currentProfile, email: email.trim() };
  }

  saveProfile(profile: ClientProfile): void {
    this.currentProfile = {
      fullName: profile.fullName.trim(),
      identity: profile.identity.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
    };
  }

  closeSession(): void {
    this.active = false;
  }
}
