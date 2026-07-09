[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $root "create-api-scaffold.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "create-test-scaffold.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "create-doc-scaffold.ps1") `
    -ModuleName $ModuleName

Write-Host ""
Write-Host "Module package generation completed." -ForegroundColor Green