Write-Host ""
Write-Host "======================================="
Write-Host " Phase 3.5 - Utility Consolidation"
Write-Host "======================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

$patterns = @(
"formatDate",
"formatCurrency",
"formatAmount",
"formatPhone",
"formatNumber",
"formatAddress",
"slugify",
"generateSlug",
"uuid",
"randomUUID",
"deepClone",
"capitalize",
"titleCase",
"isEmpty",
"parseDate",
"safeParse",
"getInitials",
"statusColor"
)

foreach($pattern in $patterns){

    Write-Host ""
    Write-Host "=============================="
    Write-Host $pattern
    Write-Host "=============================="

    Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
    Select-String "\b$pattern\b" |
    Select Path,LineNumber

}

Write-Host ""
Write-Host "Utility folders"
Get-ChildItem "$root\src" -Recurse -Directory |
Where-Object{
    $_.Name -match "util|helper|common"
} |
Select FullName

Write-Host ""
Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""
Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "Utility Audit Complete."