$root = "src"

Write-Host ""
Write-Host "==============================="
Write-Host "EMPTY FILES"
Write-Host "==============================="

Get-ChildItem $root -Recurse -Include *.ts,*.tsx |
Where-Object Length -eq 0 |
Select-Object FullName

Write-Host ""
Write-Host "==============================="
Write-Host "VERY SMALL FILES (<500 bytes)"
Write-Host "==============================="

Get-ChildItem $root -Recurse -Include *.ts,*.tsx |
Where-Object Length -lt 500 |
Sort-Object Length |
Select Length, FullName

Write-Host ""
Write-Host "==============================="
Write-Host "CRM MODULES"
Write-Host "==============================="

Get-ChildItem src/app/crm -Directory |
Select Name

Write-Host ""
Write-Host "==============================="
Write-Host "API MODULES"
Write-Host "==============================="

Get-ChildItem src/app/api/crm -Directory |
Select Name

Write-Host ""
Write-Host "==============================="
Write-Host "SERVICES"
Write-Host "==============================="

Get-ChildItem src/services/crm

Write-Host ""
Write-Host "==============================="
Write-Host "REPOSITORIES"
Write-Host "==============================="

Get-ChildItem src/repositories/crm

Write-Host ""
Write-Host "==============================="
Write-Host "TYPES"
Write-Host "==============================="

Get-ChildItem src/types/crm