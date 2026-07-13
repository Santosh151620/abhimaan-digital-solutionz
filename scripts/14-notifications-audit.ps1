$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================"
Write-Host "Sprint 5 - Notifications Audit"
Write-Host "========================================"

$files=@(
".\src\components\entities\EntityNotifications.tsx",
".\src\components\entities\NotificationPanel.tsx",
".\src\repositories\notifications.repository.ts",
".\src\services\notifications.service.ts",
".\src\app\api\entities\notifications\route.ts",
".\src\modules\dashboard\notifications"
)

foreach($file in $files)
{
    if(Test-Path $file)
    {
        Write-Host "[OK] $file"
    }
    else
    {
        Write-Host "[MISSING] $file"
    }
}

Write-Host ""
Write-Host "Searching notification usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityNotifications|NotificationPanel|notifications.service|notifications.repository|markRead|unread" |
Select Path,LineNumber |
Sort Path