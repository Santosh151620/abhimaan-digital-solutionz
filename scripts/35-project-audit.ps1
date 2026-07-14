$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.5 - Project Intelligence Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Project Module"
Get-ChildItem .\src\modules\projects -Recurse

Write-Host ""
Write-Host "Project Pages"
Get-ChildItem .\src\app -Recurse |
Where-Object { $_.FullName -match "projects" }

Write-Host ""
Write-Host "Project APIs"
Get-ChildItem .\src\app\api -Recurse |
Where-Object { $_.FullName -match "project" }

Write-Host ""
Write-Host "Project Timeline References"
Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "project_timeline|timeline|milestone|budget|kanban|health|time tracking|projectStatusPipeline" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."