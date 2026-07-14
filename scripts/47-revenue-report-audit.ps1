$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================="
Write-Host "Phase 2.8.3 - Revenue Reports Audit"
Write-Host "======================================="

Write-Host ""
Write-Host "Payments Module"
Get-ChildItem .\src\modules\payments -Recurse

Write-Host ""
Write-Host "Payment Services"
Get-ChildItem .\src\services -Recurse |
Where-Object { $_.Name -match "payment|dashboard|analytics|report" }

Write-Host ""
Write-Host "Repositories"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "payment.repository|payments.ts|PaymentsService|payment.mapper" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Reporting Layer"
Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Audit Complete."