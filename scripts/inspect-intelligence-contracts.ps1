cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host "=== Dashboard Service ==="
Get-Content -LiteralPath ".\src\services\dashboard.ts"

Write-Host ""
Write-Host "=== Intelligence Components ==="

$files = @(
".\src\modules\dashboard\components\ExecutiveSummaryCard.tsx",
".\src\modules\dashboard\components\PipelineIntelligenceCard.tsx",
".\src\modules\dashboard\components\CRMHealthCard.tsx",
".\src\modules\dashboard\components\ActionCenterCard.tsx"
)

foreach($file in $files){
    Write-Host ""
    Write-Host "----- $file -----"
    Get-Content -LiteralPath $file
}

Write-Host ""
Write-Host "=== Dashboard Types Search ==="

Get-ChildItem ".\src" -Recurse -Include "*.ts","*.tsx" |
Select-String -Pattern "Dashboard|Snapshot|metrics|pipeline|copilot|executive" |
Select-Object Path,LineNumber,Line