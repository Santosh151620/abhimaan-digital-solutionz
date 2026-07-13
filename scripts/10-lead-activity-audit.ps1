$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Sprint 1.10 - Lead Activity Audit"
Write-Host "========================================="
Write-Host ""

$files = @(
".\src\components\entities\EntityActivityFeed.tsx",
".\src\components\entities\ActivityPanel.tsx",
".\src\services\activity.service.ts",
".\src\repositories\activity.repository.ts",
".\src\app\api\entities\activity\route.ts",
".\src\modules\leads\components\LeadWorkspace.tsx"
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
Write-Host "Searching Activity implementations..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityActivityFeed|ActivityPanel|activity.service|activity.repository|activities" |
Select Path,LineNumber |
Sort Path