# Diseno de automatizacion - Web UI

## Alcance

Automatizar la pantalla de login del Centro de Control presentada en el reto Web UI.

La aplicacion se simula localmente en `aplicacion-web/app` para que la suite pueda ejecutarse sin depender de un sistema Angular real. La pantalla mantiene los elementos solicitados:

- Titulo `Centro de Control - Login`.
- Campo `Usuario`.
- Campo `Contrasena`.
- Boton `Entrar`.
- Enlace `¿Olvidaste tu contrasena?`.
- Landing page posterior al login exitoso.

## Herramienta y lenguaje

- Framework: Playwright Test.
- Lenguaje: TypeScript.
- Patron: Page Object Model.
- Navegador del CI: Chromium.
- Servidor local: script Node.js `scripts/staticServer.js`.

Playwright es adecuado porque permite pruebas end-to-end rapidas, selectores accesibles, auto-waiting, trazas en fallos, screenshots y reporte HTML.

## Arquitectura de pruebas

- `app/`: aplicacion web simulada.
- `src/pages/ControlCenterLoginPage.ts`: Page Object del login y landing.
- `src/fixtures/login.fixtures.ts`: credenciales validas, invalidas y casos de validacion.
- `tests/ui/controlCenterLogin.spec.ts`: suite de pruebas Web UI.
- `src/server/controlCenterServer.ts`: servidor local usado por las pruebas.
- `tests/fixtures/webTest.ts`: fixture que levanta la aplicacion simulada en un puerto dinamico.
- `playwright.config.ts`: configuracion del runner, navegador y reporte.

## Casos a automatizar

### Happy path

Objetivo: validar login exitoso y llegada al landing page.

Pasos:

1. Abrir la pantalla del Centro de Control.
2. Verificar que el formulario de login esta visible.
3. Ingresar usuario `admin`.
4. Ingresar contrasena `Admin123!`.
5. Hacer clic en `Entrar`.
6. Validar que aparece `Panel de Control`.
7. Validar mensaje de bienvenida e indicadores principales.

Resultado esperado:

- El formulario de login se oculta.
- La landing page se muestra.
- Se visualiza `Bienvenido, supervisor de operaciones.`.

### Credenciales invalidas

Escenarios:

1. Usuario incorrecto y contrasena correcta.
2. Usuario correcto y contrasena incorrecta.
3. Usuario y contrasena incorrectos.

Resultado esperado:

- El usuario permanece en el login.
- Se muestra el mensaje `Usuario o contrasena incorrectos.`.
- No se muestra la landing page.

### Validaciones de campos

Escenarios:

1. Usuario y contrasena vacios.
2. Caracteres especiales no permitidos.
3. Longitud maxima excedida.

Resultado esperado:

- Campos vacios: `Usuario y contrasena son obligatorios.`
- Caracteres no permitidos: `Usuario y contrasena contienen caracteres no permitidos.`
- Longitud excedida: `Usuario y contrasena no deben superar 20 caracteres.`

## Resiliencia de selectores

Estrategia recomendada:

- Usar `data-testid` para elementos criticos del flujo: campos, botones, mensajes y contenedores.
- Usar selectores accesibles como `getByRole` cuando el nombre visible representa una accion estable, por ejemplo el boton `Entrar`.
- Evitar selectores CSS fragiles como clases visuales, posicion en DOM o XPath absoluto.

Justificacion:

- Los IDs tecnicos o `data-testid` cambian menos que el diseno visual.
- Los roles accesibles verifican comportamiento desde la perspectiva del usuario.
- Las clases CSS suelen cambiar por ajustes de estilo y no deberian romper pruebas funcionales.

## Ejemplo de codigo happy path

```ts
test('happy path: login exitoso y verificacion de landing page', async ({
  page
}) => {
  const loginPage = new ControlCenterLoginPage(page);

  await loginPage.goto();
  await loginPage.expectLoginFormVisible();
  await loginPage.login(validCredentials.username, validCredentials.password);

  await loginPage.expectLandingPageVisible();
});
```

## Comandos

Instalar dependencias desde la raiz del monorepo:

```bash
npm install
```

Ejecutar solo el reto Web:

```bash
npm run test:web
```

Ejecutar validacion completa del reto Web:

```bash
npm run ci -w aplicacion-web
```
