import { PASSWORD_PATTERN, PHONE_PATTERN, OTP_PATTERN } from './registration.validators';

describe('Validaciones de Tarea #2', () => {
  it('acepta contraseñas con mínimo seis caracteres y todos los requisitos', () => {
    expect(PASSWORD_PATTERN.test('Aa1@bc')).toBe(true);
    expect(PASSWORD_PATTERN.test('Hola2026#')).toBe(true);
  });

  it('rechaza contraseñas sin alguno de los requisitos', () => {
    expect(PASSWORD_PATTERN.test('Ab1!')).toBe(false);
    expect(PASSWORD_PATTERN.test('abcdef1!')).toBe(false);
    expect(PASSWORD_PATTERN.test('ABCDEF1!')).toBe(false);
    expect(PASSWORD_PATTERN.test('Abcdef!')).toBe(false);
    expect(PASSWORD_PATTERN.test('Abcdef1')).toBe(false);
    expect(PASSWORD_PATTERN.test('Ab 1!c')).toBe(false);
  });

  it('el teléfono solo admite números y permite ceros iniciales', () => {
    expect(PHONE_PATTERN.test('01234567')).toBe(true);
    expect(PHONE_PATTERN.test('1234ABCD')).toBe(false);
    expect(PHONE_PATTERN.test('12345678 ')).toBe(false);
  });

  it('el OTP exige exactamente seis dígitos', () => {
    expect(OTP_PATTERN.test('324231')).toBe(true);
    expect(OTP_PATTERN.test('32423')).toBe(false);
    expect(OTP_PATTERN.test('3242317')).toBe(false);
    expect(OTP_PATTERN.test('324-231')).toBe(false);
  });
});
