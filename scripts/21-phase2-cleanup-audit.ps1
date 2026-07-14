$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "=========================================="
Write-Host "Phase 2.1 - Codebase Consolidation Audit"
Write-Host "=========================================="

Write-Host ""
Write-Host "1. Backup Files"
Get-ChildItem . -Recurse -Include *.backup

Write-Host ""
Write-Host "2. Legacy Files"
Get-ChildItem .\src -Recurse -Include *Legacy*.tsx,*Legacy*.ts

Write-Host ""
Write-Host "3. Empty Directories"
Get-ChildItem .\src -Directory -Recurse |
Where-Object {
($_.GetFiles().Count + $_.GetDirectories().Count) -eq 0
} | Select FullName

Write-Host ""
Write-Host "4. Duplicate Base Repositories"
Get-ChildItem .\src -Recurse -Include *Repository*.ts,*repository*.ts

Write-Host ""
Write-Host "5. Duplicate Services"
Get-ChildItem .\src -Recurse -Include *Service*.ts,*service*.ts

Write-Host ""
Write-Host "6. Duplicate Hooks"
Get-ChildItem .\src -Recurse -Include use*.ts

Write-Host ""
Write-Host "7. Duplicate Index Files"
Get-ChildItem .\src -Recurse -Include index.ts

Write-Host ""
Write-Host "Audit Complete."