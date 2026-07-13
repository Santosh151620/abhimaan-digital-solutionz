$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Import Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "LeadCardLegacy|PipelineOverviewLegacy|LeadModal.tsx.backup|LeadTable.tsx.backup" |
Select Path,LineNumber,Line |
Sort Path