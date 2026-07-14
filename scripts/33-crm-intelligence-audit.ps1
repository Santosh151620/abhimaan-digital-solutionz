$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "CRM Intelligence Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Lead Module"
Get-ChildItem .\src\modules\leads -Recurse

Write-Host ""
Write-Host "Lead APIs"
Get-ChildItem .\src\app\api\leads -Recurse

Write-Host ""
Write-Host "CRM Services"
Get-ChildItem .\src\services\crm -Recurse

Write-Host ""
Write-Host "Search for existing intelligence..."
Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "search|filter|bulk|duplicate|merge|follow.?up|scheduler|LeadSearch|LeadFilters" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."