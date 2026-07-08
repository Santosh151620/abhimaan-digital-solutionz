$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { MarketIntelligencePanel } from "@/modules/dashboard/market-intelligence";'

if($c -notmatch "dashboard/market-intelligence"){

$c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)

}

$c=$c.Replace(
'<ExecutiveScorecardPanel />',
@'
<ExecutiveScorecardPanel />

<MarketIntelligencePanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "Market Intelligence wired."