$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { CustomerSuccessPanel } from "@/modules/dashboard/customer-success";'

if($content -notmatch "dashboard/customer-success"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<RevenueForecast {...dashboard.forecast} />',
@'
<RevenueForecast {...dashboard.forecast} />

<CustomerSuccessPanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Customer Success wired."