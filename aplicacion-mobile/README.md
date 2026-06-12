# Aplicacion Mobile - PickApp

Automatizacion mobile simulada para PickApp usando Maestro Framework.

## Requisitos

- Maestro instalado
- Emulador Android, simulador iOS o dispositivo fisico conectado
- APK/IPA de PickApp disponible localmente

## Ejecutar todos los flujos

```powershell
$env:MAESTRO_CLI_NO_ANALYTICS="true"
maestro test .
```

## Ejecutar un flujo especifico

```powershell
$env:MAESTRO_CLI_NO_ANALYTICS="true"
maestro test flows/01-happy-path-generar-guia.yaml
```

## Ejecutar instalando una app

```powershell
$env:MAESTRO_CLI_NO_ANALYTICS="true"
maestro test --app=apps/pickapp.apk flows/01-happy-path-generar-guia.yaml
```

## Generar reporte

```powershell
$env:MAESTRO_CLI_NO_ANALYTICS="true"
maestro test . --format=html --output=reports/mobile-report.html
```

## Documentacion

El diseno del reto esta en `docs/diseno-automatizacion-mobile.md`.
