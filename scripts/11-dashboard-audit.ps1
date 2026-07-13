$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Sprint 2 - Dashboard Audit"
Write-Host "========================================="
Write-Host ""

$files = @(
".\src\app\admin\(protected)\dashboard\page.tsx",
".\src\services\dashboard.ts",
".\src\services\dashboard-data.ts",
".\src\modules\dashboard",
".\src\components\dashboard",
".\src\modules\leads\services\LeadsService.ts",
".\src\services\activity.service.ts"
)

foreach($item in $files)
{
    if(Test-Path $item)
    {
        Write-Host "[OK] $item"
    }
    else
    {
        Write-Host "[MISSING] $item"
    }
}

Write-Host ""
Write-Host "Searching dashboard data..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "dashboard-data|DashboardSummaryCard|DashboardGrid|KPICard|RecentLeads|ActivityFeed|dashboard" |
Select Path,LineNumber |
Sort Path