# Mi-Taxi-Rapido — Tarea #2: Registro de Cliente en 2 pasos

Proyecto **Ionic + Angular Standalone**. Esta rama reúne la base del proyecto `tarea-1` y las pantallas de registro y verificación OTP de `tarea-2`.

## Ejecutar

Se necesita una versión de Node.js compatible con Angular 22 y npm.

```bash
npm ci
npm start
```

La página de inicio está en `http://localhost:4200/register`.

Para comprobar el proyecto:

```bash
npm run build
npm run test:unit
```

## Funcionalidades

1. `/register`: nombres, correo, contraseña, número de teléfono y aceptación de términos.
   - Formularios reactivos, interfaz `User`, getters para errores, `[ngClass]` y deshabilitación del botón mientras haya campos inválidos.
   - Correo válido, contraseña de al menos seis caracteres con mayúscula, minúscula, número y carácter especial; teléfono de al menos ocho dígitos y solo numérico.
2. `/verify-email`: código OTP requerido de exactamente seis cifras, teclado numérico, getters, `[ngClass]` y botón Verify condicionado.
3. Se conservan las rutas `/home` y `/transactions` de la tarea anterior.

## Clean Architecture

- `src/app/domain/models/user.interface.ts`: interfaz de usuario.
- `src/app/domain/validators/`: validadores y pruebas.
- `src/app/application/services/registration-flow.service.ts`: paso de correo entre páginas.
- `src/app/presentation/pages/register/`: interfaz de registro.
- `src/app/presentation/pages/verify-email/`: interfaz OTP.

## Alcance

Es una **demostración académica del formulario**, sin backend. No se envían correos ni se crean cuentas reales. El botón Verify solo valida el **formato** de los seis dígitos; no comprueba un token enviado por email. La contraseña no se guarda en el servicio de estado del flujo.

## Notas de integración

El código de esta rama se basa en el proyecto Ionic Angular de `tarea-1`; su contenido fue recuperado sin editar esa rama. Solo cambian las rutas, las pruebas de validación y este README respecto al código de registro ya existente.

**Para confirmar que funcione con las dependencias del proyecto, hay que ejecutar una compilación y las pruebas.**
