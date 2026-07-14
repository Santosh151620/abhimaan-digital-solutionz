$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================="
Write-Host "Executive Dashboard Audit"
Write-Host "======================================="

Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Reporting"

Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Dashboard Services"

Get-ChildItem .\src\services -Recurse |
Where-Object {$_.Name -match "dashboard|report"}

Write-Host ""
Write-Host "Audit Complete."