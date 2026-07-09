<#
    Abhimaan Digital Solutionz CRM

    Module Factory Reset

    PowerShell 5.1 Compatible

    Purpose
    -------
    Removes the temporary generator scripts created during development
    and prepares the repository for the consolidated automation model.

    SAFE:
    - Deletes ONLY known generator scripts.
    - Preserves common.ps1.
    - Never touches application source.
#>

[CmdletBinding()]
param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ScriptsRoot = Join-Path $Root "scripts"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " CRM MODULE FACTORY RESET" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$DeleteList = @(

    "V1-1",
    "V1-2",
    "V2-1",
    "V2-2",
    "V3-1"

)

foreach ($item in $DeleteList) {

    $path = Join-Path $ScriptsRoot $item

    if (Test-Path -LiteralPath $path) {

        Write-Host "Removing $path"

        Remove-Item `
            -LiteralPath $path `
            -Recurse `
            -Force
    }
}

$config = Join-Path $ScriptsRoot "config.json"

if (-not (Test-Path -LiteralPath $config)) {

    Set-Content `
        -LiteralPath $config `
        -Encoding UTF8 `
        -Value @(
"{",
'  "version": "1.0.0",',
'  "factory": "crm.ps1",',
'  "documentation": "docs.ps1",',
'  "build": "build.ps1"',
"}"
)
}

$crm = Join-Path $ScriptsRoot "crm.ps1"

if (-not (Test-Path -LiteralPath $crm)) {

    Set-Content `
        -LiteralPath $crm `
        -Encoding UTF8 `
        -Value @(
"# CRM Factory",
"# Placeholder",
"# Will be replaced in Sprint V1"
)
}

$docs = Join-Path $ScriptsRoot "docs.ps1"

if (-not (Test-Path -LiteralPath $docs)) {

    Set-Content `
        -LiteralPath $docs `
        -Encoding UTF8 `
        -Value @(
"# Documentation Automation",
"# Placeholder"
)
}

$build = Join-Path $ScriptsRoot "build.ps1"

if (-not (Test-Path -LiteralPath $build)) {

    Set-Content `
        -LiteralPath $build `
        -Encoding UTF8 `
        -Value @(
"# Build Automation",
"# Placeholder"
)
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " FACTORY RESET COMPLETE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Current Automation"

Write-Host ""

Write-Host " scripts\common.ps1"
Write-Host " scripts\crm.ps1"
Write-Host " scripts\docs.ps1"
Write-Host " scripts\build.ps1"
Write-Host " scripts\config.json"

Write-Host ""
Write-Host "Ready for consolidated automation."