Write-Host ""
Write-Host "====================================="
Write-Host " BaseRepository Usage Audit"
Write-Host "====================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Using lib/db/base-repository"
Get-ChildItem "$root\src" -Recurse -Filter *.ts* |
Select-String "lib/db/base-repository|base-repository" |
Sort Path,LineNumber

Write-Host ""

Write-Host "Using lib/repository/BaseRepository"
Get-ChildItem "$root\src" -Recurse -Filter *.ts* |
Select-String "BaseRepository" |
Sort Path,LineNumber

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""

Write-Host "Audit Complete."