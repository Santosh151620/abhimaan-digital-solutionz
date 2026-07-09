[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$route = $ModuleName.Trim().ToLower()

$apiRoot = Join-Path $ProjectRoot "src\app\api\crm\$route"

$folders = @(
    "",
    "[id]"
)

foreach ($folder in $folders) {

    $path = Join-Path $apiRoot $folder

    if (-not (Test-Path -LiteralPath $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

Set-Content `
-LiteralPath (Join-Path $apiRoot "route.ts") `
-Encoding UTF8 `
-Value @(
"export async function GET() {",
"  return Response.json([]);",
"}",
"",
"export async function POST() {",
"  return Response.json({ success: true });",
"}"
)

Set-Content `
-LiteralPath (Join-Path $apiRoot "[id]\route.ts") `
-Encoding UTF8 `
-Value @(
"export async function GET() {",
"  return Response.json({});",
"}",
"",
"export async function PUT() {",
"  return Response.json({ success: true });",
"}",
"",
"export async function DELETE() {",
"  return Response.json({ success: true });",
"}"
)

Write-Host ""
Write-Host "API scaffold created." -ForegroundColor Green