[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$factoryScript = Join-Path $scriptRoot "create-crm-module.ps1"

if (-not (Test-Path -LiteralPath $factoryScript)) {
    throw "Factory script not found: $factoryScript"
}

& $factoryScript -ModuleName $ModuleName

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host " CRM Module Generated Successfully " -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Module : $ModuleName"
Write-Host "Route  : /crm/$($ModuleName.ToLower())"
Write-Host ""
Write-Host "Next:"
Write-Host "  npm run lint"
Write-Host "  npm run build"