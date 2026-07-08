$ErrorActionPreference="Stop"

$files=@(
"scripts\implement-dashboard-kpi-trends.ps1",
"scripts\implement-dashboard-sales-funnel.ps1",
"scripts\implement-dashboard-revenue-timeline.ps1",
"scripts\implement-dashboard-goals.ps1",
"scripts\wire-dashboard-v4.ps1",

"src\modules\dashboard\kpi-trends\KPITrendsPanel.tsx",
"src\modules\dashboard\kpi-trends\data.ts",
"src\modules\dashboard\kpi-trends\index.ts",

"src\modules\dashboard\sales-funnel\SalesFunnelPanel.tsx",
"src\modules\dashboard\sales-funnel\data.ts",
"src\modules\dashboard\sales-funnel\index.ts",

"src\modules\dashboard\revenue-timeline\RevenueTimelinePanel.tsx",
"src\modules\dashboard\revenue-timeline\data.ts",
"src\modules\dashboard\revenue-timeline\index.ts",

"src\modules\dashboard\goals\GoalsPanel.tsx",
"src\modules\dashboard\goals\data.ts",
"src\modules\dashboard\goals\index.ts"
)

foreach($f in $files){

    $dir=Split-Path $f -Parent

    if(!(Test-Path $dir)){
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    if(!(Test-Path $f)){
        New-Item -ItemType File -Force -Path $f | Out-Null
        Write-Host "Created $f"
    }

}

Write-Host ""
Write-Host "Dashboard V4 structure ready."