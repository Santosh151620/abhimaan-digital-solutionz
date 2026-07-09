[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$route = $ModuleName.ToLower()

$actionsRoot = Join-Path $ProjectRoot "src\app\crm\$route"

Set-Content `
-LiteralPath (Join-Path $actionsRoot "actions.ts") `
-Encoding UTF8 `
-Value @(
"'use server';",
"",
"export async function getAll() {",
"  return [];",
"}",
"",
"export async function create() {",
"}",
"",
"export async function update() {",
"}",
"",
"export async function remove() {",
"}"
)

Write-Host ""
Write-Host "Server actions generated." -ForegroundColor Green