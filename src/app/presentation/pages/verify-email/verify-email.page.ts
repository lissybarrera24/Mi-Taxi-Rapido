import { HttpErrorResponse } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';
import { RegistrationFlowService } from '../../../application/services/registration-flow.service';
import { OTP_PATTERN } from '../../../domain/validators/registration.validators';

const RESEND_COOLDOWN_SECONDS = 10;

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
  imports: [
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class VerifyEmailPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly registrationFlow = inject(RegistrationFlowService);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly cdr = inject(ChangeDetectorRef);

  isVerifying = false;
  isResending = false;
  resendSeconds = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly keypadRows: ReadonlyArray<ReadonlyArray<string>> = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  readonly verificationForm = this.formBuilder.nonNullable.group({
    token: ['', [Validators.required, Validators.minLength(6), Validators.pattern(OTP_PATTERN)]],
  });

  get tokenControl(): FormControl<string> { return this.verificationForm.controls.token; }
  get isTokenInvalid(): boolean { return this.shouldDisplayError(this.tokenControl); }
  get isTokenValid(): boolean { return this.tokenControl.valid && this.tokenControl.value.length > 0; }
  get maskedEmail(): string { return this.registrationFlow.maskedEmail; }

  get tokenError(): string | null {
    if (!this.isTokenInvalid) return null;
    if (this.tokenControl.hasError('required')) return 'The verification code is required.';
    if (this.tokenControl.hasError('pattern') && /\D/.test(this.tokenControl.value)) return 'Only numbers are allowed.';
    return 'Enter exactly 6 digits.';
  }

  ngOnInit(): void {
    this.startResendCooldown();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  appendDigit(digit: string): void {
    if (!/^\d$/.test(digit) || this.tokenControl.value.length >= 6) return;
    this.tokenControl.setValue(this.tokenControl.value + digit);
    this.tokenControl.markAsDirty();
  }

  removeLastDigit(): void {
    this.tokenControl.setValue(this.tokenControl.value.slice(0, -1));
    this.tokenControl.markAsDirty();
  }

  onOtpKeydown(event: KeyboardEvent): void {
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      this.appendDigit(event.key);
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.removeLastDigit();
    }
  }

  // Paso 2: verificar el OTP.
  verifyEmail(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }
    if (this.isVerifying) return;

    const email = this.registrationFlow.emailToVerify;
    if (!email) {
      void this.showToast('We lost your email. Please create your account again.', 'danger');
      void this.router.navigateByUrl('/register');
      return;
    }

    this.isVerifying = true;

    this.authService
      .verifyEmail({ email, code: this.tokenControl.value })
      .pipe(finalize(() => { this.isVerifying = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          void this.showToast('Email verified successfully!', 'success');
          void this.router.navigateByUrl('/login');
        },
        error: (error: HttpErrorResponse) => {
          void this.showToast(
            this.getErrorMessage(error, 'Invalid or expired code. You can request a new one.'),
            'danger',
          );
        },
      });
  }

  // Paso 3: reenviar el OTP.
  resendCode(): void {
    if (this.resendSeconds > 0 || this.isResending) return;

    const email = this.registrationFlow.emailToVerify;
    if (!email) {
      void this.showToast('We lost your email. Please create your account again.', 'danger');
      void this.router.navigateByUrl('/register');
      return;
    }

    this.isResending = true;

    this.authService
      .resendVerificationCode(email)
      .pipe(finalize(() => { this.isResending = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.tokenControl.reset('');
          this.startResendCooldown();
          void this.showToast('A new code was sent to your email.', 'success');
        },
        error: (error: HttpErrorResponse) => {
          void this.showToast(this.getErrorMessage(error, 'Could not resend the code. Please try again.'), 'danger');
        },
      });
  }

  private startResendCooldown(): void {
    this.stopTimer();
    this.resendSeconds = RESEND_COOLDOWN_SECONDS;
    this.timerId = setInterval(() => {
      this.resendSeconds -= 1;
      if (this.resendSeconds <= 0) this.stopTimer();
      this.cdr.markForCheck();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.resendSeconds = Math.max(this.resendSeconds, 0);
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({ message, duration: 3500, position: 'top', color });
    await toast.present();
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (error.status === 0) return 'Could not connect to the server. Check your internet connection.';
    const apiMessage = error.error?.message ?? error.error?.title;
    return typeof apiMessage === 'string' && apiMessage ? apiMessage : fallback;
  }

  private shouldDisplayError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
