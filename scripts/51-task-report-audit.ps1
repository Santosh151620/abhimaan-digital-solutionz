$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.8.5 - Task Reports Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Task Module"
Get-ChildItem .\src\modules -Recurse |
Where-Object { $_.FullName -match "task" }

Write-Host ""
Write-Host "Task Repository"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "tasks.repository|TaskRepository|tasks.service|TaskService|useTasks" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Dashboard"
Get-ChildItem .\src\modules\dashboard -Recurse

Write-Host ""
Write-Host "Reporting"
Get-ChildItem .\src\services\reporting.ts

Write-Host ""
Write-Host "Audit Complete."