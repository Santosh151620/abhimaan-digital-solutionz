$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { SalesVelocityPanel } from "@/modules/dashboard/sales-velocity";'

if($content -notmatch "dashboard/sales-velocity"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<PipelineOverview data={dashboard.pipeline} />',
@'
<PipelineOverview data={dashboard.pipeline} />

<SalesVelocityPanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Sales Velocity wired."