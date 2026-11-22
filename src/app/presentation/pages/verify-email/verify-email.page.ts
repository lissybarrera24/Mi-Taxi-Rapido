import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { RegistrationFlowService } from '../../../application/services/registration-flow.service';
import { OTP_PATTERN } from '../../../domain/validators/registration.validators';

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
export class VerifyEmailPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly registrationFlow = inject(RegistrationFlowService);

  showDemoNotice = false;
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

  appendDigit(digit: string): void {
    if (!/^\d$/.test(digit) || this.tokenControl.value.length >= 6) return;
    this.tokenControl.setValue(this.tokenControl.value + digit);
    this.tokenControl.markAsDirty();
    this.showDemoNotice = false;
  }

  removeLastDigit(): void {
    this.tokenControl.setValue(this.tokenControl.value.slice(0, -1));
    this.tokenControl.markAsDirty();
    this.showDemoNotice = false;
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

  verifyEmail(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }
    // Sin API real, únicamente demostramos la validez del formato.
    this.showDemoNotice = true;
  }

  private shouldDisplayError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
