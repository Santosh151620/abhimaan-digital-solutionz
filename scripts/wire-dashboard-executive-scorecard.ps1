$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { ExecutiveScorecardPanel } from "@/modules/dashboard/executive-scorecard";'

if($c -notmatch "dashboard/executive-scorecard"){

 $c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)

}

$c=$c.Replace(
'<CommandCenterPanel />',
@'
<CommandCenterPanel />

<ExecutiveScorecardPanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "Executive Scorecard wired."