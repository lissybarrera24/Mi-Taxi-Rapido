import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let page: LoginPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('requiere correo válido y contraseña de al menos 6 caracteres', () => {
    expect(page.loginForm.invalid).toBe(true);
    page.loginForm.setValue({ email: 'correo-invalido', password: '123' });
    expect(page.loginForm.invalid).toBe(true);
    page.loginForm.setValue({ email: 'cliente@ejemplo.com', password: '123456' });
    expect(page.loginForm.valid).toBe(true);
  });

  it('muestra errores y toast sin loading con datos inválidos', () => {
    page.submitLogin();
    expect(page.isEmailInvalid).toBe(true);
    expect(page.isPasswordInvalid).toBe(true);
    expect(page.toastOpen).toBe(true);
    expect(page.isLoading).toBe(false);
  });

  it('activa IonLoading con datos válidos', () => {
    page.loginForm.setValue({ email: 'cliente@ejemplo.com', password: '123456' });
    page.submitLogin();
    expect(page.isLoading).toBe(true);
  });
});
