$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================="
Write-Host "Sprint 1.2 - Lead List Review"
Write-Host "==============================="
Write-Host ""

$patterns = @(
"LeadList",
"LeadTable",
"useLeads",
"LeadsService",
"LeadsRepository",
"LeadFilters",
"LeadSearch"
)

foreach($p in $patterns)
{
    Write-Host ""
    Write-Host "===== $p ====="

    Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
    Select-String $p |
    Select Path,LineNumber,Line
}

Write-Host ""
Write-Host "Review Complete."