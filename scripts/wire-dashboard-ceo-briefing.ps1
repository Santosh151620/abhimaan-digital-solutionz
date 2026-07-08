$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { CEOBriefingPanel } from "@/modules/dashboard/ceo-briefing";'

if($c -notmatch "dashboard/ceo-briefing"){

$c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)

}

$c=$c.Replace(
'<ExecutiveTimelinePanel />',
@'
<ExecutiveTimelinePanel />

<CEOBriefingPanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "CEO Briefing wired."