$ErrorActionPreference = "Stop"

Write-Host "========== LEAD MODULE AUDIT =========="

Get-ChildItem .\src\modules\leads -Recurse

Write-Host ""
Write-Host "API"

Get-ChildItem .\src\app\api\leads -Recurse

Write-Host ""
Write-Host "Admin"

Get-ChildItem ".\src\app\admin\(protected)\leads" -Recurse

Write-Host ""
Write-Host "Searching Lead imports..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "modules/leads|LeadService|LeadsService|LeadRepository|LeadsRepository|useLeads|LeadList" |
Sort Path |
Format-Table Path,LineNumber -AutoSize