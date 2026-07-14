$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Dashboard Intelligence Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "mock|placeholder|demo|dummy|sample|hardcoded|TODO|FIXME" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Dashboard Pages"
Get-ChildItem .\src\app -Recurse -Include page.tsx |
Where-Object {$_.FullName -match "dashboard"}

Write-Host ""
Write-Host "Dashboard Services"
Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Audit Complete."