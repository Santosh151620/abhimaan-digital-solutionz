$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { GoalTrackerPanel } from "@/modules/dashboard/goal-tracker";'

if($c -notmatch "dashboard/goal-tracker"){
$c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$c=$c.Replace(
'<CustomerSuccessPanel />',
@'
<CustomerSuccessPanel />

<GoalTrackerPanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "Goal Tracker wired."