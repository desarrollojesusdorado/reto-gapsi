# Reto Gapsi - Monorepo Playwright

Este repositorio contiene tres retos de automatizacion:

- `aplicacion-api`: automatizacion del endpoint de asignacion de pedidos.
- `aplicacion-web`: automatizacion Web UI del login del Centro de Control.
- `aplicacion-mobile`: automatizacion mobile PickApp con Maestro Framework.

## Clonar el repositorio

```bash
git clone https://github.com/desarrollojesusdorado/reto-gapsi.git
cd reto-gapsi
```

## Ejecutar pruebas API

```bash
cd aplicacion-api
npm install
npm run ci
```

El comando `npm run ci` ejecuta:

- validacion TypeScript con `npm run typecheck`
- pruebas API con `npm run test:ci`

## Ejecutar pruebas Web UI

```bash
cd aplicacion-web
npm install
npx playwright install chromium
npm run ci
```

El comando `npm run ci` ejecuta:

- validacion TypeScript con `npm run typecheck`
- pruebas Web UI con `npm run test:ci`

## Ejecutar pruebas Mobile

```bash
cd aplicacion-mobile
maestro test .
```

En PowerShell se recomienda desactivar analiticas de Maestro para evitar bloqueos por red:

```powershell
$env:MAESTRO_CLI_NO_ANALYTICS="true"
maestro test .
```

Ejecutar un flujo especifico:

```bash
maestro test flows/01-happy-path-generar-guia.yaml
```

Generar reporte HTML:

```bash
maestro test . --format=html --output=reports/mobile-report.html
```

## Documentacion de diseno

- API: `aplicacion-api/docs/diseno-automatizacion-api.md`
- Web UI: `aplicacion-web/docs/diseno-automatizacion-web.md`
- Mobile: `aplicacion-mobile/docs/diseno-automatizacion-mobile.md`

## Estrategia CI/CD

Los workflows estan en `.github/workflows`:

- `api-ci-cd.yml`: ejecuta el pipeline del reto API.
- `web-ci-cd.yml`: ejecuta el pipeline del reto Web UI.

El reto mobile queda preparado para ejecucion local o en un runner con emulador/dispositivo y Maestro instalado. La estrategia mobile esta documentada en `aplicacion-mobile/docs/diseno-automatizacion-mobile.md`.

Cada workflow se dispara en:

- `push` hacia `main` o `master`
- `pull_request` hacia `main` o `master`
- ejecucion manual con `workflow_dispatch`

Cada pipeline realiza:

- checkout del repositorio
- configuracion de Node.js 20
- instalacion con `npm ci`
- validacion TypeScript
- ejecucion de pruebas Playwright
- carga del reporte HTML como artifact
- publicacion del reporte en GitHub Pages cuando aplica

## Reportes en GitHub Pages

La publicacion usa la rama `gh-pages` y separa los reportes por carpeta:

- API: `/api`
- Web UI: `/web`

Para habilitarlo en GitHub:

1. Ir a `Settings > Pages`.
2. Seleccionar `Deploy from a branch`.
3. Elegir la rama `gh-pages`.
4. Seleccionar carpeta `/root`.

Los workflows tambien permiten ejecutar manualmente la publicacion usando el input `publish_report`.
