[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$docRoot = Join-Path $ProjectRoot "docs\crm\modules"

if (-not (Test-Path -LiteralPath $docRoot)) {
    New-Item -ItemType Directory -Path $docRoot | Out-Null
}

Set-Content `
-LiteralPath (Join-Path $docRoot ($ModuleName + ".md")) `
-Encoding UTF8 `
-Value @(
"# $ModuleName",
"",
"## Overview",
"",
"## Features",
"",
"- List",
"- Create",
"- Edit",
"- Delete",
"",
"## Components",
"",
"## Services",
"",
"## Repository",
"",
"## Future Enhancements"
)

Write-Host ""
Write-Host "Documentation scaffold created." -ForegroundColor Green