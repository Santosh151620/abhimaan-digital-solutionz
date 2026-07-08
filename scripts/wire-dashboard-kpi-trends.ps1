$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { KPITrendsPanel } from "@/modules/dashboard/kpi-trends";'

if($content -notmatch "dashboard/kpi-trends"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$anchor='<AnalyticsCards data={dashboard.metrics} />'

$replacement=@'
<AnalyticsCards data={dashboard.metrics} />

<KPITrendsPanel />
'@

$content=$content.Replace($anchor,$replacement)

Set-Content -LiteralPath $page -Value $content

Write-Host "Dashboard KPI Trends wired."