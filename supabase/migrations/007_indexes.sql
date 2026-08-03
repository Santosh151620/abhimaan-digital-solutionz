-- ============================================================
-- 007_indexes.sql
-- PART 1
-- PLATFORM + IDENTITY INDEXES
-- ============================================================

BEGIN;


-- ============================================================
-- ORGANIZATION INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_organizations_status
ON organizations(status);


CREATE INDEX IF NOT EXISTS idx_organizations_created
ON organizations(created_at);



-- ============================================================
-- PROFILE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email
ON profiles(email);


CREATE INDEX IF NOT EXISTS idx_profiles_status
ON profiles(status);


CREATE INDEX IF NOT EXISTS idx_profiles_created
ON profiles(created_at);



-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_org_members_org
ON organization_members(organization_id);


CREATE INDEX IF NOT EXISTS idx_org_members_user
ON organization_members(user_id);


CREATE INDEX IF NOT EXISTS idx_org_members_role
ON organization_members(role_id);



CREATE INDEX IF NOT EXISTS idx_org_members_active
ON organization_members(
    organization_id,
    user_id
)
WHERE deleted_at IS NULL;



-- ============================================================
-- ADMIN RBAC INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_admin_roles_active
ON admin_roles(status)
WHERE deleted_at IS NULL;



CREATE INDEX IF NOT EXISTS idx_admin_roles_org_active
ON admin_roles(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_admin_user_roles_lookup
ON admin_user_roles(
    user_id,
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_admin_role_permissions_lookup
ON admin_role_permissions(role_id);



CREATE INDEX IF NOT EXISTS idx_admin_permissions_key_lookup
ON admin_permissions(permission_key);



-- ============================================================
-- USER PERMISSION OVERRIDE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_permission_override_lookup
ON admin_user_permission_overrides(
    user_id,
    organization_id,
    permission_id
);



-- ============================================================
-- DELEGATION INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_role_delegation_active
ON admin_role_delegations(
    organization_id,
    is_active
);



CREATE INDEX IF NOT EXISTS idx_role_delegation_dates
ON admin_role_delegations(
    start_date,
    end_date
);



-- ============================================================
-- AUDIT INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_audit_events_org_time
ON admin_audit_events(
    organization_id,
    created_at DESC
);



CREATE INDEX IF NOT EXISTS idx_audit_events_action
ON admin_audit_events(action);



CREATE INDEX IF NOT EXISTS idx_audit_events_module
ON admin_audit_events(module_name);



CREATE INDEX IF NOT EXISTS idx_audit_events_entity
ON admin_audit_events(
    entity_type,
    entity_id
);



-- ============================================================
-- CONFIGURATION INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_platform_settings_key
ON admin_platform_settings(setting_key);



CREATE INDEX IF NOT EXISTS idx_org_settings_lookup
ON admin_organization_settings(
    organization_id,
    setting_key
);



CREATE INDEX IF NOT EXISTS idx_configuration_registry_scope
ON admin_configuration_registry(scope);



-- ============================================================
-- FEATURE FLAG INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_feature_flags_key
ON admin_feature_flags(feature_key);



CREATE INDEX IF NOT EXISTS idx_feature_assignment_lookup
ON admin_feature_flag_assignments(
    organization_id,
    feature_flag_id
);



-- ============================================================
-- LICENSE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_org_license_lookup
ON admin_organization_licenses(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_license_plan_active
ON admin_license_plans(is_active);



-- ============================================================
-- LOOKUP INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_lookup_values_active
ON lookup_values(
    group_id,
    is_active
);



CREATE INDEX IF NOT EXISTS idx_lookup_countries_active
ON lookup_countries(is_active);



CREATE INDEX IF NOT EXISTS idx_lookup_states_country_active
ON lookup_states(
    country_id,
    is_active
);



CREATE INDEX IF NOT EXISTS idx_lookup_cities_state_active
ON lookup_cities(
    state_id,
    is_active
);



COMMIT;
-- ============================================================
-- 007_indexes.sql
-- PART 2
-- CRM PERFORMANCE INDEXES
-- ============================================================

BEGIN;


-- ============================================================
-- COMPANIES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_companies_org
ON companies(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_companies_status
ON companies(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_companies_name_search
ON companies
USING gin(
    to_tsvector(
        'english',
        name
    )
);



CREATE INDEX IF NOT EXISTS idx_companies_created
ON companies(
    organization_id,
    created_at DESC
);



-- ============================================================
-- CONTACTS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contacts_org
ON contacts(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_contacts_company
ON contacts(
    company_id
);



CREATE INDEX IF NOT EXISTS idx_contacts_email
ON contacts(
    email
);



CREATE INDEX IF NOT EXISTS idx_contacts_name_search
ON contacts
USING gin(
    to_tsvector(
        'english',
        first_name || ' ' || last_name
    )
);



-- ============================================================
-- LEADS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_leads_org
ON leads(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_leads_status
ON leads(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_leads_owner
ON leads(
    assigned_to
);



CREATE INDEX IF NOT EXISTS idx_leads_source
ON leads(
    source_id
);



CREATE INDEX IF NOT EXISTS idx_leads_created
ON leads(
    organization_id,
    created_at DESC
);



CREATE INDEX IF NOT EXISTS idx_leads_search
ON leads
USING gin(
    to_tsvector(
        'english',
        coalesce(first_name,'')
        ||
        ' '
        ||
        coalesce(last_name,'')
        ||
        ' '
        ||
        coalesce(email,'')
    )
);



-- ============================================================
-- OPPORTUNITIES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_opportunities_org
ON opportunities(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_opportunities_stage
ON opportunities(
    pipeline_stage_id
);



CREATE INDEX IF NOT EXISTS idx_opportunities_owner
ON opportunities(
    owner_id
);



CREATE INDEX IF NOT EXISTS idx_opportunities_value
ON opportunities(
    organization_id,
    amount DESC
);



CREATE INDEX IF NOT EXISTS idx_opportunities_close_date
ON opportunities(
    expected_close_date
);



-- ============================================================
-- SALES PIPELINE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_pipeline_org
ON sales_pipelines(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_pipeline_stage_order
ON pipeline_stages(
    pipeline_id,
    sort_order
);



-- ============================================================
-- ACTIVITIES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activity_entity
ON activities(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS idx_activity_org_time
ON activities(
    organization_id,
    created_at DESC
);



CREATE INDEX IF NOT EXISTS idx_activity_owner
ON activities(
    assigned_to
);



-- ============================================================
-- NOTES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_notes_entity
ON notes(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS idx_notes_org
ON notes(
    organization_id
);



-- ============================================================
-- ATTACHMENTS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_attachments_entity
ON attachments(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS idx_attachments_org
ON attachments(
    organization_id
);



-- ============================================================
-- TASKS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tasks_org
ON tasks(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_tasks_assignee
ON tasks(
    assigned_to
);



CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_tasks_due_date
ON tasks(
    due_date
);



-- ============================================================
-- QUOTATIONS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_quotes_org
ON quotations(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_quotes_customer
ON quotations(
    customer_id
);



CREATE INDEX IF NOT EXISTS idx_quotes_status
ON quotations(
    status
);



-- ============================================================
-- CONTRACTS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contracts_org
ON contracts(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_contracts_customer
ON contracts(
    customer_id
);



CREATE INDEX IF NOT EXISTS idx_contracts_expiry
ON contracts(
    expiry_date
);



-- ============================================================
-- PROJECTS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_org
ON projects(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_projects_status
ON projects(
    status
);



CREATE INDEX IF NOT EXISTS idx_projects_manager
ON projects(
    project_manager_id
);



-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tickets_org
ON tickets(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_tickets_status
ON tickets(
    status
);



CREATE INDEX IF NOT EXISTS idx_tickets_priority
ON tickets(
    priority
);



-- ============================================================
-- REVENUE INTELLIGENCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_revenue_org_date
ON revenue_transactions(
    organization_id,
    transaction_date DESC
);



CREATE INDEX IF NOT EXISTS idx_payments_customer
ON payments(
    customer_id
);



CREATE INDEX IF NOT EXISTS idx_invoices_status
ON invoices(
    organization_id,
    status
);



COMMIT;
-- ============================================================
-- 007_indexes.sql
-- PART 3 FINAL
-- ERP + GLOBAL PERFORMANCE INDEXES
-- ============================================================

BEGIN;


-- ============================================================
-- PROCUREMENT
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_vendors_org
ON vendors(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_vendors_status
ON vendors(
    organization_id,
    status
);



CREATE INDEX IF NOT EXISTS idx_purchase_orders_org
ON purchase_orders(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_purchase_orders_status
ON purchase_orders(
    status
);



CREATE INDEX IF NOT EXISTS idx_purchase_order_vendor
ON purchase_orders(
    vendor_id
);



-- ============================================================
-- INVENTORY
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_inventory_items_org
ON inventory_items(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_inventory_items_category
ON inventory_items(
    category_id
);



CREATE INDEX IF NOT EXISTS idx_inventory_stock_location
ON inventory_stock(
    warehouse_id,
    item_id
);



CREATE INDEX IF NOT EXISTS idx_inventory_transactions
ON inventory_transactions(
    organization_id,
    transaction_date DESC
);



-- ============================================================
-- WAREHOUSE MANAGEMENT
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_warehouses_org
ON warehouses(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_storage_locations
ON storage_locations(
    warehouse_id
);



-- ============================================================
-- MANUFACTURING
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_production_orders_org
ON production_orders(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_production_orders_status
ON production_orders(
    status
);



CREATE INDEX IF NOT EXISTS idx_quality_checks
ON quality_checks(
    production_order_id
);



-- ============================================================
-- FINANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_accounts_org
ON accounts(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_transactions_org_date
ON financial_transactions(
    organization_id,
    transaction_date DESC
);



CREATE INDEX IF NOT EXISTS idx_invoice_customer
ON invoices(
    customer_id
);



CREATE INDEX IF NOT EXISTS idx_invoice_due_date
ON invoices(
    due_date
);



CREATE INDEX IF NOT EXISTS idx_expenses_org
ON expenses(
    organization_id,
    expense_date DESC
);



CREATE INDEX IF NOT EXISTS idx_payments_status
ON payments(
    organization_id,
    status
);



-- ============================================================
-- HR
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_employees_org
ON employees(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_employees_status
ON employees(
    status
);



CREATE INDEX IF NOT EXISTS idx_attendance_employee_date
ON attendance(
    employee_id,
    attendance_date
);



CREATE INDEX IF NOT EXISTS idx_leave_requests_employee
ON leave_requests(
    employee_id
);



-- ============================================================
-- ASSET MANAGEMENT
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_assets_org
ON assets(
    organization_id
);



CREATE INDEX IF NOT EXISTS idx_assets_category
ON assets(
    category_id
);



CREATE INDEX IF NOT EXISTS idx_asset_assignments
ON asset_assignments(
    asset_id,
    employee_id
);



CREATE INDEX IF NOT EXISTS idx_asset_maintenance
ON asset_maintenance(
    asset_id,
    scheduled_date
);



-- ============================================================
-- ADMIN MONITORING
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_error_logs_time
ON admin_error_logs(
    created_at DESC
);



CREATE INDEX IF NOT EXISTS idx_job_execution_time
ON admin_job_executions(
    created_at DESC
);



CREATE INDEX IF NOT EXISTS idx_health_metrics_time
ON admin_platform_health_metrics(
    recorded_at DESC
);



-- ============================================================
-- GLOBAL ENTITY SEARCH
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activities_metadata
ON activities
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_notes_metadata
ON notes
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_attachments_metadata
ON attachments
USING gin(metadata);



-- ============================================================
-- JSONB OPTIMIZATION
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_company_metadata
ON companies
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_contact_metadata
ON contacts
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_lead_metadata
ON leads
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_opportunity_metadata
ON opportunities
USING gin(metadata);



CREATE INDEX IF NOT EXISTS idx_workflow_metadata
ON workflows
USING gin(configuration);



-- ============================================================
-- FINAL INDEX VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS (

    SELECT 1
    FROM pg_indexes
    WHERE indexname='idx_leads_org'

)

THEN

    RAISE EXCEPTION
    'CRM indexes missing';

END IF;



IF NOT EXISTS (

    SELECT 1
    FROM pg_indexes
    WHERE indexname='idx_inventory_items_org'

)

THEN

    RAISE EXCEPTION
    'ERP indexes missing';

END IF;



IF NOT EXISTS (

    SELECT 1
    FROM pg_indexes
    WHERE indexname='idx_admin_audit_org_time'

)

THEN

    RAISE EXCEPTION
    'Admin indexes missing';

END IF;



END $$;



COMMIT;