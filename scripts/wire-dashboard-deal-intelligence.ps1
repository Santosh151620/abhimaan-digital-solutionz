$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { DealIntelligencePanel } from "@/modules/dashboard/deal-intelligence";'

if($content -notmatch "dashboard/deal-intelligence"){
 $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<SalesVelocityPanel />',
@'
<SalesVelocityPanel />

<DealIntelligencePanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Deal Intelligence wired."