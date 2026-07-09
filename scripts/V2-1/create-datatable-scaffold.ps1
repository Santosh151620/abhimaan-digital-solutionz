[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()
$route = $module.ToLower()

$componentRoot = Join-Path $ProjectRoot "src\components\crm\$route"

if (-not (Test-Path -LiteralPath $componentRoot)) {
    New-Item -ItemType Directory -Path $componentRoot | Out-Null
}

Set-Content `
-LiteralPath (Join-Path $componentRoot ($module + "Columns.ts")) `
-Encoding UTF8 `
-Value @(
"export const ${module}Columns = [",
"  {",
"    accessorKey: 'id',",
"    header: 'ID'",
"  }",
"];"
)

Set-Content `
-LiteralPath (Join-Path $componentRoot ($module + "Filters.tsx")) `
-Encoding UTF8 `
-Value @(
"export function ${module}Filters() {",
"  return <div>Filters</div>;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $componentRoot ($module + "Toolbar.tsx")) `
-Encoding UTF8 `
-Value @(
"export function ${module}Toolbar() {",
"  return <div>Toolbar</div>;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $componentRoot ($module + "DataTable.tsx")) `
-Encoding UTF8 `
-Value @(
"export function ${module}DataTable() {",
"  return <div>DataTable</div>;",
"}"
)

Write-Host ""
Write-Host "DataTable scaffold generated." -ForegroundColor Green