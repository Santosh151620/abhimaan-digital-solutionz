$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.8.1 Reporting Foundation Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Dashboard Services"
Get-ChildItem .\src\services -Recurse |
Where-Object {$_.Name -match "dashboard|analytics"}

Write-Host ""
Write-Host "Repositories"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "LeadsRepository|CompaniesRepository|payment.repository|project.repository|tasks.repository|ActivityRepository" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Dashboard Components"
Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Audit Complete."