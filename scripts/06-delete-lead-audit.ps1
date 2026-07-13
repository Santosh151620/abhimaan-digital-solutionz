$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================="
Write-Host "Sprint 1 - Delete Lead Audit"
Write-Host "======================================="

$files = @(
".\src\modules\leads\components\LeadTable.tsx",
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
Write-Host "Searching delete implementations..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "deleteLead|removeLead|delete\(|DELETE|softDelete" |
Select Path,LineNumber |
Sort Path