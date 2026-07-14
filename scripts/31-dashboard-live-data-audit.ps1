$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Dashboard Live Data Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "dashboard-data|dashboard.ts|analytics|ActivityService|LeadsService|payments|projects|tasks|notifications" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."