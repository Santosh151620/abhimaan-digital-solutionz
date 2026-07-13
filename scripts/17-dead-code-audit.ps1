$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Abhimaan Digital Solutionz"
Write-Host "Sprint 8 - Dead Code Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Searching backup files..."
Get-ChildItem . -Recurse -Include *.backup

Write-Host ""
Write-Host "Searching legacy files..."
Get-ChildItem .\src -Recurse -Include *Legacy*.ts,*Legacy*.tsx

Write-Host ""
Write-Host "Searching README files..."
Get-ChildItem .\src -Recurse README.md

Write-Host ""
Write-Host "Searching empty directories..."
Get-ChildItem .\src -Directory -Recurse |
Where-Object {($_.GetFiles().Count + $_.GetDirectories().Count) -eq 0} |
Select FullName

Write-Host ""
Write-Host "Searching duplicate repository implementations..."
Get-ChildItem .\src -Recurse -Include *Repository*.ts,*repository*.ts

Write-Host ""
Write-Host "Searching unused barrel exports..."
Get-ChildItem .\src -Recurse -Include index.ts

Write-Host ""
Write-Host "Audit Complete."