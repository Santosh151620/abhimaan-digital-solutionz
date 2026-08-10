-- ============================================================
-- 036_ads_shared_org_tenant_security.sql
-- SHARED ORGANIZATION TENANT SECURITY
-- ============================================================
--
-- Purpose:
--   Enable tenant isolation for shared organization-scoped
--   structures that are part of the ADS platform.
--
-- Rules:
--   * Do NOT recreate tables.
--   * Do NOT rename entities.
--   * Do NOT introduce ERP semantics.
--   * Do NOT alter existing migration history.
--   * Existing data and structures are preserved.
--   * RLS policies use organization membership.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ENABLE RLS
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'custom_fields',
        'departments',
        'designations',
        'employees',
        'feature_flags',
        'lead_sources',
        'lead_statuses',
        'leave_types',
        'licenses_certifications',
        'media_library',
        'organization_settings',
        'price_books',
        'product_categories',
        'products',
        'project_categories',
        'roles',
        'service_categories',
        'services',
        'tags'
    ];
BEGIN
    FOREACH target_table IN ARRAY target_tables
    LOOP
        IF to_regclass('public.' || target_table) IS NOT NULL THEN
            EXECUTE format(
                'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
                target_table
            );
        END IF;
    END LOOP;
END $$;


-- ============================================================
-- 2. CREATE STANDARD TENANT POLICIES
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'custom_fields',
        'departments',
        'designations',
        'employees',
        'feature_flags',
        'lead_sources',
        'lead_statuses',
        'leave_types',
        'licenses_certifications',
        'media_library',
        'organization_settings',
        'price_books',
        'product_categories',
        'products',
        'project_categories',
        'roles',
        'service_categories',
        'services',
        'tags'
    ];
BEGIN
    FOREACH target_table IN ARRAY target_tables
    LOOP

        IF to_regclass('public.' || target_table) IS NULL THEN
            CONTINUE;
        END IF;

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON public.%I',
            target_table || '_tenant_select',
            target_table
        );

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON public.%I',
            target_table || '_tenant_insert',
            target_table
        );

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON public.%I',
            target_table || '_tenant_update',
            target_table
        );

        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON public.%I',
            target_table || '_tenant_delete',
            target_table
        );

        EXECUTE format(
            'CREATE POLICY %I ON public.%I
             FOR SELECT
             TO authenticated
             USING (
                 public.is_current_org_member(organization_id)
             )',
            target_table || '_tenant_select',
            target_table
        );

        EXECUTE format(
            'CREATE POLICY %I ON public.%I
             FOR INSERT
             TO authenticated
             WITH CHECK (
                 public.is_current_org_member(organization_id)
             )',
            target_table || '_tenant_insert',
            target_table
        );

        EXECUTE format(
            'CREATE POLICY %I ON public.%I
             FOR UPDATE
             TO authenticated
             USING (
                 public.is_current_org_member(organization_id)
             )
             WITH CHECK (
                 public.is_current_org_member(organization_id)
             )',
            target_table || '_tenant_update',
            target_table
        );

        EXECUTE format(
            'CREATE POLICY %I ON public.%I
             FOR DELETE
             TO authenticated
             USING (
                 public.is_current_org_member(organization_id)
             )',
            target_table || '_tenant_delete',
            target_table
        );

    END LOOP;
END $$;


-- ============================================================
-- 3. VALIDATE ORGANIZATION_ID
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'custom_fields',
        'departments',
        'designations',
        'employees',
        'feature_flags',
        'lead_sources',
        'lead_statuses',
        'leave_types',
        'licenses_certifications',
        'media_library',
        'organization_settings',
        'price_books',
        'product_categories',
        'products',
        'project_categories',
        'roles',
        'service_categories',
        'services',
        'tags'
    ];
BEGIN
    FOREACH target_table IN ARRAY target_tables
    LOOP

        IF to_regclass('public.' || target_table) IS NULL THEN
            CONTINUE;
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = target_table
              AND column_name = 'organization_id'
        ) THEN
            RAISE EXCEPTION
                '036 validation failed: %.organization_id is missing',
                target_table;
        END IF;

    END LOOP;
END $$;


-- ============================================================
-- 4. VALIDATION SUMMARY
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE
        '036 shared organization tenant security completed successfully';
END $$;

COMMIT;