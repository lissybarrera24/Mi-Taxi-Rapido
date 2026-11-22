import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let page: ProfilePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();
    fixture = TestBed.createComponent(ProfilePage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('valida identidad, teléfono y correo', () => {
    expect(page.profileForm.valid).toBe(true);
    page.identityControl.setValue('1234');
    page.phoneControl.setValue('abc');
    page.emailControl.setValue('sin-arroba');
    expect(page.profileForm.invalid).toBe(true);
  });

  it('marca los campos y notifica antes de guardar', () => {
    page.emailControl.setValue('correo-incorrecto');
    page.saveProfile();
    expect(page.emailInvalid).toBe(true);
    expect(page.toastOpen).toBe(true);
    expect(page.isLoading).toBe(false);
  });

  it('activa IonLoading con datos válidos', () => {
    page.saveProfile();
    expect(page.isLoading).toBe(true);
  });
});
