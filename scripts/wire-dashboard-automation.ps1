$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { AutomationPanel } from "@/modules/dashboard/automation";'

if($content -notmatch "dashboard/automation"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
"import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";
$import"
}

$anchor='<section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">'

$block=@'

<section className="grid gap-6">
  <AutomationPanel />
</section>

'@

if($content -notmatch "AutomationPanel \/>"){
    $content=$content.Replace($anchor,$block + $anchor)
}

Set-Content -LiteralPath $page -Value $content

Write-Host "Dashboard Automation wired."