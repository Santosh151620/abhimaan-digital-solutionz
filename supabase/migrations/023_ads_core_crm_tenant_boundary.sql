-- ============================================================\n-- 023_ads_core_crm_tenant_boundary.sql
-- ADS CORE CRM TENANT BOUNDARY HARDENING
-- ============================================================
--
-- AUDITED TARGETS
--   companies       -> already tenant-safe
--   contacts        -> already tenant-safe
--   opportunities   -> already tenant-safe
--   quotations      -> RLS missing; harden here
--
-- SAFETY
--   * Existing tables reused.
--   * Existing data preserved.
--   * No DROP TABLE.
--   * No DROP COLUMN.
--   * No DELETE.
--   * No TRUNCATE.
--   * Quotations currently contain zero rows.
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. VERIFY QUOTATIONS TENANT COLUMN
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'quotations'
          AND column_name = 'organization_id'
    ) THEN
        RAISE EXCEPTION
            '023 validation failed: quotations.organization_id is missing';
    END IF;
END;
$$;

-- ============================================================
-- 2. VERIFY QUOTATIONS ORGANIZATION FOREIGN KEY
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.quotations'::regclass
          AND conname = 'quotations_organization_id_fkey'
    ) THEN
        RAISE EXCEPTION
            '023 validation failed: quotations organization FK is missing';
    END IF;
END;
$$;

-- ============================================================
-- 3. ENABLE RLS
-- ============================================================

ALTER TABLE public.quotations
    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. REMOVE ANY EXISTING QUOTATION POLICIES
-- ============================================================

DROP POLICY IF EXISTS quotations_org_select
ON public.quotations;

DROP POLICY IF EXISTS quotations_org_insert
ON public.quotations;

DROP POLICY IF EXISTS quotations_org_update
ON public.quotations;

DROP POLICY IF EXISTS quotations_org_delete
ON public.quotations;

DROP POLICY IF EXISTS quotations_tenant_all
ON public.quotations;

DROP POLICY IF EXISTS quotations_tenant_select
ON public.quotations;

DROP POLICY IF EXISTS quotations_tenant_insert
ON public.quotations;

DROP POLICY IF EXISTS quotations_tenant_update
ON public.quotations;

DROP POLICY IF EXISTS quotations_tenant_delete
ON public.quotations;

-- ============================================================
-- 5. QUOTATIONS SELECT
-- ============================================================

CREATE POLICY quotations_tenant_select
ON public.quotations
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 6. QUOTATIONS INSERT
-- ============================================================

CREATE POLICY quotations_tenant_insert
ON public.quotations
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 7. QUOTATIONS UPDATE
-- ============================================================

CREATE POLICY quotations_tenant_update
ON public.quotations
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 8. QUOTATIONS DELETE
-- ============================================================

CREATE POLICY quotations_tenant_delete
ON public.quotations
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 9. TENANT INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_quotations_organization_id
ON public.quotations(organization_id);

-- ============================================================
-- 10. VALIDATION
-- ============================================================

DO $$
DECLARE
    v_rls boolean;
    v_null_rows integer;
BEGIN

    SELECT relrowsecurity
    INTO v_rls
    FROM pg_class
    WHERE oid = 'public.quotations'::regclass;

    IF NOT COALESCE(v_rls, false) THEN
        RAISE EXCEPTION
            '023 validation failed: RLS disabled on quotations';
    END IF;

    SELECT COUNT(*)
    INTO v_null_rows
    FROM public.quotations
    WHERE organization_id IS NULL;

    IF v_null_rows > 0 THEN
        RAISE EXCEPTION
            '023 validation failed: quotations has % NULL organization_id rows',
            v_null_rows;
    END IF;

END;
$$;

COMMIT;

-- ============================================================
-- 023 COMPLETE
-- ============================================================

