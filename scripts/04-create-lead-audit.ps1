$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================="
Write-Host "Sprint 1 - Create Lead Audit"
Write-Host "==============================="

$files = @(
".\src\modules\leads\components\LeadCreateForm.tsx",
".\src\modules\leads\mutations\useCreateLead.ts",
".\src\modules\leads\services\LeadsService.ts",
".\src\modules\leads\repositories\LeadsRepository.ts",
".\src\lib\validation\lead-schema.ts",
".\src\app\api\leads\route.ts"
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
Write-Host "Searching for duplicate createLead implementations..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "createLead|CreateLead|useCreateLead|insert\\(|upsert\\(" |
Select Path,LineNumber |
Sort Path