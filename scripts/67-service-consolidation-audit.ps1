Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.7 - Service Consolidation Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Service Files"
Write-Host "-------------"

Get-ChildItem "$root\src" -Recurse -Include *Service.ts,*service.ts,*services.ts |
Sort-Object Name |
Select-Object FullName

Write-Host ""

Write-Host "Service Classes"
Write-Host "---------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "class .*Service" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Exported Functions"
Write-Host "------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "export (async )?function|export const .*=" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Service Imports"
Write-Host "---------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "Service" |
Select Path,LineNumber

Write-Host ""

Write-Host "Possible Duplicate Services"
Write-Host "---------------------------"

Get-ChildItem "$root\src" -Recurse -Include *Service.ts,*service.ts,*services.ts |
Group-Object Name |
Where-Object {$_.Count -gt 1} |
Select Count,Name

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "Service Consolidation Audit Completed."