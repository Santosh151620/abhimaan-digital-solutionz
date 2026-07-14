$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Validation Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "zod|safeParse|parse|CompaniesSchema|lead-schema" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."