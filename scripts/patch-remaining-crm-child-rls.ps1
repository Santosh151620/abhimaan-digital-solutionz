# ============================================================
# patch-remaining-crm-child-rls.ps1
# ADS CRM Remaining Child Tables RLS Completion Patch
# PowerShell 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"


$rlsFile = ".\supabase\migrations\010_rls.sql"


if (!(Test-Path $rlsFile)) {

    throw "010_rls.sql not found"

}


$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backup = ".\supabase\migrations\010_rls.sql.remaining-child-rls-backup-$timestamp"


Copy-Item `
    $rlsFile `
    $backup `
    -Force


Write-Host "Backup created:"
Write-Host $backup


$sql = Get-Content `
    $rlsFile `
    -Raw



$marker = "-- REMAINING CRM CHILD TABLE TENANT SECURITY PATCH"



if ($sql.Contains($marker)) {

    Write-Host "Remaining CRM child patch already exists."

    exit 0

}



$patch = @'

-- ============================================================
-- REMAINING CRM CHILD TABLE TENANT SECURITY PATCH
-- ============================================================


ALTER TABLE contact_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_relationships ENABLE ROW LEVEL SECURITY;

ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_qualification ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring ENABLE ROW LEVEL SECURITY;

ALTER TABLE opportunity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_products ENABLE ROW LEVEL SECURITY;

ALTER TABLE activity_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_renewals ENABLE ROW LEVEL SECURITY;

ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attachments ENABLE ROW LEVEL SECURITY;

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;

ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_sla_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_knowledge_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;

ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;

ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;

ALTER TABLE report_executions ENABLE ROW LEVEL SECURITY;

ALTER TABLE forecast_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;



SELECT apply_crm_tenant_policy('contact_addresses');
SELECT apply_crm_tenant_policy('contact_communications');
SELECT apply_crm_tenant_policy('contact_relationships');

SELECT apply_crm_tenant_policy('lead_assignments');
SELECT apply_crm_tenant_policy('lead_qualification');
SELECT apply_crm_tenant_policy('lead_status_history');
SELECT apply_crm_tenant_policy('lead_scoring');

SELECT apply_crm_tenant_policy('opportunity_history');
SELECT apply_crm_tenant_policy('revenue_pipeline');
SELECT apply_crm_tenant_policy('opportunity_competitors');
SELECT apply_crm_tenant_policy('opportunity_products');

SELECT apply_crm_tenant_policy('activity_timeline');
SELECT apply_crm_tenant_policy('meetings');
SELECT apply_crm_tenant_policy('calls');
SELECT apply_crm_tenant_policy('emails');

SELECT apply_crm_tenant_policy('quotation_items');

SELECT apply_crm_tenant_policy('sales_order_items');

SELECT apply_crm_tenant_policy('contract_milestones');
SELECT apply_crm_tenant_policy('contract_renewals');

SELECT apply_crm_tenant_policy('product_pricing');
SELECT apply_crm_tenant_policy('product_bundles');
SELECT apply_crm_tenant_policy('product_attachments');

SELECT apply_crm_tenant_policy('invoice_items');

SELECT apply_crm_tenant_policy('payment_transactions');

SELECT apply_crm_tenant_policy('project_members');
SELECT apply_crm_tenant_policy('project_phases');
SELECT apply_crm_tenant_policy('project_milestones');
SELECT apply_crm_tenant_policy('project_deliverables');
SELECT apply_crm_tenant_policy('time_entries');
SELECT apply_crm_tenant_policy('resource_allocations');
SELECT apply_crm_tenant_policy('project_risks');

SELECT apply_crm_tenant_policy('ticket_comments');
SELECT apply_crm_tenant_policy('ticket_sla_tracking');
SELECT apply_crm_tenant_policy('ticket_escalations');
SELECT apply_crm_tenant_policy('ticket_knowledge_links');

SELECT apply_crm_tenant_policy('workflow_executions');
SELECT apply_crm_tenant_policy('workflow_conditions');
SELECT apply_crm_tenant_policy('workflow_actions');

SELECT apply_crm_tenant_policy('dashboard_widgets');

SELECT apply_crm_tenant_policy('kpi_values');

SELECT apply_crm_tenant_policy('report_executions');

SELECT apply_crm_tenant_policy('forecast_results');

SELECT apply_crm_tenant_policy('entity_tags');

SELECT apply_crm_tenant_policy('custom_field_values');


'@



$commitIndex = $sql.LastIndexOf("COMMIT;")


if ($commitIndex -lt 0) {

    Write-Host "COMMIT marker not found. Appending patch."

    $sql = $sql + "`r`n" + $patch

}

else {

    $sql = 
        $sql.Substring(0,$commitIndex) +
        $patch +
        "`r`nCOMMIT;"


}



Set-Content `
    $rlsFile `
    $sql `
    -Encoding UTF8



Write-Host ""
Write-Host "Remaining CRM child RLS patch completed successfully."
Write-Host ""