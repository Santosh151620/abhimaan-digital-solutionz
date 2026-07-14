Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.0 Repository Consolidation Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Repository Classes"
Get-ChildItem "$root\src" -Recurse -Filter "*Repository*.ts" |
Select FullName

Write-Host ""

Write-Host "Service Classes"
Get-ChildItem "$root\src" -Recurse -Filter "*Service*.ts" |
Select FullName

Write-Host ""

Write-Host "Duplicate Repository Names"
Get-ChildItem "$root\src" -Recurse -Filter "*.ts" |
Select-String "class .*Repository" |
Group Path |
Sort Count -Descending |
Select Count,Name

Write-Host ""

Write-Host "Duplicate Service Names"
Get-ChildItem "$root\src" -Recurse -Filter "*.ts" |
Select-String "class .*Service" |
Group Path |
Sort Count -Descending |
Select Count,Name

Write-Host ""

Write-Host "Legacy repositories folder"
Get-ChildItem "$root\src\repositories" -Recurse -ErrorAction SilentlyContinue

Write-Host ""

Write-Host "Module repositories"
Get-ChildItem "$root\src\modules" -Recurse -Filter "*repository*.ts"

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""

Write-Host "Audit Completed Successfully."