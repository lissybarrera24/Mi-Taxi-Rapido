import { NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonLoading, IonToast } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, cardOutline, logOutOutline, mailOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { ClientProfileService } from '../../../application/services/client-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [NgIf, ReactiveFormsModule, IonButton, IonContent, IonIcon, IonLoading, IonToast],
})
export class ProfilePage implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly profileService = inject(ClientProfileService);
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingSuccess = false;

  savedProfile = this.profileService.profile;
  readonly profileForm = this.fb.nonNullable.group({
    fullName: [this.savedProfile.fullName, [Validators.required, Validators.minLength(3), Validators.pattern(/.*\S.*/)]],
    identity: [this.savedProfile.identity, [Validators.required, Validators.pattern(/^\d{13}$/)]],
    phone: [this.savedProfile.phone, [Validators.required, Validators.pattern(/^\d{8}$/)]],
    email: [this.savedProfile.email, [Validators.required, Validators.email]],
  });
  isLoading = false;
  toastOpen = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  constructor() {
    addIcons({ personOutline, cardOutline, callOutline, mailOutline, logOutOutline, shieldCheckmarkOutline });
  }

  get nameControl() { return this.profileForm.controls.fullName; }
  get identityControl() { return this.profileForm.controls.identity; }
  get phoneControl() { return this.profileForm.controls.phone; }
  get emailControl() { return this.profileForm.controls.email; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }
  get identityInvalid(): boolean { return this.identityControl.invalid && this.identityControl.touched; }
  get phoneInvalid(): boolean { return this.phoneControl.invalid && this.phoneControl.touched; }
  get emailInvalid(): boolean { return this.emailControl.invalid && this.emailControl.touched; }

  get initials(): string {
    return this.savedProfile.fullName.trim().split(/\s+/).slice(0, 2)
      .map(word => word.charAt(0).toUpperCase()).join('');
  }

  get nameError(): string {
    return this.nameControl.hasError('required') || this.nameControl.hasError('pattern')
      ? 'Ingrese su nombre completo.' : 'Mínimo 3 caracteres.';
  }
  get identityError(): string { return 'La identidad debe tener 13 dígitos.'; }
  get phoneError(): string { return 'El teléfono debe tener 8 dígitos.'; }
  get emailError(): string {
    return this.emailControl.hasError('required')
      ? 'El correo electrónico es obligatorio.' : 'Correo inválido.';
  }

  notifyInvalid(): void {
    if (this.isLoading || this.profileForm.valid) return;
    this.profileForm.markAllAsTouched();
    this.showToast('Por favor, corrige los campos marcados en rojo', 'danger');
  }

  saveProfile(): void {
    if (this.isLoading) return;
    if (this.profileForm.invalid) {
      this.notifyInvalid();
      return;
    }
    this.isLoading = true;
    this.pendingTimer = setTimeout(() => {
      this.profileService.saveProfile(this.profileForm.getRawValue());
      this.savedProfile = this.profileService.profile;
      this.pendingSuccess = true;
      this.isLoading = false;
      this.pendingTimer = null;
    }, 1700);
  }

  onLoadingDismissed(): void {
    if (!this.pendingSuccess) return;
    this.pendingSuccess = false;
    this.showToast('Perfil Guardado', 'success');
  }

  onToastDismissed(): void {
    this.toastOpen = false;
  }

  logout(): void {
    if (this.isLoading) return;
    this.profileService.closeSession();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private showToast(message: string, color: 'success' | 'danger'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
  }

  ngOnDestroy(): void {
    if (this.pendingTimer !== null) clearTimeout(this.pendingTimer);
  }
}
