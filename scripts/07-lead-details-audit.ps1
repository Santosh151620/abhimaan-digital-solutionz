$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Sprint 1.7 - Lead Details Audit"
Write-Host "========================================="
Write-Host ""

$files = @(
".\src\modules\leads\components\LeadWorkspace.tsx",
".\src\modules\leads\components\LeadOverview.tsx",
".\src\modules\leads\components\LeadTimeline.tsx",
".\src\modules\leads\components\LeadEntityPanel.tsx",
".\src\components\entities\EntityWorkspace.tsx",
".\src\components\entities\EntityHeader.tsx",
".\src\components\entities\EntityOverview.tsx",
".\src\components\entities\EntityTimeline.tsx",
".\src\components\entities\EntityNotes.tsx",
".\src\components\entities\EntityActivityFeed.tsx",
".\src\components\entities\EntityTasks.tsx",
".\src\components\entities\EntityAttachments.tsx",
".\src\components\entities\EntityNotifications.tsx"
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
Write-Host "Searching Entity component usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityWorkspace|EntityTimeline|EntityNotes|EntityActivityFeed|EntityAttachments|LeadWorkspace" |
Select Path,LineNumber |
Sort Path