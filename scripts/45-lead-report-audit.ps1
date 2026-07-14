$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================"
Write-Host "Phase 2.8.2 - Lead Reports Audit"
Write-Host "======================================"

Get-ChildItem .\src\modules\leads -Recurse

Write-Host ""
Write-Host "Lead Repository"

Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "LeadsRepository|useLeads|LeadService|lead.repository|leads" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Dashboard"

Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Reporting"

Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Audit Complete"