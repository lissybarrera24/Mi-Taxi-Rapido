import { PASSWORD_PATTERN, PHONE_PATTERN, OTP_PATTERN } from './registration.validators';

describe('Validaciones de Tarea #2', () => {
  it('acepta contraseñas con mínimo 6 caracteres y complejidad completa', () => {
    expect(PASSWORD_PATTERN.test('Aa1@bc')).toBeTrue();
    expect(PASSWORD_PATTERN.test('Hola2026#')).toBeTrue();
  });

  it('rechaza contraseñas incompletas', () => {
    expect(PASSWORD_PATTERN.test('Ab1!')).toBeFalse();
    expect(PASSWORD_PATTERN.test('abcdef1!')).toBeFalse();
    expect(PASSWORD_PATTERN.test('ABCDEF1!')).toBeFalse();
    expect(PASSWORD_PATTERN.test('Abcdef!')).toBeFalse();
    expect(PASSWORD_PATTERN.test('Abcdef1')).toBeFalse();
  });

  it('el teléfono acepta únicamente dígitos y permite ceros iniciales', () => {
    expect(PHONE_PATTERN.test('01234567')).toBeTrue();
    expect(PHONE_PATTERN.test('1234ABCD')).toBeFalse();
  });

  it('OTP exige exactamente 6 dígitos', () => {
    expect(OTP_PATTERN.test('324231')).toBeTrue();
    expect(OTP_PATTERN.test('32423')).toBeFalse();
    expect(OTP_PATTERN.test('3242317')).toBeFalse();
    expect(OTP_PATTERN.test('324-231')).toBeFalse();
  });
});
