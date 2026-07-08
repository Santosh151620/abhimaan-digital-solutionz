$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { ExecutiveMetricsPanel } from "@/modules/dashboard/executive";'

if($content -notmatch "dashboard/executive"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$anchor='<ExecutivePanel executive={dashboard.executive} />'

$panel=@'

<ExecutivePanel executive={dashboard.executive} />

<ExecutiveMetricsPanel />

'@

$content=$content.Replace($anchor,$panel)

Set-Content -LiteralPath $page -Value $content

Write-Host "Executive Metrics wired."