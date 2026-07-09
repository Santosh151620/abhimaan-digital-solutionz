[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $root "create-module-manifest.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "register-module.ps1") `
    -ModuleName $ModuleName

Write-Host ""
Write-Host "Module registration complete." -ForegroundColor Green