$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=Get-Content -LiteralPath $page -Raw

$import='import { BusinessHealthPanel } from "@/modules/dashboard/business-health";'

if($content -notmatch "dashboard/business-health"){
    $content=$content -replace `
'import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";',
("import AnalyticsCards from `"@/modules/dashboard/components/AnalyticsCards`";`r`n"+$import)
}

$content=$content.Replace(
'<CRMHealthCard />',
@'
<CRMHealthCard />

<BusinessHealthPanel />
'@
)

Set-Content -LiteralPath $page -Value $content

Write-Host "Business Health wired."