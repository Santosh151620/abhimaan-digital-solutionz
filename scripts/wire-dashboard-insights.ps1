$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { InsightsPanel } from "@/modules/dashboard/insights";'

if($content -notmatch "dashboard/insights"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$anchor='<section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">'

$panel=@'

<section className="grid gap-6">
  <InsightsPanel />
</section>

'@

if($content -notmatch "InsightsPanel"){
    $content=$content.Replace($anchor,$panel+$anchor)
}

Set-Content -LiteralPath $page -Value $content

Write-Host "Dashboard Insights wired."