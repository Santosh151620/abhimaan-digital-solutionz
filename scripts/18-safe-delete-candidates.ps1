$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Safe Delete Candidates"
Write-Host "========================================="

$candidates=@(
".\src\modules\leads\components\LeadModal.tsx.backup",
".\src\modules\leads\components\LeadTable.tsx.backup",
".\src\components\dashboard\LeadCardLegacy.tsx",
".\src\app\[locale]\dashboard\components\crm\PipelineOverviewLegacy.tsx"
)

foreach($item in $candidates)
{
    if(Test-Path $item)
    {
        Write-Host "[FOUND] $item"
    }
}