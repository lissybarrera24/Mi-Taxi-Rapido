# Tarea #2 — Registro de Cliente (Ionic + Angular Standalone)

Implementación de dos pantallas siguiendo las referencias: **Register** y **Verify Email**. Código para incorporar a tu proyecto Ionic Angular de tareas; no modifica ni reemplaza tu repositorio privado automáticamente.

## Requisitos previos

- Proyecto de Ionic **Angular Standalone** (Ionic 8/9 recomendado).
- Dependencias ya instaladas con `npm install`.
- CLI `@ionic/cli` para `ionic serve`.

Si no tienes proyecto: `ionic start mi-app blank --type angular` y elige **Standalone**.

## Pasos para integrar

1. En el directorio de tu repositorio de tareas:

   ```bash
   git checkout main
   git pull
   git switch -c tarea-2
   ```

   Si `tarea-2` ya existe, usa `git switch tarea-2` (no crees una duplicada).

2. Copia la carpeta `src/app/domain`, `src/app/application` y `src/app/presentation` del ZIP a las mismas rutas de tu proyecto. Si ya tienes una organización, integra los archivos respetándola.

3. Fusiona las rutas `register` y `verify-email` del archivo `src/app/app.routes.ts` con el **app.routes.ts existente**. No sobreescribas otras rutas importantes. Si quieres que registre al iniciar, usa el `redirectTo: 'register'` incluido.

4. Usa `ionic serve` y abre `/register`.

5. Cuando funcione, sube los cambios:

   ```bash
   git add src/app
   git commit -m "feat: registro y verificacion OTP con formularios reactivos"
   git push -u origin tarea-2
   ```

## Estructura de Clean Architecture (adaptada a una actividad pequeña)

```
src/app/
├── domain/
│   ├── models/user.interface.ts
│   └── validators/registration.validators.ts
├── application/
│   └── services/registration-flow.service.ts
├── presentation/
│   └── pages/
│       ├── register/
│       │   ├── register.page.ts
│       │   ├── register.page.html
│       │   └── register.page.scss
│       └── verify-email/
│           ├── verify-email.page.ts
│           ├── verify-email.page.html
│           └── verify-email.page.scss
└── app.routes.ts (ejemplo para fusionar)
```

## Validaciones implementadas

- Name: requerido y no puede contener solo espacios.
- Email: requerido y formato válido (`Validators.email`).
- Password: requerido, mínimo 6 caracteres, una minúscula, una mayúscula, un número y un carácter especial (no permite espacios).
- Phone: requerido, al menos 8 dígitos y solo números; tipo de dato `string` para preservar ceros iniciales.
- Terms: casilla obligatoria para coincidir con la pantalla proporcionada.
- OTP: requerido, exactamente 6 dígitos numéricos. Se impone mínimo 6 y patrón de exactamente 6.
- Getters para todos los controles y estados de error.
- `[ngClass]` aplica `border: 2px solid red` en inputs inválidos luego de tocar o modificar.
- Botones **Create a new account** y **Verify** deshabilitados hasta que el formulario sea válido.
- Código OTP se introduce con el teclado numérico en pantalla; con el campo enfocado también acepta números y borrado del teclado físico.

## Alcance técnico y seguridad

**Es una demostración de interfaz y validaciones**, no un registro real. El `RegistrationFlowService` conserva **solo el correo electrónico**, no guarda ni imprime contraseñas. No se generan códigos reales, ni se envían correos, ni se comprueba contra un servidor que el OTP sea auténtico. El botón **Verify** confirma únicamente que los seis dígitos tienen el formato correcto.

Para una aplicación de producción se requiere un servicio de autenticación en backend que cree las cuentas, envíe un OTP aleatorio y temporal, valide su vigencia y cantidad de intentos y confirme el correo. No implementes OTP únicamente en el frontend.

## Lista de pruebas para presentación

1. Registrar con todos los campos vacíos: botón deshabilitado.
2. Correo `prueba@`: error de formato y borde rojo.
3. Teléfono `8765abcd` y `1234567`: errores; `01234567`: válido.
4. Contraseña `abcdef`: error; `Aa1@bc`: válida.
5. Aceptar los términos y completar correctamente todo: botón habilitado.
6. Registrar: navega a `/verify-email` y muestra correo parcialmente oculto.
7. OTP con 5 cifras: botón inactivo; 6 cifras: activo.
8. Borrar una cifra: botón vuelve a deshabilitarse.
9. Botón Verify: mensaje aclarando que es una validación de formato sin servidor.

## Nota

Si tu proyecto usa `app-routing.module.ts` y módulos (`*.module.ts`) en vez de `app.routes.ts`, la integración debe adaptarse a esa arquitectura. Esta entrega está dirigida a **Angular Standalone**.
