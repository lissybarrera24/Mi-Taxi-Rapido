/** 6 caracteres o más; minúscula, mayúscula, número y símbolo; sin espacios. */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{6,}$/;

/** Teléfono: ocho dígitos como mínimo y solamente números. */
export const PHONE_PATTERN = /^\d+$/;

/** OTP: exactamente seis dígitos numéricos. */
export const OTP_PATTERN = /^\d{6}$/;
