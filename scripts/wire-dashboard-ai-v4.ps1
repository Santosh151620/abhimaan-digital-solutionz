$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw


$imports=@'
import { RiskAlertsPanel } from "@/modules/dashboard/risk-alerts";
import { AISummaryPanel } from "@/modules/dashboard/ai-summary";
import { AIScorePanel } from "@/modules/dashboard/ai-score";
'@


if ($content -notmatch "risk-alerts") {

    $content=$content -replace `
    'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
    ('import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";' + "`r`n" + $imports)

}


$anchor='<section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">'


$block=@'

<section className="grid gap-6 xl:grid-cols-3">
  <AIScorePanel />
  <AISummaryPanel />
  <RiskAlertsPanel />
</section>

'@


if ($content -notmatch "AIScorePanel") {

    $content=$content -replace [regex]::Escape($anchor), ($block + $anchor)

}


Set-Content -LiteralPath $page -Value $content

Write-Host "Dashboard AI V4 wired."