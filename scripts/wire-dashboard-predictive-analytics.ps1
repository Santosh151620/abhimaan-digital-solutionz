$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { PredictiveAnalyticsPanel } from "@/modules/dashboard/predictive-analytics";'

if($content -notmatch "dashboard/predictive-analytics"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<SalesCopilot data={dashboard.copilot} />',
@'
<SalesCopilot data={dashboard.copilot} />

<PredictiveAnalyticsPanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Predictive Analytics wired."