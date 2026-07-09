[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

& (Join-Path $root "create-crud-scaffold.ps1") `
    -ModuleName $ModuleName

& (Join-Path $root "create-component-set.ps1") `
    -ModuleName $ModuleName

Write-Host ""
Write-Host "CRUD scaffold completed." -ForegroundColor Green