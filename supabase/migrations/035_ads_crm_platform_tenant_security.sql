-- ============================================================
-- 035_ads_crm_platform_tenant_security.sql
-- CRM PLATFORM + SHARED ORGANIZATION TENANT SECURITY
-- ============================================================

BEGIN;

-- ============================================================
-- 1. CRM PLATFORM TABLES
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'ai_assistants',
        'ai_conversations',
        'ai_prompts',
        'ai_recommendations',
        'dashboards',
        'executive_snapshots',
        'forecast_models',
        'forms',
        'kpi_definitions',
        'reports',
        'sales_forecasts',
        'saved_filters'
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
-- 2. SHARED ORGANIZATION TABLES
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
-- 3. CRM PLATFORM POLICIES
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'ai_assistants',
        'ai_conversations',
        'ai_prompts',
        'ai_recommendations',
        'dashboards',
        'executive_snapshots',
        'forecast_models',
        'forms',
        'kpi_definitions',
        'reports',
        'sales_forecasts',
        'saved_filters'
    ];
BEGIN
    FOREACH target_table IN ARRAY target_tables
    LOOP
        IF to_regclass('public.' || target_table) IS NOT NULL THEN

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_select',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR SELECT
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))',
                target_table || '_org_select',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_insert',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR INSERT
                 TO authenticated
                 WITH CHECK (public.is_current_org_member(organization_id))',
                target_table || '_org_insert',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_update',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR UPDATE
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))
                 WITH CHECK (public.is_current_org_member(organization_id))',
                target_table || '_org_update',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_delete',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR DELETE
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))',
                target_table || '_org_delete',
                target_table
            );

        END IF;
    END LOOP;
END $$;


-- ============================================================
-- 4. SHARED ORGANIZATION POLICIES
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
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_select',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR SELECT
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))',
                target_table || '_org_select',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_insert',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR INSERT
                 TO authenticated
                 WITH CHECK (public.is_current_org_member(organization_id))',
                target_table || '_org_insert',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_update',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR UPDATE
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))
                 WITH CHECK (public.is_current_org_member(organization_id))',
                target_table || '_org_update',
                target_table
            );

            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON public.%I',
                target_table || '_org_delete',
                target_table
            );

            EXECUTE format(
                'CREATE POLICY %I ON public.%I
                 FOR DELETE
                 TO authenticated
                 USING (public.is_current_org_member(organization_id))',
                target_table || '_org_delete',
                target_table
            );

        END IF;
    END LOOP;
END $$;


-- ============================================================
-- 5. VALIDATION
-- ============================================================

DO $$
DECLARE
    target_table TEXT;
    target_tables TEXT[] := ARRAY[
        'ai_assistants',
        'ai_conversations',
        'ai_prompts',
        'ai_recommendations',
        'dashboards',
        'executive_snapshots',
        'forecast_models',
        'forms',
        'kpi_definitions',
        'reports',
        'sales_forecasts',
        'saved_filters',
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
    rls_enabled BOOLEAN;
BEGIN
    FOREACH target_table IN ARRAY target_tables
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
                '035 validation failed: RLS is not enabled on public.%',
                target_table;
        END IF;
    END LOOP;

    RAISE NOTICE
        '035 CRM platform/shared organization tenant security completed successfully';
END $$;

COMMIT;
