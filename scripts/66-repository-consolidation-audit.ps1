Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.6 - Repository Consolidation"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Repository Files"
Write-Host "----------------"

Get-ChildItem "$root\src" -Recurse -Include *Repository.ts,*repository.ts |
Sort-Object Name |
Select-Object FullName

Write-Host ""

Write-Host "Repository Classes"
Write-Host "------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "class .*Repository" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Inheritance"
Write-Host "-----------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "extends .*Repository" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "new Repository"
Write-Host "--------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "new .*Repository" |
Select Path,LineNumber

Write-Host ""

Write-Host "Repository Imports"
Write-Host "------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "Repository" |
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

Write-Host "Repository Audit Completed Successfully."