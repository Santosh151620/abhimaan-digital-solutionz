$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.8 - Reporting Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Dashboard Services"
Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Analytics Services"
Get-ChildItem .\src\services -Recurse |
Where-Object {
    $_.FullName -match "dashboard|analytics|report|payment|lead|project|task"
}

Write-Host ""
Write-Host "Repositories"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "Repository|repository" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "API"
Get-ChildItem .\src\app\api -Recurse

Write-Host ""
Write-Host "Audit Complete."