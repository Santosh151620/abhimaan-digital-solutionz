-- ============================================================
-- ADS V1 RECONCILIATION / REMOTE DATABASE UPGRADE
-- Migration: 015_ads_v1_reconciliation.sql
--
-- PURPOSE
--   Reconcile the existing legacy Supabase database with the
--   ADS V1 enterprise architecture without destructive changes.
--
-- RULES
--   1. NEVER drop existing application tables.
--   2. NEVER delete existing application data.
--   3. NEVER rename existing application entities.
--   4. Preserve existing CRM functionality.
--   5. Add missing enterprise structures.
--   6. Maintain entity-driven shared engines.
--   7. Maintain organization / tenant isolation foundation.
--   8. Keep ERP structurally independent from CRM.
--   9. Keep Website / Admin / CRM / ERP independently extensible.
--
-- IMPORTANT
--   This migration is intentionally additive.
--   The canonical detailed definitions remain in:
--
--     003_crm.sql
--     004_erp.sql
--     005_admin.sql
--     006_lookup.sql
--
-- ============================================================

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ============================================================
-- 1. ORGANIZATION / TENANT FOUNDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY,
    organization_id uuid,
    first_name text,
    last_name text,
    display_name text,
    email citext,
    mobile text,
    avatar_url text,
    job_title text,
    department text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL,
    profile_id uuid NOT NULL,
    role text NOT NULL DEFAULT 'user',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. UPGRADE EXISTING ORGANIZATION TABLE
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


-- ============================================================
-- 3. UPGRADE EXISTING PROFILES
-- ============================================================

ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS first_name varchar(150),
    ADD COLUMN IF NOT EXISTS last_name varchar(150),
    ADD COLUMN IF NOT EXISTS display_name varchar(250),
    ADD COLUMN IF NOT EXISTS mobile varchar(40),
    ADD COLUMN IF NOT EXISTS avatar_url text,
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
-- 4. UPGRADE EXISTING ORGANIZATION MEMBERS
-- ============================================================

ALTER TABLE organization_members
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS profile_id uuid,
    ADD COLUMN IF NOT EXISTS employee_code varchar(50),
    ADD COLUMN IF NOT EXISTS member_status text DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS joined_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS left_at timestamptz,
    ADD COLUMN IF NOT EXISTS created_by uuid,
    ADD COLUMN IF NOT EXISTS updated_by uuid,
    ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
    ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;


-- ============================================================
-- 5. ENTITY TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS entity_types (
    code text PRIMARY KEY,
    display_name text NOT NULL,
    module text,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO entity_types (code, display_name, module)
VALUES
    ('organization', 'Organization', 'platform'),
    ('profile', 'Profile', 'platform'),
    ('company', 'Company', 'crm'),
    ('contact', 'Contact', 'crm'),
    ('lead', 'Lead', 'crm'),
    ('opportunity', 'Opportunity', 'crm'),
    ('quotation', 'Quotation', 'crm'),
    ('contract', 'Contract', 'crm'),
    ('invoice', 'Invoice', 'crm'),
    ('payment', 'Payment', 'crm'),
    ('project', 'Project', 'crm'),
    ('task', 'Task', 'crm'),
    ('activity', 'Activity', 'crm'),
    ('note', 'Note', 'crm'),
    ('attachment', 'Attachment', 'crm'),
    ('ticket', 'Ticket', 'crm'),
    ('notification', 'Notification', 'crm'),
    ('product', 'Product', 'crm'),
    ('service', 'Service', 'crm')
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 6. CRM CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(300) NOT NULL,
    legal_name varchar(300),
    code varchar(100),
    website varchar(500),
    email varchar(255),
    phone varchar(100),
    industry varchar(200),
    company_size varchar(100),
    country_code varchar(10),
    state_code varchar(50),
    city varchar(150),
    status varchar(50) NOT NULL DEFAULT 'active',
    owner_id uuid,
    source varchar(150),
    description text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    is_deleted boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    company_id uuid,
    first_name varchar(150),
    last_name varchar(150),
    full_name varchar(300),
    email varchar(255),
    phone varchar(100),
    mobile varchar(100),
    job_title varchar(200),
    department varchar(150),
    status varchar(50) NOT NULL DEFAULT 'active',
    owner_id uuid,
    source varchar(150),
    notes text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    is_deleted boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS opportunities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    company_id uuid,
    contact_id uuid,
    name varchar(300),
    title varchar(300),
    description text,
    stage varchar(150),
    status varchar(100) DEFAULT 'open',
    value numeric(18,2) DEFAULT 0,
    currency_code varchar(10) DEFAULT 'INR',
    probability numeric(5,2) DEFAULT 0,
    expected_close_date date,
    owner_id uuid,
    source varchar(150),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    is_deleted boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(150) NOT NULL,
    code varchar(100),
    sequence integer NOT NULL DEFAULT 0,
    probability numeric(5,2) DEFAULT 0,
    is_closed boolean NOT NULL DEFAULT false,
    is_won boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 7. LEADS - PRESERVE LEGACY DATA, ADD ENTERPRISE FIELDS
-- ============================================================

ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS company_id uuid,
    ADD COLUMN IF NOT EXISTS contact_id uuid,
    ADD COLUMN IF NOT EXISTS owner_id uuid,
    ADD COLUMN IF NOT EXISTS source_id uuid,
    ADD COLUMN IF NOT EXISTS status_id uuid,
    ADD COLUMN IF NOT EXISTS score numeric(10,2),
    ADD COLUMN IF NOT EXISTS priority varchar(50),
    ADD COLUMN IF NOT EXISTS estimated_value numeric(18,2),
    ADD COLUMN IF NOT EXISTS currency_code varchar(10) DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS expected_close_date date,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_by uuid,
    ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
    ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;


-- ============================================================
-- 8. EXISTING SHARED ENTITY ENGINES
-- ============================================================

ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS status varchar(50),
    ADD COLUMN IF NOT EXISTS subject varchar(500),
    ADD COLUMN IF NOT EXISTS due_at timestamptz,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE attachments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS organization_id uuid;


-- ============================================================
-- 9. CRM COMMERCIAL MODULES
-- ============================================================

CREATE TABLE IF NOT EXISTS quotations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    opportunity_id uuid,
    company_id uuid,
    contact_id uuid,
    quotation_number varchar(100),
    status varchar(50) NOT NULL DEFAULT 'draft',
    issue_date date DEFAULT CURRENT_DATE,
    valid_until date,
    currency_code varchar(10) DEFAULT 'INR',
    subtotal numeric(18,2) DEFAULT 0,
    discount_amount numeric(18,2) DEFAULT 0,
    tax_amount numeric(18,2) DEFAULT 0,
    total_amount numeric(18,2) DEFAULT 0,
    owner_id uuid,
    notes text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotation_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id uuid NOT NULL,
    product_id uuid,
    description text,
    quantity numeric(18,4) DEFAULT 1,
    unit_price numeric(18,4) DEFAULT 0,
    discount_amount numeric(18,2) DEFAULT 0,
    tax_amount numeric(18,2) DEFAULT 0,
    line_total numeric(18,2) DEFAULT 0,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    company_id uuid,
    contact_id uuid,
    opportunity_id uuid,
    contract_number varchar(100),
    title varchar(300) NOT NULL,
    status varchar(50) DEFAULT 'draft',
    start_date date,
    end_date date,
    contract_value numeric(18,2) DEFAULT 0,
    currency_code varchar(10) DEFAULT 'INR',
    owner_id uuid,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    company_id uuid,
    contact_id uuid,
    quotation_id uuid,
    contract_id uuid,
    invoice_number varchar(100),
    status varchar(50) DEFAULT 'draft',
    issue_date date DEFAULT CURRENT_DATE,
    due_date date,
    currency_code varchar(10) DEFAULT 'INR',
    subtotal numeric(18,2) DEFAULT 0,
    tax_amount numeric(18,2) DEFAULT 0,
    total_amount numeric(18,2) DEFAULT 0,
    balance_due numeric(18,2) DEFAULT 0,
    owner_id uuid,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid NOT NULL,
    product_id uuid,
    description text,
    quantity numeric(18,4) DEFAULT 1,
    unit_price numeric(18,4) DEFAULT 0,
    tax_amount numeric(18,2) DEFAULT 0,
    line_total numeric(18,2) DEFAULT 0,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- ============================================================
-- 10. SUPPORT / TICKETS
-- ============================================================

CREATE TABLE IF NOT EXISTS ticket_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS ticket_priorities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(100) NOT NULL,
    code varchar(50),
    sequence integer DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    company_id uuid,
    contact_id uuid,
    ticket_number varchar(100),
    subject varchar(500) NOT NULL,
    description text,
    status varchar(100) DEFAULT 'open',
    priority varchar(100) DEFAULT 'medium',
    category_id uuid,
    assigned_to uuid,
    source varchar(100),
    due_at timestamptz,
    resolved_at timestamptz,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid NOT NULL,
    author_id uuid,
    content text NOT NULL,
    is_internal boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- ============================================================
-- 11. PRODUCTS / SERVICES
-- ============================================================

CREATE TABLE IF NOT EXISTS product_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    code varchar(100),
    description text,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    category_id uuid,
    name varchar(300) NOT NULL,
    code varchar(100),
    description text,
    unit varchar(50),
    base_price numeric(18,4) DEFAULT 0,
    currency_code varchar(10) DEFAULT 'INR',
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 12. CRM INTELLIGENCE FOUNDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS sales_forecasts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    owner_id uuid,
    period_start date,
    period_end date,
    forecast_amount numeric(18,2) DEFAULT 0,
    committed_amount numeric(18,2) DEFAULT 0,
    pipeline_amount numeric(18,2) DEFAULT 0,
    currency_code varchar(10) DEFAULT 'INR',
    model_version varchar(100),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revenue_pipeline (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    opportunity_id uuid,
    stage varchar(150),
    amount numeric(18,2) DEFAULT 0,
    probability numeric(5,2) DEFAULT 0,
    weighted_amount numeric(18,2) DEFAULT 0,
    snapshot_date date DEFAULT CURRENT_DATE,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- ============================================================
-- 13. WORKFLOW / AUTOMATION FOUNDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS workflow_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(300) NOT NULL,
    code varchar(150),
    module varchar(100),
    entity_type varchar(150),
    description text,
    trigger_config jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    version integer NOT NULL DEFAULT 1,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id uuid,
    organization_id uuid,
    entity_type varchar(150),
    entity_id uuid,
    status varchar(50) DEFAULT 'pending',
    started_at timestamptz,
    completed_at timestamptz,
    error_message text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 14. DASHBOARD / REPORTING FOUNDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS dashboards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(300) NOT NULL,
    description text,
    dashboard_type varchar(100),
    owner_id uuid,
    is_default boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id uuid NOT NULL,
    widget_type varchar(100) NOT NULL,
    title varchar(300),
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
    sequence integer DEFAULT 0,
    is_visible boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(300) NOT NULL,
    report_type varchar(100),
    description text,
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
    owner_id uuid,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 15. TAGS / FILTERS / CUSTOM FIELDS
-- ============================================================

CREATE TABLE IF NOT EXISTS tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(150) NOT NULL,
    color varchar(50),
    description text,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS entity_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    entity_type varchar(150) NOT NULL,
    entity_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(entity_type, entity_id, tag_id)
);

CREATE TABLE IF NOT EXISTS saved_filters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    entity_type varchar(150) NOT NULL,
    filter_definition jsonb NOT NULL DEFAULT '{}'::jsonb,
    owner_id uuid,
    is_shared boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_fields (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    entity_type varchar(150) NOT NULL,
    field_key varchar(150) NOT NULL,
    field_label varchar(200) NOT NULL,
    field_type varchar(100) NOT NULL,
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_required boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, entity_type, field_key)
);

CREATE TABLE IF NOT EXISTS custom_field_values (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    custom_field_id uuid NOT NULL,
    entity_type varchar(150) NOT NULL,
    entity_id uuid NOT NULL,
    value_text text,
    value_numeric numeric,
    value_boolean boolean,
    value_date date,
    value_json jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 16. CRM AI FOUNDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_assistants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    code varchar(100),
    description text,
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    assistant_id uuid,
    user_id uuid,
    entity_type varchar(150),
    entity_id uuid,
    title varchar(300),
    status varchar(50) DEFAULT 'active',
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL,
    role varchar(50) NOT NULL,
    content text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    entity_type varchar(150),
    entity_id uuid,
    recommendation_type varchar(150),
    recommendation text,
    confidence numeric(6,4),
    status varchar(50) DEFAULT 'new',
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 17. ERP V2 STRUCTURAL PROVISION
--
-- ERP remains independent.
-- These tables are intentionally minimal here.
-- Detailed ERP schema remains governed by 004_erp.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS fiscal_years (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_current boolean NOT NULL DEFAULT false,
    is_closed boolean NOT NULL DEFAULT false,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    code varchar(100),
    description text,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS vendors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(300) NOT NULL,
    code varchar(100),
    email varchar(255),
    phone varchar(100),
    status varchar(50) DEFAULT 'active',
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS warehouses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(200) NOT NULL,
    code varchar(100),
    address jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    product_id uuid,
    warehouse_id uuid,
    quantity numeric(18,4) DEFAULT 0,
    reserved_quantity numeric(18,4) DEFAULT 0,
    available_quantity numeric(18,4) DEFAULT 0,
    reorder_level numeric(18,4),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 18. WEBSITE / ADMIN PROVISION
-- ============================================================

CREATE TABLE IF NOT EXISTS website_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    setting_key varchar(255) NOT NULL,
    setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, setting_key)
);

CREATE TABLE IF NOT EXISTS admin_platform_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key varchar(255) NOT NULL UNIQUE,
    setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 19. SHARED INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_companies_org
    ON companies(organization_id);

CREATE INDEX IF NOT EXISTS idx_contacts_org
    ON contacts(organization_id);

CREATE INDEX IF NOT EXISTS idx_contacts_company
    ON contacts(company_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_org
    ON opportunities(organization_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_company
    ON opportunities(company_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_owner
    ON opportunities(owner_id);

CREATE INDEX IF NOT EXISTS idx_leads_org
    ON leads(organization_id);

CREATE INDEX IF NOT EXISTS idx_activities_entity
    ON activities(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notes_entity
    ON notes(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_attachments_entity
    ON attachments(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_tasks_entity
    ON tasks(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notifications_entity
    ON notifications(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_org
    ON support_tickets(organization_id);

CREATE INDEX IF NOT EXISTS idx_entity_tags_entity
    ON entity_tags(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity
    ON custom_field_values(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_entity
    ON ai_recommendations(entity_type, entity_id);


-- ============================================================
-- 20. UPDATED_AT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION ads_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


-- ============================================================
-- 20A. SHARED ENTITY ENGINE RECONCILIATION
-- ============================================================
--
-- These tables already belong to the existing CRM schema.
-- We ONLY reconcile tenant metadata here.
-- No table recreation and no data deletion.
-- ============================================================

ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE attachments
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;


-- ============================================================
-- 20B. SHARED ENTITY ENGINE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activities_org
    ON activities(organization_id);

CREATE INDEX IF NOT EXISTS idx_notes_org
    ON notes(organization_id);

CREATE INDEX IF NOT EXISTS idx_attachments_org
    ON attachments(organization_id);

CREATE INDEX IF NOT EXISTS idx_tasks_org
    ON tasks(organization_id);

CREATE INDEX IF NOT EXISTS idx_notifications_org
    ON notifications(organization_id);


-- ============================================================
-- 20A. SHARED ENTITY ENGINE RECONCILIATION
-- ============================================================
--
-- These tables already belong to the existing CRM schema.
-- We ONLY reconcile tenant metadata here.
-- No table recreation and no data deletion.
-- ============================================================

ALTER TABLE activities
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE attachments
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS organization_id uuid,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;


-- ============================================================
-- 20B. SHARED ENTITY ENGINE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activities_org
    ON activities(organization_id);

CREATE INDEX IF NOT EXISTS idx_notes_org
    ON notes(organization_id);

CREATE INDEX IF NOT EXISTS idx_attachments_org
    ON attachments(organization_id);

CREATE INDEX IF NOT EXISTS idx_tasks_org
    ON tasks(organization_id);

CREATE INDEX IF NOT EXISTS idx_notifications_org
    ON notifications(organization_id);


-- ============================================================
-- 21. SAFE UPDATED_AT TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS trg_ads_companies_updated ON companies;

CREATE TRIGGER trg_ads_companies_updated
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();

DROP TRIGGER IF EXISTS trg_ads_contacts_updated ON contacts;

CREATE TRIGGER trg_ads_contacts_updated
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();

DROP TRIGGER IF EXISTS trg_ads_opportunities_updated ON opportunities;

CREATE TRIGGER trg_ads_opportunities_updated
BEFORE UPDATE ON opportunities
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();

DROP TRIGGER IF EXISTS trg_ads_quotations_updated ON quotations;

CREATE TRIGGER trg_ads_quotations_updated
BEFORE UPDATE ON quotations
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();

DROP TRIGGER IF EXISTS trg_ads_contracts_updated ON contracts;

CREATE TRIGGER trg_ads_contracts_updated
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();

DROP TRIGGER IF EXISTS trg_ads_invoices_updated ON invoices;

CREATE TRIGGER trg_ads_invoices_updated
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION ads_set_updated_at();


-- ============================================================
-- 22. VALIDATION MARKER
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
    '015_ads_v1_reconciliation',
    'V1',
    'ADS V1 additive reconciliation foundation for existing Supabase database'
)
ON CONFLICT (migration_key) DO NOTHING;


COMMIT;

