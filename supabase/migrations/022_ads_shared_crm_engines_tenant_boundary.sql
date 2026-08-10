-- ============================================================
-- 022_ads_shared_crm_engines_tenant_boundary.sql
-- ADS SHARED CRM ENGINES TENANT BOUNDARY
-- ============================================================
--
-- TARGETS
--   activities
--   notes
--   tasks
--   attachments
--
-- SECURITY MODEL
--   Explicit organization ownership:
--
--       organization_id
--             |
--             v
--       organizations.id
--
--   Tenant membership:
--
--       organization_members.organization_id
--       organization_members.profile_id
--       organization_members.is_active
--       auth.uid()
--
-- SAFETY
--   * Existing tables reused.
--   * Existing data preserved.
--   * No DROP TABLE.
--   * No DROP COLUMN.
--   * No DELETE.
--   * No TRUNCATE.
--   * All four tables currently contain zero rows.
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ADD EXPLICIT TENANT COLUMNS
-- ============================================================

ALTER TABLE public.activities
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE public.notes
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS organization_id uuid;

ALTER TABLE public.attachments
    ADD COLUMN IF NOT EXISTS organization_id uuid;

-- ============================================================
-- 2. BACKFILL SAFETY
-- ============================================================
--
-- Current audit confirmed zero rows in all four tables.
--
-- Keep this defensive update so the migration remains safe
-- if rows are introduced between audit and execution.
--
-- Rows are assigned to the existing ADS admin organization.
--
-- ============================================================

UPDATE public.activities
SET organization_id = '92a098d3-0b26-476f-a70f-b2a3ac05be3f'
WHERE organization_id IS NULL;

UPDATE public.notes
SET organization_id = '92a098d3-0b26-476f-a70f-b2a3ac05be3f'
WHERE organization_id IS NULL;

UPDATE public.tasks
SET organization_id = '92a098d3-0b26-476f-a70f-b2a3ac05be3f'
WHERE organization_id IS NULL;

UPDATE public.attachments
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
        WHERE conname = 'activities_organization_id_fkey'
          AND conrelid = 'public.activities'::regclass
    ) THEN

        ALTER TABLE public.activities
            ADD CONSTRAINT activities_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notes_organization_id_fkey'
          AND conrelid = 'public.notes'::regclass
    ) THEN

        ALTER TABLE public.notes
            ADD CONSTRAINT notes_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tasks_organization_id_fkey'
          AND conrelid = 'public.tasks'::regclass
    ) THEN

        ALTER TABLE public.tasks
            ADD CONSTRAINT tasks_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'attachments_organization_id_fkey'
          AND conrelid = 'public.attachments'::regclass
    ) THEN

        ALTER TABLE public.attachments
            ADD CONSTRAINT attachments_organization_id_fkey
            FOREIGN KEY (organization_id)
            REFERENCES public.organizations(id);

    END IF;

END;
$$;

-- ============================================================
-- 4. ENFORCE TENANT OWNERSHIP
-- ============================================================

ALTER TABLE public.activities
    ALTER COLUMN organization_id SET NOT NULL;

ALTER TABLE public.notes
    ALTER COLUMN organization_id SET NOT NULL;

ALTER TABLE public.tasks
    ALTER COLUMN organization_id SET NOT NULL;

ALTER TABLE public.attachments
    ALTER COLUMN organization_id SET NOT NULL;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.activities
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notes
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.tasks
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attachments
    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. REMOVE LEGACY CREATOR/UPLOADER POLICIES
-- ============================================================

DROP POLICY IF EXISTS activities_org_select
ON public.activities;

DROP POLICY IF EXISTS activities_org_insert
ON public.activities;

DROP POLICY IF EXISTS activities_org_update
ON public.activities;

DROP POLICY IF EXISTS activities_org_delete
ON public.activities;

DROP POLICY IF EXISTS notes_org_select
ON public.notes;

DROP POLICY IF EXISTS notes_org_insert
ON public.notes;

DROP POLICY IF EXISTS notes_org_update
ON public.notes;

DROP POLICY IF EXISTS notes_org_delete
ON public.notes;

DROP POLICY IF EXISTS tasks_org_select
ON public.tasks;

DROP POLICY IF EXISTS tasks_org_insert
ON public.tasks;

DROP POLICY IF EXISTS tasks_org_update
ON public.tasks;

DROP POLICY IF EXISTS tasks_org_delete
ON public.tasks;

DROP POLICY IF EXISTS attachments_org_select
ON public.attachments;

DROP POLICY IF EXISTS attachments_org_insert
ON public.attachments;

DROP POLICY IF EXISTS attachments_org_update
ON public.attachments;

DROP POLICY IF EXISTS attachments_org_delete
ON public.attachments;

-- ============================================================
-- 7. ACTIVITIES TENANT POLICIES
-- ============================================================

CREATE POLICY activities_tenant_select
ON public.activities
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = activities.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY activities_tenant_insert
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = activities.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY activities_tenant_update
ON public.activities
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = activities.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = activities.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY activities_tenant_delete
ON public.activities
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = activities.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 8. NOTES TENANT POLICIES
-- ============================================================

CREATE POLICY notes_tenant_select
ON public.notes
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = notes.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY notes_tenant_insert
ON public.notes
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = notes.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY notes_tenant_update
ON public.notes
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = notes.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = notes.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY notes_tenant_delete
ON public.notes
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = notes.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 9. TASKS TENANT POLICIES
-- ============================================================

CREATE POLICY tasks_tenant_select
ON public.tasks
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = tasks.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY tasks_tenant_insert
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = tasks.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY tasks_tenant_update
ON public.tasks
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = tasks.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = tasks.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY tasks_tenant_delete
ON public.tasks
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = tasks.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 10. ATTACHMENTS TENANT POLICIES
-- ============================================================

CREATE POLICY attachments_tenant_select
ON public.attachments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = attachments.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY attachments_tenant_insert
ON public.attachments
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = attachments.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY attachments_tenant_update
ON public.attachments
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = attachments.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = attachments.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

CREATE POLICY attachments_tenant_delete
ON public.attachments
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = attachments.organization_id
          AND om.profile_id = (select auth.uid())
          AND om.is_active = true
    )
);

-- ============================================================
-- 11. TENANT INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activities_organization_id
ON public.activities(organization_id);

CREATE INDEX IF NOT EXISTS idx_notes_organization_id
ON public.notes(organization_id);

CREATE INDEX IF NOT EXISTS idx_tasks_organization_id
ON public.tasks(organization_id);

CREATE INDEX IF NOT EXISTS idx_attachments_organization_id
ON public.attachments(organization_id);

-- ============================================================
-- 12. VALIDATION
-- ============================================================

DO $$
DECLARE
    v_null_rows integer;
    v_rls boolean;
BEGIN

    SELECT COUNT(*)
    INTO v_null_rows
    FROM public.activities
    WHERE organization_id IS NULL;

    IF v_null_rows > 0 THEN
        RAISE EXCEPTION
            '022 validation failed: activities has % NULL organization_id rows',
            v_null_rows;
    END IF;

    SELECT COUNT(*)
    INTO v_null_rows
    FROM public.notes
    WHERE organization_id IS NULL;

    IF v_null_rows > 0 THEN
        RAISE EXCEPTION
            '022 validation failed: notes has % NULL organization_id rows',
            v_null_rows;
    END IF;

    SELECT COUNT(*)
    INTO v_null_rows
    FROM public.tasks
    WHERE organization_id IS NULL;

    IF v_null_rows > 0 THEN
        RAISE EXCEPTION
            '022 validation failed: tasks has % NULL organization_id rows',
            v_null_rows;
    END IF;

    SELECT COUNT(*)
    INTO v_null_rows
    FROM public.attachments
    WHERE organization_id IS NULL;

    IF v_null_rows > 0 THEN
        RAISE EXCEPTION
            '022 validation failed: attachments has % NULL organization_id rows',
            v_null_rows;
    END IF;

    SELECT relrowsecurity
    INTO v_rls
    FROM pg_class
    WHERE oid = 'public.activities'::regclass;

    IF NOT COALESCE(v_rls, false) THEN
        RAISE EXCEPTION
            '022 validation failed: RLS disabled on activities';
    END IF;

    SELECT relrowsecurity
    INTO v_rls
    FROM pg_class
    WHERE oid = 'public.notes'::regclass;

    IF NOT COALESCE(v_rls, false) THEN
        RAISE EXCEPTION
            '022 validation failed: RLS disabled on notes';
    END IF;

    SELECT relrowsecurity
    INTO v_rls
    FROM pg_class
    WHERE oid = 'public.tasks'::regclass;

    IF NOT COALESCE(v_rls, false) THEN
        RAISE EXCEPTION
            '022 validation failed: RLS disabled on tasks';
    END IF;

    SELECT relrowsecurity
    INTO v_rls
    FROM pg_class
    WHERE oid = 'public.attachments'::regclass;

    IF NOT COALESCE(v_rls, false) THEN
        RAISE EXCEPTION
            '022 validation failed: RLS disabled on attachments';
    END IF;

END;
$$;

COMMIT;

-- ============================================================
-- 022 COMPLETE
-- ============================================================
