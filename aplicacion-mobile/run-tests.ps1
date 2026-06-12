param(
    [string]$AppPath = "",
    [string]$Flow = ".",
    [ValidateSet("html", "junit")]
    [string]$ReportFormat = "html"
)

$ReportsDir = "reports"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$env:MAESTRO_CLI_NO_ANALYTICS = "true"

if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
}

$ReportExtension = if ($ReportFormat -eq "junit") { "xml" } else { "html" }
$ReportPath = "$ReportsDir/pickapp_$Timestamp.$ReportExtension"
$Command = "maestro test"

if ($AppPath -ne "") {
    $Command += " --app=$AppPath"
}

$Command += " $Flow --format=$ReportFormat --output=$ReportPath"

Write-Host "Ejecutando: $Command" -ForegroundColor Cyan
Invoke-Expression $Command

if ($LASTEXITCODE -ne 0) {
    Write-Host "Las pruebas mobile fallaron" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Reporte generado en $ReportPath" -ForegroundColor Green
