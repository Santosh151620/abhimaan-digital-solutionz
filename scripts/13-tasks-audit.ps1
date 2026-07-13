$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "==================================="
Write-Host "Sprint 4 - Tasks Audit"
Write-Host "==================================="

$files=@(
".\src\components\entities\EntityTasks.tsx",
".\src\components\entities\TaskPanel.tsx",
".\src\repositories\tasks.repository.ts",
".\src\services\tasks.service.ts",
".\src\app\api\entities\tasks\route.ts",
".\src\modules\dashboard"
)

foreach($f in $files){
    if(Test-Path $f){
        Write-Host "[OK] $f"
    }
    else{
        Write-Host "[MISSING] $f"
    }
}

Write-Host ""
Write-Host "Searching task usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityTasks|TaskPanel|tasks.service|tasks.repository|useTasks|due_date|priority" |
Select Path,LineNumber |
Sort Path