$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { ExecutiveTimelinePanel } from "@/modules/dashboard/executive-timeline";'

if($content -notmatch "dashboard/executive-timeline"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<ExecutiveMetricsPanel />',
@'
<ExecutiveMetricsPanel />

<ExecutiveTimelinePanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Executive Timeline wired."