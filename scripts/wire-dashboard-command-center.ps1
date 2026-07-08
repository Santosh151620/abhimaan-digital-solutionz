$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$c=Get-Content -LiteralPath $page -Raw

$import='import { CommandCenterPanel } from "@/modules/dashboard/command-center";'

if($c -notmatch "dashboard/command-center"){

$c=$c -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)

}

$c=$c.Replace(
'<DashboardEmptyState />',
@'
<DashboardEmptyState />

<CommandCenterPanel />
'@
)

Set-Content -LiteralPath $page -Value $c

Write-Host "Command Center wired."