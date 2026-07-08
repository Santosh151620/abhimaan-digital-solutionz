$ErrorActionPreference="Stop"

$root=(Get-Location).Path

$files=@(

"scripts\implement-dashboard-ai-insights.ps1",
"scripts\implement-dashboard-notifications-v2.ps1",
"scripts\implement-dashboard-live-feed-v2.ps1",
"scripts\wire-dashboard-ai-v3.ps1",

"src\modules\dashboard\ai\AIInsightsPanel.tsx",
"src\modules\dashboard\ai\data.ts",
"src\modules\dashboard\ai\index.ts",

"src\modules\dashboard\notifications\NotificationSummary.tsx",

"src\modules\dashboard\live\LiveActivityTicker.tsx"

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
Write-Host "Dashboard AI V3 structure ready."