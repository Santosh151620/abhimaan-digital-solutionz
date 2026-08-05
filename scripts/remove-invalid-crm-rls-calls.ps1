$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backup = "$file.invalid-calls-backup-$timestamp"


Copy-Item $file $backup


Write-Host ""
Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


$remove = @(
"SELECT apply_crm_tenant_policy('sales_pipelines');",
"SELECT apply_crm_tenant_policy('pricing_rules');",
"SELECT apply_crm_tenant_policy('revenue_transactions');"
)


foreach($line in $remove)
{
    $content = $content.Replace($line + "`r`n","")
    $content = $content.Replace($line + "`n","")
}


Set-Content `
-Path $file `
-Value $content `
-Encoding UTF8


Write-Host ""
Write-Host "Invalid CRM RLS calls removed."