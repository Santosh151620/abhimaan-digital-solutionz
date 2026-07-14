$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================"
Write-Host "Unused Import Audit"
Write-Host "======================================"

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "LeadModal.tsx.backup|LeadTable.tsx.backup|LeadCardLegacy|PipelineOverviewLegacy" |
Select Path,LineNumber,Line |
Sort Path