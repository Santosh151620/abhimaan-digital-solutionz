$ErrorActionPreference="Stop"

$root=(Get-Location).Path

$files=@(

"scripts\implement-dashboard-quick-actions.ps1",
"scripts\implement-dashboard-recent-leads.ps1",
"scripts\implement-dashboard-team-performance.ps1",
"scripts\wire-dashboard-intelligence-v2.ps1",

"src\modules\dashboard\quick-actions\QuickActionsPanel.tsx",
"src\modules\dashboard\quick-actions\index.ts",

"src\modules\dashboard\recent-leads\RecentLeadsPanel.tsx",
"src\modules\dashboard\recent-leads\data.ts",
"src\modules\dashboard\recent-leads\index.ts",

"src\modules\dashboard\team-performance\TeamPerformancePanel.tsx",
"src\modules\dashboard\team-performance\data.ts",
"src\modules\dashboard\team-performance\index.ts"

)

foreach($f in $files){

    $full=Join-Path $root $f

    $dir=Split-Path $full -Parent

    if(!(Test-Path $dir)){
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    if(!(Test-Path $full)){
        New-Item -ItemType File -Force -Path $full | Out-Null
        Write-Host "Created $f"
    }
    else{
        Write-Host "Exists  $f"
    }

}

Write-Host ""
Write-Host "Dashboard V2 file structure ready."