Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.2 - Unused Imports Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Unused imports / variables (eslint)"
npm run lint

if($LASTEXITCODE -ne 0){
    Write-Host ""
    Write-Host "Lint reported issues."
}

Write-Host ""
Write-Host "Backup files"
Get-ChildItem "$root\src" -Recurse -Include *.backup

Write-Host ""
Write-Host "Legacy files"
Get-ChildItem "$root\src" -Recurse -Include *Legacy*.tsx,*Legacy*.ts

Write-Host ""
Write-Host "README files"
Get-ChildItem "$root\src" -Recurse -Include README.md

Write-Host ""
Write-Host "Index barrels"
Get-ChildItem "$root\src" -Recurse -Filter index.ts

Write-Host ""
Write-Host "Audit Complete."