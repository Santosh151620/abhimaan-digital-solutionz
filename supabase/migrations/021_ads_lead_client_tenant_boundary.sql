-- ============================================================
-- 021_ads_lead_client_tenant_boundary.sql
-- ADS LEADS / CLIENTS TENANT BOUNDARY
-- ============================================================
--
-- PURPOSE
--   Establish explicit organization ownership for leads and
--   clients and enforce tenant isolation through RLS.
--
-- SECURITY MODEL
--   Tenant membership is resolved directly through:
--
--       organization_members.organization_id
--       organization_members.profile_id
--       organization_members.is_active
--       auth.uid()
--
--   This migration intentionally does NOT depend on helper
--   functions that are absent from the current remote database.
--
-- SAFETY
--   * Existing tables reused.
--   * Existing data preserved.
--   * Existing non-null organization_id preserved.
--   * NULL organization_id values backfilled.
--   * No DROP TABLE.
--   * No DROP COLUMN.
--   * No DELETE.
--   * No TRUNCATE.
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ADD TENANT COLUMNS
-- ============================================================

ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE public.clients
    ADD COLUMN IF NOT EXISTS organization_id uuid;

-- ============================================================
-- 2. BACKFILL EXISTING DATA
-- ============================================================

UPDATE public.leads
SET organization_id = '92a098d3-0b26-476f-a70f-b2a3ac05be3f'
WHERE organization_id IS NULL;

UPDATE public.clients
SET organization_id = '92a098d3-0b26-476f-a70f-b2a3ac05be3f'
WHERE organization_id IS NULL;

-- ============================================================
-- 3. TENANT FOREIGN KEYS
-- ============================================================

DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'leads_organization_id_fkey'
          AND conrelid = 'public.leads'::regclass
    ) THEN

        ALTER TABLE public.leads
            ADD CONSTRAINT leads_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'clients_organization_id_fkey'
          AND conrelid = 'public.clients'::regclass
    ) THEN

        ALTER TABLE public.clients
            ADD CONSTRAINT clients_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

END;
$$;

-- ============================================================
-- 4. ENFORCE TENANT COLUMN
-- ============================================================

ALTER TABLE public.leads
    ALTER COLUMN organization_id SET NOT NULL;

ALTER TABLE public.clients
    ALTER COLUMN organization_id SET NOT NULL;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.leads
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.clients
    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. REMOVE LEGACY POLICIES
-- ============================================================

DROP POLICY IF EXISTS allow_lead_select
ON public.leads;

DROP POLICY IF EXISTS allow_lead_insert
ON public.leads;

DROP POLICY IF EXISTS allow_lead_update
ON public.leads;

DROP POLICY IF EXISTS allow_lead_delete
ON public.leads;

DROP POLICY IF EXISTS allow_clients_all
ON public.clients;

DROP POLICY IF EXISTS leads_tenant_policy
ON public.leads;

DROP POLICY IF EXISTS clients_tenant_policy
ON public.clients;

-- ============================================================
-- 7. REMOVE TARGET POLICIES
-- ============================================================

DROP POLICY IF EXISTS leads_tenant_select
ON public.leads;

DROP POLICY IF EXISTS leads_tenant_insert
ON public.leads;

DROP POLICY IF EXISTS leads_tenant_update
ON public.leads;

DROP POLICY IF EXISTS leads_tenant_delete
ON public.leads;

DROP POLICY IF EXISTS clients_tenant_select
ON public.clients;

DROP POLICY IF EXISTS clients_tenant_insert
ON public.clients;

DROP POLICY IF EXISTS clients_tenant_update
ON public.clients;

DROP POLICY IF EXISTS clients_tenant_delete
ON public.clients;

-- ============================================================
-- 8. LEADS TENANT POLICIES
-- ============================================================

CREATE POLICY leads_tenant_select
ON public.leads
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_insert
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_update
ON public.leads
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY leads_tenant_delete
ON public.leads
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = leads.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 9. CLIENTS TENANT POLICIES
-- ============================================================

CREATE POLICY clients_tenant_select
ON public.clients
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = clients.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY clients_tenant_insert
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = clients.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY clients_tenant_update
ON public.clients
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = clients.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = clients.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY clients_tenant_delete
ON public.clients
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = clients.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 10. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_leads_organization_id
ON public.leads(organization_id);

CREATE INDEX IF NOT EXISTS idx_clients_organization_id
ON public.clients(organization_id);

-- ============================================================
-- 11. VALIDATION
-- ============================================================

DO $$
DECLARE
    v_orphan_leads integer;
    v_orphan_clients integer;
    v_leads_rls boolean;
    v_clients_rls boolean;
BEGIN

    SELECT COUNT(*)
    INTO v_orphan_leads
    FROM public.leads
    WHERE organization_id IS NULL;

    SELECT COUNT(*)
    INTO v_orphan_clients
    FROM public.clients
    WHERE organization_id IS NULL;

    IF v_orphan_leads > 0 THEN
        RAISE EXCEPTION
            'Tenant boundary validation failed: % leads without organization_id',
            v_orphan_leads;
    END IF;

    IF v_orphan_clients > 0 THEN
        RAISE EXCEPTION
            'Tenant boundary validation failed: % clients without organization_id',
            v_orphan_clients;
    END IF;

    SELECT relrowsecurity
    INTO v_leads_rls
    FROM pg_class
    WHERE oid = 'public.leads'::regclass;

    SELECT relrowsecurity
    INTO v_clients_rls
    FROM pg_class
    WHERE oid = 'public.clients'::regclass;

    IF NOT COALESCE(v_leads_rls, false) THEN
        RAISE EXCEPTION
            'Tenant boundary validation failed: RLS not enabled on public.leads';
    END IF;

    IF NOT COALESCE(v_clients_rls, false) THEN
        RAISE EXCEPTION
            'Tenant boundary validation failed: RLS not enabled on public.clients';
    END IF;

END;
$$;

COMMIT;

-- ============================================================
-- 021 COMPLETE
-- ============================================================
