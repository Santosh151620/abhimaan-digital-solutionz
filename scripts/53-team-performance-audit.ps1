$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================"
Write-Host "Phase 2.8.6 - Team Performance Audit"
Write-Host "========================================"

Write-Host ""
Write-Host "Team / Profile"

Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "organization_members|profiles|tenant|owner_id|assigned_to|user_id" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Repositories"

Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "LeadsRepository|project.repository|payment.repository|tasks.repository|ActivityRepository" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Dashboard"

Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Reporting"

Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Audit Complete."