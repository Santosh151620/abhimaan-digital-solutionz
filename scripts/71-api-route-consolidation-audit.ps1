Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.11 - API Route Consolidation"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "API Route Files"
Write-Host "---------------"

$routes = Get-ChildItem "$root\src\app\api" -Recurse -Filter route.ts

$routes | Sort-Object FullName | Select FullName

Write-Host ""

Write-Host "HTTP Methods"
Write-Host "------------"

Get-ChildItem "$root\src\app\api" -Recurse -Filter route.ts |
Select-String "export async function (GET|POST|PUT|PATCH|DELETE)" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Duplicate Route Names"
Write-Host "---------------------"

$routes |
Group-Object Name |
Where-Object {$_.Count -gt 1} |
Format-Table Count,Name -Auto

Write-Host ""

Write-Host "Route Structure"
Write-Host "---------------"

Get-ChildItem "$root\src\app\api" -Directory -Recurse |
Select FullName

Write-Host ""

Write-Host "Tenant Guard Usage"
Write-Host "------------------"

Get-ChildItem "$root\src\app\api" -Recurse -Filter route.ts |
Select-String "withTenant|assertTenant|requireAdmin|apiGuard|tenant" |
Select Path,LineNumber

Write-Host ""

Write-Host "Supabase Usage"
Write-Host "--------------"

Get-ChildItem "$root\src\app\api" -Recurse -Filter route.ts |
Select-String "createServerClient|createClient|supabase" |
Select Path,LineNumber

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "API Audit Completed Successfully."