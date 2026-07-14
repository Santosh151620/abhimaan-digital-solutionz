$ErrorActionPreference="Stop"

.\scripts\43-report-foundation-audit.ps1

Write-Host ""
Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){throw "Lint Failed"}

Write-Host ""
Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){throw "Build Failed"}

git status