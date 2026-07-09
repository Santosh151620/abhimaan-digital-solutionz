[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()

$componentRoot = Join-Path $ProjectRoot "src\components\crm\$($module.ToLower())"

if (-not (Test-Path -LiteralPath $componentRoot)) {
    New-Item -ItemType Directory -Path $componentRoot | Out-Null
}

$files = @(
    "Table",
    "Form",
    "Toolbar",
    "Filters",
    "DetailsCard",
    "SummaryCard",
    "DeleteDialog",
    "EmptyState",
    "LoadingState"
)

foreach ($file in $files) {

    Set-Content `
    -LiteralPath (Join-Path $componentRoot ($module + $file + ".tsx")) `
    -Encoding UTF8 `
    -Value @(
"export function ${module}${file}() {",
"  return <div>${module} ${file}</div>;",
"}"
    )
}

Write-Host ""
Write-Host "Component set created." -ForegroundColor Green