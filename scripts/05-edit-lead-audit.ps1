$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================="
Write-Host "Sprint 1 - Edit Lead Audit"
Write-Host "==============================="

$files = @(
".\src\modules\leads\components\LeadCreateForm.tsx",
".\src\modules\leads\mutations\useUpdateLead.ts",
".\src\modules\leads\hooks\useLeadById.ts",
".\src\modules\leads\services\LeadsService.ts",
".\src\modules\leads\repositories\LeadsRepository.ts",
".\src\app\api\leads\[id]\route.ts"
)

foreach($file in $files)
{
    if(Test-Path $file)
    {
        Write-Host "[OK] $file"
    }
    else
    {
        Write-Host "[MISSING] $file"
    }
}

Write-Host ""
Write-Host "Searching update implementations..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "updateLead|useUpdateLead|update\\(|patch\\(" |
Select Path,LineNumber |
Sort Path