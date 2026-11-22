import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
} from '@ionic/angular';
import { RegistrationFlowService } from '../../../application/services/registration-flow.service';
import { User } from '../../../domain/models/user.interface';
import { PASSWORD_PATTERN, PHONE_PATTERN } from '../../../domain/validators/registration.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    NgClass,
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
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly registrationFlow = inject(RegistrationFlowService);

  showPassword = false;

  readonly registrationForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(PASSWORD_PATTERN)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PHONE_PATTERN)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  // Getters descriptivos para acceder a controles y encapsular errores.
  get nameControl(): FormControl<string> { return this.registrationForm.controls.name; }
  get emailControl(): FormControl<string> { return this.registrationForm.controls.email; }
  get passwordControl(): FormControl<string> { return this.registrationForm.controls.password; }
  get phoneNumberControl(): FormControl<string> { return this.registrationForm.controls.phoneNumber; }
  get acceptTermsControl(): FormControl<boolean> { return this.registrationForm.controls.acceptTerms; }

  get isNameInvalid(): boolean { return this.shouldDisplayError(this.nameControl); }
  get isEmailInvalid(): boolean { return this.shouldDisplayError(this.emailControl); }
  get isPasswordInvalid(): boolean { return this.shouldDisplayError(this.passwordControl); }
  get isPhoneNumberInvalid(): boolean { return this.shouldDisplayError(this.phoneNumberControl); }
  get isAcceptTermsInvalid(): boolean { return this.shouldDisplayError(this.acceptTermsControl); }

  get nameError(): string | null {
    if (!this.isNameInvalid) return null;
    return this.nameControl.hasError('required') ? 'Name is required.' : 'Enter a valid name.';
  }

  get emailError(): string | null {
    if (!this.isEmailInvalid) return null;
    return this.emailControl.hasError('required') ? 'Email is required.' : 'Enter a valid email address.';
  }

  get passwordError(): string | null {
    if (!this.isPasswordInvalid) return null;
    if (this.passwordControl.hasError('required')) return 'Password is required.';
    if (this.passwordControl.hasError('minlength')) return 'Use at least 6 characters.';
    return 'Include uppercase, lowercase, number and special character; no spaces.';
  }

  get phoneNumberError(): string | null {
    if (!this.isPhoneNumberInvalid) return null;
    if (this.phoneNumberControl.hasError('required')) return 'Phone number is required.';
    if (this.phoneNumberControl.hasError('pattern')) return 'Enter numbers only.';
    return 'Use at least 8 digits.';
  }

  get termsError(): string | null {
    return this.isAcceptTermsInvalid ? 'You must accept the terms.' : null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  registerUser(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const formValues = this.registrationForm.getRawValue();
    const user: User = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
      phoneNumber: formValues.phoneNumber,
    };

    // Serialización usando la interfaz User. La demo NO envía datos a un servidor.
    this.registrationFlow.prepareEmailVerification(user);
    void this.router.navigateByUrl('/verify-email');
  }

  private shouldDisplayError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
