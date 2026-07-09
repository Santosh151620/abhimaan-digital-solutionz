[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $root "create-datatable-scaffold.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "create-validation-scaffold.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "create-server-actions.ps1") `
    -ModuleName $ModuleName

Write-Host ""
Write-Host "Module enhancement completed." -ForegroundColor Green