$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.2 Production Hardening"
Write-Host "========================================="

.\scripts\25-api-audit.ps1
.\scripts\26-tenant-audit.ps1
.\scripts\27-validation-audit.ps1
.\scripts\28-logger-audit.ps1

Write-Host ""
Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){throw "Lint Failed"}

Write-Host ""
Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){throw "Build Failed"}

Write-Host ""
git status

Write-Host ""
Write-Host "Phase 2.2 Audit Complete."