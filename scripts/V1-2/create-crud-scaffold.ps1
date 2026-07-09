[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()
$route = $module.ToLower()

$appRoot = Join-Path $ProjectRoot "src\app\crm\$route"

$folders = @(
    "",
    "new",
    "[id]",
    "[id]\edit"
)

foreach ($folder in $folders) {

    $path = Join-Path $appRoot $folder

    if (-not (Test-Path -LiteralPath $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

Set-Content `
-LiteralPath (Join-Path $appRoot "page.tsx") `
-Encoding UTF8 `
-Value @(
"export default function ${module}ListPage() {",
"  return <div>${module} List</div>;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $appRoot "new\page.tsx") `
-Encoding UTF8 `
-Value @(
"export default function New${module}Page() {",
"  return <div>New ${module}</div>;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $appRoot "[id]\page.tsx") `
-Encoding UTF8 `
-Value @(
"export default function ${module}DetailsPage() {",
"  return <div>${module} Details</div>;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $appRoot "[id]\edit\page.tsx") `
-Encoding UTF8 `
-Value @(
"export default function Edit${module}Page() {",
"  return <div>Edit ${module}</div>;",
"}"
)

Write-Host ""
Write-Host "CRUD pages created." -ForegroundColor Green