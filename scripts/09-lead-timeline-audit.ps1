$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================="
Write-Host "Sprint 1.9 - Lead Timeline Audit"
Write-Host "====================================="
Write-Host ""

$files = @(
".\src\modules\leads\components\LeadTimeline.tsx",
".\src\modules\leads\components\LeadWorkspace.tsx",
".\src\components\entities\EntityTimeline.tsx",
".\src\components\entities\EntityActivityFeed.tsx",
".\src\components\entities\ActivityPanel.tsx",
".\src\services\activity.service.ts",
".\src\repositories\activity.repository.ts",
".\src\app\api\leads\[id]\timeline\route.ts",
".\src\app\api\entities\activity\route.ts"
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
Write-Host "Searching Timeline usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityTimeline|LeadTimeline|EntityActivityFeed|activity.service|lead_timeline" |
Select Path,LineNumber |
Sort Path