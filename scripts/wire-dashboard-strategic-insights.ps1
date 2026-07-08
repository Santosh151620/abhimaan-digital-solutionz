$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { StrategicInsightsPanel } from "@/modules/dashboard/strategic-insights";'

if($content -notmatch "dashboard/strategic-insights"){
 $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<PredictiveAnalyticsPanel />',
@'
<PredictiveAnalyticsPanel />

<StrategicInsightsPanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Strategic Insights wired."