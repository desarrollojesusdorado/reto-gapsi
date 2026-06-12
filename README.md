# Reto Gapsi - Monorepo Playwright

Monorepo con dos soluciones de automatizacion usando Playwright y TypeScript:

- `aplicacion-api`: Ejercicio A, API Testing para asignacion de pedidos.
- `aplicacion-web`: Ejercicio B, Web UI Automation para el login del Centro de Control.

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

Desde la raiz del repositorio:

```bash
npm install
```

## Comandos

Ejecutar todo:

```bash
npm run ci
```

Ejecutar solo API:

```bash
npm run test:api
```

Ejecutar solo Web UI:

```bash
npm run test:web
```

Validar TypeScript en ambos proyectos:

```bash
npm run typecheck
```

## Documentacion

- API: `aplicacion-api/docs/diseno-automatizacion-api.md`
- Web UI: `aplicacion-web/docs/diseno-automatizacion-web.md`

## CI/CD

Los workflows estan en `.github/workflows`:

- `api-ci-cd.yml`: ejecuta y publica el reporte del reto API.
- `web-ci-cd.yml`: ejecuta y publica el reporte del reto Web UI.

Ambos workflows soportan ejecucion manual con `workflow_dispatch`.

## Reportes en GitHub Pages

La estrategia de reportes usa la rama `gh-pages` con carpetas separadas:

- Reporte API: `/api`
- Reporte Web UI: `/web`

Configura GitHub Pages en el repositorio con:

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/root`
