$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backup = "$file.core-crm-backup-$timestamp"


Copy-Item $file $backup


Write-Host ""
Write-Host "Backup created:"
Write-Host $backup



$content = Get-Content $file -Raw



$marker = "-- FINAL RLS VALIDATION"


if ($content.Contains("-- CORE CRM TENANT SECURITY PATCH"))
{
    Write-Host ""
    Write-Host "Core CRM patch already exists. Nothing changed."
    exit
}



$patch = @'

-- ============================================================
-- CORE CRM TENANT SECURITY PATCH
-- ============================================================


SELECT apply_crm_tenant_policy('companies');

SELECT apply_crm_tenant_policy('contacts');

SELECT apply_crm_tenant_policy('leads');

SELECT apply_crm_tenant_policy('opportunities');

SELECT apply_crm_tenant_policy('sales_pipelines');

SELECT apply_crm_tenant_policy('pipeline_stages');

SELECT apply_crm_tenant_policy('activities');

SELECT apply_crm_tenant_policy('notes');

SELECT apply_crm_tenant_policy('attachments');

SELECT apply_crm_tenant_policy('tasks');

SELECT apply_crm_tenant_policy('quotations');

SELECT apply_crm_tenant_policy('contracts');

SELECT apply_crm_tenant_policy('projects');

SELECT apply_crm_tenant_policy('tickets');

SELECT apply_crm_tenant_policy('products');

SELECT apply_crm_tenant_policy('pricing_rules');

SELECT apply_crm_tenant_policy('invoices');

SELECT apply_crm_tenant_policy('payments');

SELECT apply_crm_tenant_policy('revenue_transactions');


'@



if (-not $content.Contains($marker))
{
    Write-Host ""
    Write-Host "Final validation marker not found."
    Write-Host "Appending patch before COMMIT."

    $content = $content.Replace(
        "COMMIT;",
        $patch + "`r`n`r`nCOMMIT;"
    )

    Set-Content `
    -Path $file `
    -Value $content `
    -Encoding UTF8

    Write-Host ""
    Write-Host "Core CRM tenant RLS patch completed successfully."
    exit
}


$content = $content.Replace(
    $marker,
    $patch + "`r`n" + $marker
)



Set-Content `
-Path $file `
-Value $content `
-Encoding UTF8



Write-Host ""
Write-Host "Core CRM tenant RLS patch completed successfully."