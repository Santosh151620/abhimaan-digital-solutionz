$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { BoardSummaryPanel } from "@/modules/dashboard/board-summary";'

if($c -notmatch "dashboard/board-summary"){

$c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)

}

$c=$c.Replace(
'<CEOBriefingPanel />',
@'
<CEOBriefingPanel />

<BoardSummaryPanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "Board Summary wired."