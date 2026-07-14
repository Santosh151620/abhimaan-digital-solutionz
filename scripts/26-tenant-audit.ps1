$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Tenant Enforcement Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "tenant|organization_id|organizationId|tenantId|assertTenant|withTenantFilter" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."