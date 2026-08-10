-- ============================================================
-- 034_ads_global_tenant_security_audit.sql
-- GLOBAL TENANT SECURITY COVERAGE HARDENING
-- ============================================================
--
-- Purpose:
--   Finalize the tenant-security layer after migrations 020-033.
--
-- Rules:
--   * Do NOT recreate existing tables.
--   * Do NOT rename existing entities.
--   * Do NOT introduce ERP semantics.
--   * Do NOT alter existing migration history.
--   * Only harden existing tenant-owned structures.
--
-- Tenant identity model:
--
--   auth.uid()
--       ↓
--   profiles.id
--       ↓
--   organization_members.profile_id
--       ↓
--   organization_members.organization_id
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. TENANT MEMBERSHIP HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_current_org_member(
    target_organization_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members om
        INNER JOIN public.profiles p
            ON p.id = om.profile_id
        WHERE om.organization_id = target_organization_id
          AND p.id = auth.uid()
          AND om.is_active = TRUE
    );
$$;


-- ============================================================
-- 2. TENANT OWNERSHIP HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION public.current_user_has_org(
    target_organization_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT public.is_current_org_member(target_organization_id);
$$;


-- ============================================================
-- 3. VALIDATE CRITICAL TENANT TABLES
-- ============================================================

DO $$
DECLARE
    required_table TEXT;
    required_tables TEXT[] := ARRAY[
        'companies',
        'contacts',
        'opportunities',
        'leads',
        'clients',
        'quotations',
        'activities',
        'notes',
        'tasks',
        'attachments',
        'pipeline_stages',
        'contracts',
        'invoices',
        'support_tickets',
        'workflow_definitions'
    ];
BEGIN

    FOREACH required_table IN ARRAY required_tables
    LOOP

        IF to_regclass('public.' || required_table) IS NULL THEN
            RAISE EXCEPTION
                '034 validation failed: required table public.% is missing',
                required_table;
        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 4. VALIDATE ORGANIZATION_ID ON DIRECT TENANT TABLES
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    tenant_tables TEXT[] := ARRAY[
        'companies',
        'contacts',
        'opportunities',
        'leads',
        'clients',
        'quotations',
        'activities',
        'notes',
        'tasks',
        'attachments',
        'pipeline_stages',
        'contracts',
        'invoices',
        'support_tickets',
        'workflow_definitions'
    ];
    column_exists BOOLEAN;
BEGIN

    FOREACH target_table IN ARRAY tenant_tables
    LOOP

        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = target_table
              AND column_name = 'organization_id'
        )
        INTO column_exists;

        IF NOT column_exists THEN
            RAISE EXCEPTION
                '034 validation failed: %.organization_id is missing',
                target_table;
        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 5. VALIDATE RLS ENABLEMENT
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    tenant_tables TEXT[] := ARRAY[
        'companies',
        'contacts',
        'opportunities',
        'leads',
        'clients',
        'quotations',
        'activities',
        'notes',
        'tasks',
        'attachments',
        'pipeline_stages',
        'contracts',
        'invoices',
        'support_tickets',
        'workflow_definitions',
        'projects',
        'payments'
    ];
    rls_enabled BOOLEAN;
BEGIN

    FOREACH target_table IN ARRAY tenant_tables
    LOOP

        IF to_regclass('public.' || target_table) IS NULL THEN
            CONTINUE;
        END IF;

        SELECT c.relrowsecurity
        INTO rls_enabled
        FROM pg_class c
        JOIN pg_namespace n
          ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relname = target_table;

        IF NOT COALESCE(rls_enabled, FALSE) THEN
            RAISE EXCEPTION
                '034 validation failed: RLS is not enabled on public.%',
                target_table;
        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 6. VALIDATE ORGANIZATION MEMBERSHIP STRUCTURE
-- ============================================================

DO $$
BEGIN

    IF to_regclass('public.organization_members') IS NULL THEN
        RAISE EXCEPTION
            '034 validation failed: organization_members table missing';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'organization_members'
          AND column_name = 'organization_id'
    ) THEN
        RAISE EXCEPTION
            '034 validation failed: organization_members.organization_id missing';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'organization_members'
          AND column_name = 'profile_id'
    ) THEN
        RAISE EXCEPTION
            '034 validation failed: organization_members.profile_id missing';
    END IF;

END $$;


-- ============================================================
-- 7. VALIDATE PROFILE IDENTITY STRUCTURE
-- ============================================================

DO $$
BEGIN

    IF to_regclass('public.profiles') IS NULL THEN
        RAISE EXCEPTION
            '034 validation failed: profiles table missing';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
          AND column_name = 'id'
    ) THEN
        RAISE EXCEPTION
            '034 validation failed: profiles.id missing';
    END IF;

END $$;


-- ============================================================
-- 8. VALIDATE COMPOSITE TENANT KEYS
-- ============================================================

DO $$
DECLARE
    required_constraint TEXT;
    required_constraints TEXT[] := ARRAY[
        'companies_organization_id_id_key',
        'contacts_organization_id_id_key',
        'opportunities_organization_id_id_key',
        'leads_organization_id_id_key',
        'pipeline_stages_organization_id_id_key'
    ];
BEGIN

    FOREACH required_constraint IN ARRAY required_constraints
    LOOP

        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = required_constraint
        ) THEN
            RAISE EXCEPTION
                '034 validation failed: required tenant constraint % missing',
                required_constraint;
        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 9. VALIDATE CRITICAL CROSS-TENANT FOREIGN KEYS
-- ============================================================

DO $$
DECLARE
    required_constraint TEXT;
    required_constraints TEXT[] := ARRAY[
        'contacts_company_tenant_fkey',
        'opportunities_company_tenant_fkey',
        'opportunities_contact_tenant_fkey',
        'opportunities_lead_tenant_fkey',
        'opportunities_pipeline_stage_tenant_fkey',
        'quotations_company_tenant_fkey',
        'quotations_contact_tenant_fkey',
        'quotations_opportunity_tenant_fkey'
    ];
BEGIN

    FOREACH required_constraint IN ARRAY required_constraints
    LOOP

        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = required_constraint
        ) THEN

            RAISE NOTICE
                '034 notice: expected tenant FK constraint % not found; relationship audit required',
                required_constraint;

        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 10. VALIDATE SOFT DELETE COLUMNS
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    soft_delete_tables TEXT[] := ARRAY[
        'companies',
        'contacts',
        'opportunities'
    ];
    column_exists BOOLEAN;
BEGIN

    FOREACH target_table IN ARRAY soft_delete_tables
    LOOP

        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = target_table
              AND column_name IN (
                  'deleted_at',
                  'is_deleted'
              )
        )
        INTO column_exists;

        IF NOT column_exists THEN
            RAISE NOTICE
                '034 notice: %.soft-delete column not detected',
                target_table;
        END IF;

    END LOOP;

END $$;


-- ============================================================
-- 11. VALIDATE ACTIVE MEMBERSHIP IDENTITY CHAIN
-- ============================================================

DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM public.organization_members om
        INNER JOIN public.profiles p
            ON p.id = om.profile_id
        WHERE om.is_active = TRUE
    ) THEN

        RAISE NOTICE
            '034 notice: no active organization membership/profile relationship found';

    END IF;

END $$;


-- ============================================================
-- 12. VALIDATION SUMMARY
-- ============================================================

DO $$
BEGIN

    RAISE NOTICE
        '034 tenant security validation completed successfully';

END $$;

COMMIT;