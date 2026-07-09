[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()
$route = $module.ToLower()

$manifestRoot = Join-Path $ProjectRoot "src\config\crm"

if (-not (Test-Path -LiteralPath $manifestRoot)) {
    New-Item -ItemType Directory -Path $manifestRoot | Out-Null
}

$file = Join-Path $manifestRoot ($route + ".manifest.ts")

Set-Content `
-LiteralPath $file `
-Encoding UTF8 `
-Value @(
"export const ${module}Manifest = {",
"  id: '$route',",
"  name: '$module',",
"  route: '/crm/$route',",
"  enabled: true,",
"  icon: 'Building2',",
"  version: '1.0.0'",
"};"
)

Write-Host ""
Write-Host "Module manifest created." -ForegroundColor Green