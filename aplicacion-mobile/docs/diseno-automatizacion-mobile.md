# Ejercicio C - Mobile Automation

## Flujo principal PickApp

La suite simula el flujo mobile solicitado para una app Flutter:

```text
Login -> Lista de Pedidos -> Seleccionar Pedido ->
Detalle de Productos -> Escanear Producto -> Confirmar Preparacion ->
Generar Guia de Envio
```

## C.1 Arquitectura del framework de automatizacion mobile

### Herramienta seleccionada

La herramienta elegida es Maestro Framework.

Justificacion:

- Tiene una sintaxis declarativa en YAML, facil de leer y mantener.
- Es adecuada para flujos end-to-end mobile sobre Android e iOS.
- Funciona bien con apps Flutter cuando la aplicacion expone textos, labels, semantic identifiers o ids estables.
- Permite ejecutar flujos completos de negocio sin escribir gran cantidad de codigo imperativo.
- Soporta reportes HTML/JUnit, tags, ejecucion por archivo y ejecucion sobre emuladores o dispositivos reales.

Para este reto se prefiere Maestro sobre Appium porque el objetivo es demostrar flujos funcionales de alto nivel con bajo costo de configuracion. Appium seria una alternativa solida si se requiere integracion mas profunda con WebDriver, grids de dispositivos o capacidades avanzadas por plataforma.

### Manejo de locators en Flutter vs apps nativas

En Flutter, los locators deben apoyarse en elementos estables expuestos por la app:

- `id`: recomendado para acciones criticas, por ejemplo `login_submit_button`.
- texto visible: util para validaciones de pantallas, por ejemplo `Lista de Pedidos`.
- labels semanticos: recomendados cuando el equipo Flutter usa `Semantics`.

Estrategia propuesta:

- Pedir al equipo mobile que agregue identificadores estables a widgets clave.
- Evitar locators por coordenadas porque son fragiles ante cambios de resolucion.
- Evitar depender solo de textos para botones criticos si la app sera localizada a varios idiomas.
- Usar textos para asserts de negocio visibles al usuario.

Ejemplos de locators usados en la suite:

```yaml
- tapOn:
    id: "login_username_input"
- assertVisible: "Lista de Pedidos"
- tapOn:
    id: "order_card_ORD-2025-007841"
```

### Configuracion de capabilities o equivalente

Maestro no usa capabilities estilo Appium. La configuracion equivalente se define por:

- `appId`: identificador de la app bajo prueba, en este caso `com.gapsi.pickapp`.
- `launchApp.clearState`: permite iniciar el escenario desde estado limpio.
- `--app`: instala o abre el APK/IPA antes de ejecutar el flujo.
- `--device`: permite apuntar a un emulador, simulador o dispositivo especifico.
- variables de entorno: permiten parametrizar usuarios, pedidos o codigos cuando se requiera.
- tags: permiten filtrar suites por tipo de prueba.

Ejemplo:

```bash
maestro test --app=apps/pickapp.apk --device=emulator-5554 flows/01-happy-path-generar-guia.yaml
```

## C.2 Suite de pruebas automatizadas

### Caso 1 - Happy path completo

Archivo: `flows/01-happy-path-generar-guia.yaml`

Objetivo:

Validar que un supervisor puede iniciar sesion, seleccionar un pedido, escanear un producto, confirmar la preparacion y generar la guia de envio.

Validaciones:

- Login exitoso.
- Lista de pedidos visible.
- Detalle del pedido visible.
- Producto escaneado correctamente.
- Preparacion confirmada.
- Guia de envio generada.

### Caso 2 - Manejo de scanner con entrada manual

Archivo: `flows/02-scanner-entrada-manual.yaml`

Objetivo:

Simular el escaneo de codigo de barras en emulador/simulador usando un campo de entrada manual.

Estrategia:

- En dispositivos reales se puede validar el scanner con camara fisica.
- En emuladores se recomienda tener un fallback tecnico de entrada manual o un modo QA para inyectar el codigo.
- El flujo ingresa `SKU-001-BC` en `manual_barcode_input` y confirma la lectura.

### Caso 3 - Login con credenciales invalidas

Archivo: `flows/03-login-credenciales-invalidas.yaml`

Objetivo:

Validar que la app no permite avanzar con usuario o contrasena incorrectos.

Validaciones:

- Mensaje `Usuario o contrasena incorrectos`.
- La lista de pedidos no debe estar visible.

### Caso 4 - Manejo de sincronizacion

Archivo: `flows/04-sincronizacion-red.yaml`

Objetivo:

Validar el comportamiento cuando la preparacion queda pendiente de sincronizacion y luego se sincroniza.

Estrategia:

- Simular modo offline con un control QA `simulate_offline_mode_button`.
- Confirmar preparacion.
- Validar estado `Preparacion pendiente de sincronizacion`.
- Simular reconexion con `simulate_online_mode_button`.
- Ejecutar sincronizacion pendiente.
- Validar estado `Preparacion sincronizada`.
- Generar guia de envio.

### Pruebas en diferentes resoluciones y dispositivos

Estrategia:

- Ejecutar smoke test en un emulador Android base, por ejemplo Pixel 5.
- Ejecutar regression en al menos dos tamanos: telefono compacto y telefono grande.
- Agregar iOS Simulator si el pipeline del producto soporta macOS.
- Evitar coordenadas absolutas para que la suite resista cambios de densidad y resolucion.
- Usar `scrollUntilVisible` cuando existan listas de pedidos o productos largas.

Comandos sugeridos:

```bash
maestro test --device=emulator-5554 flows/01-happy-path-generar-guia.yaml
maestro test --device=emulator-5556 flows/01-happy-path-generar-guia.yaml
```

## C.3 Fragmento de codigo

El codigo de la implementacion Maestro puede visualizarse en el repositorio:

https://github.com/desarrollojesusdorado/reto-gapsi/tree/main/aplicacion-mobile

Fragmento representativo del login e interaccion con Flutter:

```yaml
- launchApp:
    appId: com.gapsi.pickapp
    clearState: true

- tapOn:
    id: "login_username_input"
- inputText: "supervisor.pick"
- tapOn:
    id: "login_password_input"
- inputText: "PickApp123!"
- tapOn:
    id: "login_submit_button"

- assertVisible:
    id: "orders_list_screen"
- assertVisible: "Lista de Pedidos"
```

Este fragmento cubre la accion de login y al menos una interaccion con un elemento de la interfaz Flutter usando un identificador estable.
