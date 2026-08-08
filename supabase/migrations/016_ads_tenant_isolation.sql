-- ============================================================
-- ADS V1 TENANT ISOLATION
-- Migration: 016_ads_tenant_isolation.sql
--
-- PURPOSE
--   Upgrade the existing remote legacy schema to tenant-safe
--   organization isolation without deleting or renaming data.
--
-- RULES
--   1. NEVER drop application tables.
--   2. NEVER delete application data.
--   3. NEVER rename application entities.
--   4. Preserve existing CRM functionality.
--   5. Add organization_id to tenant-owned entities.
--   6. Backfill existing data safely.
--   7. Enable RLS on tenant-owned tables.
--   8. Enforce organization membership through auth.uid().
--   9. Keep organizations / profiles / organization_members special.
--  10. Migration is safe to execute more than once.
--
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

-- ============================================================
-- 1. ORGANIZATION FOUNDATION
-- ============================================================

ALTER TABLE organizations
    ADD COLUMN IF NOT EXISTS legal_name varchar(300),
    ADD COLUMN IF NOT EXISTS code varchar(50),
    ADD COLUMN IF NOT EXISTS email varchar(255),
    ADD COLUMN IF NOT EXISTS phone varchar(50),
    ADD COLUMN IF NOT EXISTS website varchar(255),
    ADD COLUMN IF NOT EXISTS logo_url text,
    ADD COLUMN IF NOT EXISTS industry_id uuid,
    ADD COLUMN IF NOT EXISTS timezone varchar(100),
    ADD COLUMN IF NOT EXISTS currency_code varchar(10),
    ADD COLUMN IF NOT EXISTS language_code varchar(10),
    ADD COLUMN IF NOT EXISTS country_code varchar(10),
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS subscription_plan varchar(100),
    ADD COLUMN IF NOT EXISTS subscription_expiry timestamptz,
    ADD COLUMN IF NOT EXISTS created_by uuid,
    ADD COLUMN IF NOT EXISTS updated_by uuid,
    ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
    ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS first_name varchar(150),
    ADD COLUMN IF NOT EXISTS last_name varchar(150),
    ADD COLUMN IF NOT EXISTS display_name varchar(250),
    ADD COLUMN IF NOT EXISTS mobile varchar(40),
    ADD COLUMN IF NOT EXISTS job_title varchar(200),
    ADD COLUMN IF NOT EXISTS department varchar(150),
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS last_login timestamptz,
    ADD COLUMN IF NOT EXISTS created_by uuid,
    ADD COLUMN IF NOT EXISTS updated_by uuid,
    ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
    ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ============================================================
-- 2. TENANT COLUMNS
-- ============================================================

ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE attachments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE contacts
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE opportunities
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE quotations
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE quotation_items
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE contracts
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE invoice_items
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE support_tickets
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ticket_categories
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ticket_priorities
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ticket_comments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE product_categories
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE tags
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE entity_tags
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE saved_filters
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE custom_fields
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE custom_field_values
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE sales_forecasts
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE revenue_pipeline
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE workflow_definitions
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE workflow_executions
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE dashboards
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE reports
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ai_assistants
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ai_conversations
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE ai_recommendations
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE fiscal_years
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE departments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE vendors
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE warehouses
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE inventory
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE website_settings
    ADD COLUMN IF NOT EXISTS organization_id uuid;

-- ============================================================
-- 3. BACKFILL EXISTING DATA
--
-- Current remote database has exactly one organization.
-- This makes legacy rows deterministic and safe to migrate.
-- ============================================================

DO $$
DECLARE
    v_org_id uuid;
    v_org_count integer;
BEGIN

    SELECT COUNT(*), MIN(id)
    INTO v_org_count, v_org_id
    FROM organizations;

    IF v_org_count = 1 THEN

        -- Existing legacy CRM rows.
        UPDATE leads
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE clients
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE projects
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE payments
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE activities
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE notes
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE attachments
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE tasks
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE notifications
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE companies
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE contacts
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE opportunities
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE quotations
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE quotation_items
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE contracts
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE invoices
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE invoice_items
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE support_tickets
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ticket_categories
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ticket_priorities
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ticket_comments
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE products
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE product_categories
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE tags
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE entity_tags
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE saved_filters
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE custom_fields
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE custom_field_values
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE sales_forecasts
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE revenue_pipeline
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE workflow_definitions
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE workflow_executions
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE dashboards
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE reports
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ai_assistants
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ai_conversations
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE ai_recommendations
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE fiscal_years
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE departments
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE vendors
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE warehouses
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE inventory
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        UPDATE website_settings
        SET organization_id = v_org_id
        WHERE organization_id IS NULL;

        -- Profiles are mapped through organization membership.
        UPDATE profiles p
        SET organization_id = om.organization_id
        FROM organization_members om
        WHERE om.profile_id = p.id
          AND p.organization_id IS NULL;

    ELSIF v_org_count > 1 THEN

        -- Never guess tenant ownership in a multi-organization database.
        RAISE NOTICE
            'Multiple organizations detected. Existing tenant rows were not blindly reassigned.';

    ELSE

        RAISE NOTICE
            'No organization exists. Tenant backfill deferred.';

    END IF;

END;
$$;

-- ============================================================
-- 4. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_leads_organization_id
    ON leads(organization_id);

CREATE INDEX IF NOT EXISTS idx_clients_organization_id
    ON clients(organization_id);

CREATE INDEX IF NOT EXISTS idx_projects_organization_id
    ON projects(organization_id);

CREATE INDEX IF NOT EXISTS idx_payments_organization_id
    ON payments(organization_id);

CREATE INDEX IF NOT EXISTS idx_activities_organization_id
    ON activities(organization_id);

CREATE INDEX IF NOT EXISTS idx_notes_organization_id
    ON notes(organization_id);

CREATE INDEX IF NOT EXISTS idx_attachments_organization_id
    ON attachments(organization_id);

CREATE INDEX IF NOT EXISTS idx_tasks_organization_id
    ON tasks(organization_id);

CREATE INDEX IF NOT EXISTS idx_notifications_organization_id
    ON notifications(organization_id);

CREATE INDEX IF NOT EXISTS idx_companies_organization_id
    ON companies(organization_id);

CREATE INDEX IF NOT EXISTS idx_contacts_organization_id
    ON contacts(organization_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_organization_id
    ON opportunities(organization_id);

CREATE INDEX IF NOT EXISTS idx_quotations_organization_id
    ON quotations(organization_id);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id
    ON contracts(organization_id);

CREATE INDEX IF NOT EXISTS idx_invoices_organization_id
    ON invoices(organization_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_organization_id
    ON support_tickets(organization_id);

CREATE INDEX IF NOT EXISTS idx_products_organization_id
    ON products(organization_id);

CREATE INDEX IF NOT EXISTS idx_tags_organization_id
    ON tags(organization_id);

CREATE INDEX IF NOT EXISTS idx_saved_filters_organization_id
    ON saved_filters(organization_id);

CREATE INDEX IF NOT EXISTS idx_custom_fields_organization_id
    ON custom_fields(organization_id);

CREATE INDEX IF NOT EXISTS idx_custom_field_values_organization_id
    ON custom_field_values(organization_id);

CREATE INDEX IF NOT EXISTS idx_entity_tags_organization_id
    ON entity_tags(organization_id);

-- ============================================================
-- 5. RLS ENABLEMENT
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

ALTER TABLE sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_pipeline ENABLE ROW LEVEL SECURITY;

ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

ALTER TABLE ai_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

ALTER TABLE fiscal_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. REMOVE LEGACY BROAD POLICIES
--
-- These existing policies are dangerously permissive.
-- Policy removal is NOT destructive to application data.
-- ============================================================

DROP POLICY IF EXISTS allow_clients_all ON clients;
DROP POLICY IF EXISTS allow_payments_all ON payments;
DROP POLICY IF EXISTS allow_projects_all ON projects;
DROP POLICY IF EXISTS allow_lead_insert ON leads;
DROP POLICY IF EXISTS allow_lead_select ON leads;
DROP POLICY IF EXISTS organizations_select_member ON organizations;
DROP POLICY IF EXISTS organization_members_select_own ON organization_members;
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;

-- ============================================================
-- 7. ORGANIZATION POLICIES
-- ============================================================

CREATE POLICY organizations_select_member
ON organizations
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = organizations.id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY organization_members_select_own
ON organization_members
FOR SELECT
TO authenticated
USING (
    profile_id = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM organization_members viewer
        WHERE viewer.organization_id = organization_members.organization_id
          AND viewer.profile_id = auth.uid()
          AND viewer.is_active = true
    )
);

CREATE POLICY profiles_select_organization
ON profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = profiles.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY profiles_update_own
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================
-- 8. GENERIC TENANT POLICIES
--
-- Membership is always verified against organization_members.
-- This avoids trusting client-supplied organization IDs.
-- ============================================================

CREATE POLICY leads_tenant_select
ON leads
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_insert
ON leads
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_update
ON leads
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_delete
ON leads
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

-- ============================================================
-- 9. GENERIC POLICY CREATION FUNCTION
--
-- Creates the same four tenant policies for organization_id
-- based tables. Existing policies are replaced safely.
-- ============================================================

CREATE OR REPLACE FUNCTION ads_create_tenant_policies(p_table text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I',
        p_table || '_tenant_select',
        p_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I',
        p_table || '_tenant_insert',
        p_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I',
        p_table || '_tenant_update',
        p_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I',
        p_table || '_tenant_delete',
        p_table
    );

    EXECUTE format(
        'CREATE POLICY %I ON %I
         FOR SELECT TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM organization_members om
                 WHERE om.organization_id = %I.organization_id
                   AND om.profile_id = auth.uid()
                   AND om.is_active = true
             )
         )',
        p_table || '_tenant_select',
        p_table,
        p_table
    );

    EXECUTE format(
        'CREATE POLICY %I ON %I
         FOR INSERT TO authenticated
         WITH CHECK (
             EXISTS (
                 SELECT 1
                 FROM organization_members om
                 WHERE om.organization_id = %I.organization_id
                   AND om.profile_id = auth.uid()
                   AND om.is_active = true
             )
         )',
        p_table || '_tenant_insert',
        p_table,
        p_table
    );

    EXECUTE format(
        'CREATE POLICY %I ON %I
         FOR UPDATE TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM organization_members om
                 WHERE om.organization_id = %I.organization_id
                   AND om.profile_id = auth.uid()
                   AND om.is_active = true
             )
         )
         WITH CHECK (
             EXISTS (
                 SELECT 1
                 FROM organization_members om
                 WHERE om.organization_id = %I.organization_id
                   AND om.profile_id = auth.uid()
                   AND om.is_active = true
             )
         )',
        p_table || '_tenant_update',
        p_table,
        p_table,
        p_table
    );

    EXECUTE format(
        'CREATE POLICY %I ON %I
         FOR DELETE TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM organization_members om
                 WHERE om.organization_id = %I.organization_id
                   AND om.profile_id = auth.uid()
                   AND om.is_active = true
             )
         )',
        p_table || '_tenant_delete',
        p_table,
        p_table
    );

END;
$$;

-- ============================================================
-- 10. APPLY GENERIC TENANT POLICIES
-- ============================================================

DO $$
DECLARE
    t text;
BEGIN

    FOREACH t IN ARRAY ARRAY[
        'clients',
        'projects',
        'payments',
        'activities',
        'notes',
        'attachments',
        'tasks',
        'notifications',
        'companies',
        'contacts',
        'opportunities',
        'quotations',
        'quotation_items',
        'contracts',
        'invoices',
        'invoice_items',
        'support_tickets',
        'ticket_categories',
        'ticket_priorities',
        'ticket_comments',
        'products',
        'product_categories',
        'tags',
        'entity_tags',
        'saved_filters',
        'custom_fields',
        'custom_field_values',
        'sales_forecasts',
        'revenue_pipeline',
        'workflow_definitions',
        'workflow_executions',
        'dashboards',
        'reports',
        'ai_assistants',
        'ai_conversations',
        'ai_recommendations',
        'fiscal_years',
        'departments',
        'vendors',
        'warehouses',
        'inventory',
        'website_settings'
    ]
    LOOP

        PERFORM ads_create_tenant_policies(t);

    END LOOP;

END;
$$;

-- ============================================================
-- 11. ENTITY ENGINE POLICY VERIFICATION TARGET
-- ============================================================

-- Explicitly ensure shared entity engines have tenant RLS.
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 12. REMOVE TEMPORARY POLICY GENERATOR
-- ============================================================

DROP FUNCTION IF EXISTS ads_create_tenant_policies(text);

-- ============================================================
-- 13. MIGRATION REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS ads_migration_registry (
    migration_key varchar(150) PRIMARY KEY,
    migration_version varchar(50) NOT NULL,
    description text,
    executed_at timestamptz NOT NULL DEFAULT now(),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO ads_migration_registry (
    migration_key,
    migration_version,
    description
)
VALUES (
    '016_ads_tenant_isolation',
    'V1',
    'ADS V1 tenant organization isolation and RLS enforcement'
)
ON CONFLICT (migration_key)
DO UPDATE SET
    migration_version = EXCLUDED.migration_version,
    description = EXCLUDED.description,
    executed_at = now();

COMMIT;
'@ | Set-Content -LiteralPath ".\supabase\migrations\016_ads_tenant_isolation.sql" -Encoding UTF8

Write-Host ""
Write-Host "016_ads_tenant_isolation.sql replaced successfully." -ForegroundColor Green
Get-Item ".\supabase\migrations\016_ads_tenant_isolation.sql" |
    Select-Object FullName, Length
