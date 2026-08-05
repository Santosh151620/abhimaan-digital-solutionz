# ============================================================
# ADS CRM Child Table RLS Patch
# Adds missing CRM child table RLS before final COMMIT
# ============================================================

$File = ".\supabase\migrations\010_rls.sql"

if (!(Test-Path $File)) {
    Write-Host "ERROR: File not found: $File" -ForegroundColor Red
    exit 1
}


# Backup

$Backup = "$File.backup-$(Get-Date -Format yyyyMMdd-HHmmss)"

Copy-Item `
    -Path $File `
    -Destination $Backup


Write-Host "Backup created:"
Write-Host $Backup



$content = Get-Content `
    -Path $File `
    -Raw



if ($content -match "EXTENDED CRM CHILD TABLE TENANT SECURITY") {

    Write-Host "Patch already exists. Nothing changed." -ForegroundColor Yellow
    exit 0

}



$Patch = @'

-- ============================================================
-- EXTENDED CRM CHILD TABLE TENANT SECURITY
-- ============================================================


-- Tables with organization_id missing RLS protection

ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;



SELECT apply_crm_tenant_policy('lead_sources');
SELECT apply_crm_tenant_policy('lead_statuses');
SELECT apply_crm_tenant_policy('sales_forecasts');
SELECT apply_crm_tenant_policy('product_categories');
SELECT apply_crm_tenant_policy('product_inventory');
SELECT apply_crm_tenant_policy('credit_notes');
SELECT apply_crm_tenant_policy('refunds');
SELECT apply_crm_tenant_policy('revenue_recognition');
SELECT apply_crm_tenant_policy('ticket_categories');
SELECT apply_crm_tenant_policy('ticket_priorities');
SELECT apply_crm_tenant_policy('sla_definitions');
SELECT apply_crm_tenant_policy('ai_assistants');
SELECT apply_crm_tenant_policy('ai_conversations');
SELECT apply_crm_tenant_policy('ai_messages');
SELECT apply_crm_tenant_policy('ai_prompts');
SELECT apply_crm_tenant_policy('ai_recommendations');
SELECT apply_crm_tenant_policy('workflow_definitions');
SELECT apply_crm_tenant_policy('dashboards');
SELECT apply_crm_tenant_policy('kpi_definitions');
SELECT apply_crm_tenant_policy('reports');
SELECT apply_crm_tenant_policy('executive_snapshots');
SELECT apply_crm_tenant_policy('forecast_models');
SELECT apply_crm_tenant_policy('notifications');
SELECT apply_crm_tenant_policy('saved_filters');
SELECT apply_crm_tenant_policy('custom_fields');


'@



$content = $content.Replace(
    "COMMIT;",
    "$Patch`r`nCOMMIT;"
)



Set-Content `
    -Path $File `
    -Value $content `
    -Encoding UTF8



Write-Host ""
Write-Host "CRM child RLS patch completed successfully." -ForegroundColor Green