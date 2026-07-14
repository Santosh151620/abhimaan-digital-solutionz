$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================"
Write-Host "Phase 2.8.4 - Project Reports Audit"
Write-Host "========================================"

Write-Host ""
Write-Host "Projects Module"
Get-ChildItem .\src\modules\projects -Recurse

Write-Host ""
Write-Host "Project Repository"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "project.repository|ProjectsRepository|projects.ts|ProjectService|projectStatusPipeline" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Project Timeline"
Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "project_timeline|timeline|milestone" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Reporting Layer"
Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Dashboard"
Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Audit Complete."