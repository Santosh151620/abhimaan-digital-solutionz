$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Phase 2.6 - Task Intelligence Audit"
Write-Host "========================================="

Write-Host ""
Write-Host "Task Module"
Get-ChildItem .\src\modules -Recurse |
Where-Object { $_.FullName -match "task" }

Write-Host ""
Write-Host "Task APIs"
Get-ChildItem .\src\app\api -Recurse |
Where-Object { $_.FullName -match "task" }

Write-Host ""
Write-Host "Task Components"
Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "TaskTable|TaskPanel|tasks|TaskStatus|TaskList|TaskModal|TaskForm" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Task Services"
Get-ChildItem .\src -Recurse -Include *.ts |
Select-String "tasks.service|TaskService|tasks.repository|TasksRepository" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."