$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Lead Flow Audit"
Write-Host "==============="
Write-Host ""

$files = @(
".\src\app\admin\(protected)\leads\page.tsx",
".\src\modules\leads\components\LeadList.tsx",
".\src\modules\leads\hooks\useLeads.ts",
".\src\modules\leads\services\LeadsService.ts",
".\src\modules\leads\repositories\LeadsRepository.ts",
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
        Write-Host "[Missing] $file"
    }
}

Write-Host ""
Write-Host "Searching duplicate lead implementations..."
Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "class LeadsRepository|class LeadsService|function useLeads|const useLeads|LeadList" |
Select Path,LineNumber |
Sort Path