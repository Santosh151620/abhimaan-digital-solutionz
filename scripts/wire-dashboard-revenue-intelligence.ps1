$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { RevenueIntelligencePanel } from "@/modules/dashboard/revenue-intelligence";'

if($content -notmatch "dashboard/revenue-intelligence"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<RevenueKPI data={dashboard.revenue} />',
@'
<RevenueKPI data={dashboard.revenue} />

<RevenueIntelligencePanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Revenue Intelligence wired."