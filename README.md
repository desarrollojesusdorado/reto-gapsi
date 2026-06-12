# Reto Gapsi - Playwright API

Proyecto base para automatizar el endpoint `POST /api/v1/orders/assign` usando Playwright, TypeScript y una arquitectura tipo POM aplicada a API.

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

```bash
npm install
```

Configura las variables de entorno si vas a probar contra un servicio real:

```bash
copy .env.example .env
```

Actualiza `BASE_URL` y `API_TOKEN` con los valores reales del ambiente.

Las pruebas incluidas levantan un servidor mock local para simular el endpoint del reto, por lo que pueden ejecutarse sin depender de un ambiente externo.

## Ejecucion

```bash
npm test
```

Solo pruebas API:

```bash
npm run test:api
```

Reporte HTML:

```bash
npm run report
```

## CI/CD

El workflow `.github/workflows/ci-cd.yml` ejecuta:

- instalacion con `npm ci`
- validacion TypeScript con `npm run typecheck`
- pruebas API con `npm run test:ci`
- carga del reporte como artifact
- publicacion del reporte HTML en GitHub Pages

La accion se ejecuta en `push`, `pull_request` y manualmente desde `workflow_dispatch`. Para usar GitHub Pages, configura el repositorio en `Settings > Pages > Source > GitHub Actions`.
