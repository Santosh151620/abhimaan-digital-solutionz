# ============================================================
# ADS Production Verification Check
# PowerShell 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Continue"


Write-Host ""
Write-Host "============================================"
Write-Host " ADS PRODUCTION VERIFICATION"
Write-Host "============================================"
Write-Host ""


$reportPath = ".\reports\production"

if (!(Test-Path $reportPath)) {

    New-Item `
    -ItemType Directory `
    -Path $reportPath `
    | Out-Null

}


$output = Join-Path `
$reportPath `
("production-check-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".txt")



function Run-Check {

param(
[string]$Name,
[string]$Command
)


Add-Content $output ""
Add-Content $output "============================================"
Add-Content $output $Name
Add-Content $output "============================================"


$result = Invoke-Expression $Command 2>&1


$result | Out-File $output -Append


}



"ADS Production Verification Report" |
Out-File $output


"Generated: $(Get-Date)" |
Out-File $output -Append



Run-Check `
"NODE VERSION" `
"node -v"



Run-Check `
"NPM VERSION" `
"npm -v"



Run-Check `
"GIT STATUS" `
"git status"



Run-Check `
"TYPESCRIPT CHECK" `
"npx tsc --noEmit"



Run-Check `
"ESLINT CHECK" `
"npm run lint"



Run-Check `
"PRODUCTION BUILD" `
"npm run build"



Run-Check `
"REPOSITORY AUDIT" `
".\scripts\production\repository-audit.ps1"



Run-Check `
"MIGRATION SUMMARY" `
".\scripts\production\migration-summary.ps1"



Add-Content $output ""
Add-Content $output "============================================"
Add-Content $output "VERIFICATION COMPLETE"
Add-Content $output "============================================"



Write-Host ""
Write-Host "PRODUCTION CHECK COMPLETE"
Write-Host ""
Write-Host "REPORT:"
Write-Host $output
Write-Host ""