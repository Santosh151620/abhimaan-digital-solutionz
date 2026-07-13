$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Abhimaan Digital Solutionz"
Write-Host "Demo Verification"
Write-Host "========================================="

Write-Host ""
Write-Host "1. Lint"
npm run lint
if($LASTEXITCODE -ne 0){throw "Lint failed"}

Write-Host ""
Write-Host "2. Build"
npm run build
if($LASTEXITCODE -ne 0){throw "Build failed"}

Write-Host ""
Write-Host "3. Git Status"
git status

Write-Host ""
Write-Host "4. Recent Commits"
git log --oneline -5

Write-Host ""
Write-Host "========================================="
Write-Host "SYSTEM READY FOR DEMO"
Write-Host "========================================="