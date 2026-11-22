import { NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonLoading, IonToast } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { ClientProfileService } from '../../../application/services/client-profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [NgIf, ReactiveFormsModule, RouterLink, IonButton, IonContent, IonIcon, IonLoading, IonToast],
})
export class LoginPage implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly clientProfile = inject(ClientProfileService);
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingSuccess = false;
  private navigateAfterToast = false;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = false;
  isLoading = false;
  toastOpen = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' | 'medium' = 'danger';

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  get emailControl() { return this.loginForm.controls.email; }
  get passwordControl() { return this.loginForm.controls.password; }
  get isEmailInvalid(): boolean { return this.emailControl.invalid && this.emailControl.touched; }
  get isPasswordInvalid(): boolean { return this.passwordControl.invalid && this.passwordControl.touched; }

  get emailError(): string {
    return this.emailControl.hasError('required')
      ? 'El correo electrónico es obligatorio.'
      : 'Correo inválido.';
  }

  get passwordError(): string {
    return this.passwordControl.hasError('required')
      ? 'La contraseña es obligatoria.'
      : 'Mínimo 6 caracteres.';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  notifyInvalid(): void {
    if (this.isLoading || this.loginForm.valid) return;
    this.loginForm.markAllAsTouched();
    this.showToast('Por favor, corrige los campos marcados en rojo', 'danger');
  }

  submitLogin(): void {
    if (this.isLoading) return;
    if (this.loginForm.invalid) {
      this.notifyInvalid();
      return;
    }
    this.isLoading = true;
    this.pendingTimer = setTimeout(() => {
      this.clientProfile.startDemoSession(this.emailControl.value);
      this.pendingSuccess = true;
      this.isLoading = false;
      this.pendingTimer = null;
    }, 1700);
  }

  onLoadingDismissed(): void {
    if (!this.pendingSuccess) return;
    this.pendingSuccess = false;
    this.navigateAfterToast = true;
    this.showToast('¡Bienvenido!', 'success');
  }

  onToastDismissed(): void {
    this.toastOpen = false;
    if (this.navigateAfterToast) {
      this.navigateAfterToast = false;
      void this.router.navigateByUrl('/profile', { replaceUrl: true });
    }
  }

  forgotPassword(): void {
    this.showToast('Recuperación no disponible en esta demostración.', 'medium');
  }

  private showToast(message: string, color: 'success' | 'danger' | 'medium'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
  }

  ngOnDestroy(): void {
    if (this.pendingTimer !== null) clearTimeout(this.pendingTimer);
  }
}
