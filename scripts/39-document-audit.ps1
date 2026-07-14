$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.7 - Document Intelligence Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Attachments Module"
Get-ChildItem .\src -Recurse |
Where-Object { $_.FullName -match "attachment" }

Write-Host ""
Write-Host "Repositories"
Get-ChildItem .\src\repositories -Recurse

Write-Host ""
Write-Host "Services"
Get-ChildItem .\src\services -Recurse |
Where-Object { $_.FullName -match "attachment" }

Write-Host ""
Write-Host "API"
Get-ChildItem .\src\app\api -Recurse |
Where-Object { $_.FullName -match "attachment" }

Write-Host ""
Write-Host "Components"
Get-ChildItem .\src\components -Recurse |
Where-Object { $_.FullName -match "Attachment|Document" }

Write-Host ""
Write-Host "Audit Complete."