# =====================================================================
# Export-SprintLeads.ps1
# =====================================================================

$ProjectRoot=Get-Location
$OutputRoot=Join-Path $ProjectRoot "SprintExports"
$ExportRoot=Join-Path $OutputRoot "Leads-P3"

if(Test-Path $ExportRoot){
Remove-Item $ExportRoot -Recurse -Force
}

New-Item $ExportRoot -ItemType Directory|Out-Null

Copy-Item `
"$ProjectRoot\src\modules\leads" `
"$ExportRoot\src\modules" `
-Recurse `
-Force

Copy-Item `
"$ProjectRoot\src\app\api\leads" `
"$ExportRoot\src\app\api" `
-Recurse `
-Force

Write-Host ""
Write-Host "Leads export complete."