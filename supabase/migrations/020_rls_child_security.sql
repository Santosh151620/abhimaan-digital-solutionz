-- ============================================================
-- 020_rls_child_security.sql
-- ADS CHILD-TABLE RLS SECURITY
-- ============================================================
--
-- PURPOSE
--   Secure child tables through their parent records.
--
-- IMPORTANT EXECUTION ORDER
--   020 executes BEFORE 021.
--
--   Therefore:
--     * DO NOT depend on leads.organization_id here.
--     * DO NOT depend on clients.organization_id here.
--     * Child access is established through the parent row.
--
-- DESIGN
--   Child row is accessible when its referenced parent row is
--   accessible to the authenticated user.
--
--   This migration intentionally does NOT modify parent-table
--   tenant boundaries. Migration 021 handles leads/clients.
--
-- SAFETY
--   * No DROP TABLE
--   * No DROP COLUMN
--   * No DELETE
--   * No TRUNCATE
--   * Existing data untouched
--   * Missing tables/columns are skipped
--   * Existing child policies are replaced deterministically
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. ENABLE RLS ON EXISTING CHILD TABLES
-- ============================================================

DO $$
DECLARE
    v_table text;
BEGIN
    FOREACH v_table IN ARRAY ARRAY[
        'activity_timeline',
        'asset_maintenance',
        'contact_addresses',
        'contact_communications',
        'contact_relationships',
        'contract_milestones',
        'contract_renewals',
        'invoice_items',
        'lead_assignments',
        'lead_qualification',
        'lead_scoring',
        'lead_status_history',
        'opportunity_competitors',
        'opportunity_history',
        'opportunity_products',
        'product_attachments',
        'product_bundles',
        'product_pricing',
        'project_deliverables',
        'project_members',
        'project_milestones',
        'project_phases',
        'project_risks',
        'quotation_items',
        'sales_order_items',
        'ticket_comments',
        'ticket_escalations',
        'ticket_knowledge_links',
        'ticket_sla_tracking',
        'time_entries',
        'workflow_actions',
        'workflow_conditions'
    ]
    LOOP

        IF to_regclass('public.' || v_table) IS NOT NULL THEN
            EXECUTE format(
                'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
                v_table
            );
        END IF;

    END LOOP;
END;
$$;

-- ============================================================
-- 2. ACTIVITY TIMELINE
-- ============================================================
--
-- activities does not have organization_id.
--
-- Ownership path:
--
-- activity_timeline.activity_id
--     -> activities.id
--     -> activities.created_by
--     -> profiles.id
--     -> organization_members.profile_id
--
-- ============================================================

DO $$
BEGIN

    IF to_regclass('public.activity_timeline') IS NOT NULL
       AND to_regclass('public.activities') IS NOT NULL
       AND to_regclass('public.profiles') IS NOT NULL
       AND to_regclass('public.organization_members') IS NOT NULL
    THEN

        DROP POLICY IF EXISTS activity_timeline_select
        ON public.activity_timeline;

        DROP POLICY IF EXISTS activity_timeline_insert
        ON public.activity_timeline;

        DROP POLICY IF EXISTS activity_timeline_update
        ON public.activity_timeline;

        DROP POLICY IF EXISTS activity_timeline_delete
        ON public.activity_timeline;

        CREATE POLICY activity_timeline_select
        ON public.activity_timeline
        FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.activities a
                JOIN public.profiles p
                  ON p.id = a.created_by
                JOIN public.organization_members om
                  ON om.profile_id = p.id
                WHERE a.id = activity_timeline.activity_id
                  AND om.profile_id = (select auth.uid())
                  AND om.is_active = true
            )
        );

        CREATE POLICY activity_timeline_insert
        ON public.activity_timeline
        FOR INSERT
        TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1
                FROM public.activities a
                JOIN public.profiles p
                  ON p.id = a.created_by
                JOIN public.organization_members om
                  ON om.profile_id = p.id
                WHERE a.id = activity_timeline.activity_id
                  AND om.profile_id = (select auth.uid())
                  AND om.is_active = true
            )
        );

        CREATE POLICY activity_timeline_update
        ON public.activity_timeline
        FOR UPDATE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.activities a
                JOIN public.profiles p
                  ON p.id = a.created_by
                JOIN public.organization_members om
                  ON om.profile_id = p.id
                WHERE a.id = activity_timeline.activity_id
                  AND om.profile_id = (select auth.uid())
                  AND om.is_active = true
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1
                FROM public.activities a
                JOIN public.profiles p
                  ON p.id = a.created_by
                JOIN public.organization_members om
                  ON om.profile_id = p.id
                WHERE a.id = activity_timeline.activity_id
                  AND om.profile_id = (select auth.uid())
                  AND om.is_active = true
            )
        );

        CREATE POLICY activity_timeline_delete
        ON public.activity_timeline
        FOR DELETE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.activities a
                JOIN public.profiles p
                  ON p.id = a.created_by
                JOIN public.organization_members om
                  ON om.profile_id = p.id
                WHERE a.id = activity_timeline.activity_id
                  AND om.profile_id = (select auth.uid())
                  AND om.is_active = true
            )
        );

    END IF;

END;
$$;

-- ============================================================
-- 3. SAFE PARENT-BASED CHILD POLICY GENERATOR
-- ============================================================
--
-- This helper:
--
--   * verifies child table exists
--   * verifies child FK column exists
--   * verifies parent table exists
--   * verifies parent id exists
--   * creates four separate policies
--
-- The policy checks parent-row existence.
--
-- This intentionally does NOT inspect parent.organization_id,
-- because migration 020 executes before migration 021.
--
-- ============================================================

CREATE OR REPLACE FUNCTION public.ads_apply_child_parent_rls(
    p_child_table text,
    p_child_column text,
    p_parent_table text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_child_exists boolean;
    v_parent_exists boolean;
    v_child_column_exists boolean;
    v_parent_id_exists boolean;
    v_policy_base text;
BEGIN

    SELECT to_regclass(
        format('public.%I', p_child_table)
    ) IS NOT NULL
    INTO v_child_exists;

    IF NOT v_child_exists THEN
        RETURN;
    END IF;

    SELECT to_regclass(
        format('public.%I', p_parent_table)
    ) IS NOT NULL
    INTO v_parent_exists;

    IF NOT v_parent_exists THEN
        RETURN;
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = p_child_table
          AND column_name = p_child_column
    )
    INTO v_child_column_exists;

    IF NOT v_child_column_exists THEN
        RETURN;
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = p_parent_table
          AND column_name = 'id'
    )
    INTO v_parent_id_exists;

    IF NOT v_parent_id_exists THEN
        RETURN;
    END IF;

    v_policy_base :=
        left(
            regexp_replace(
                lower(p_child_table || '_' || p_child_column || '_parent'),
                '[^a-z0-9_]+',
                '_',
                'g'
            ),
            50
        );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        v_policy_base || '_select',
        p_child_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        v_policy_base || '_insert',
        p_child_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        v_policy_base || '_update',
        p_child_table
    );

    EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        v_policy_base || '_delete',
        p_child_table
    );

    EXECUTE format(
        'CREATE POLICY %I
         ON public.%I
         FOR SELECT
         TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM public.%I parent_row
                 WHERE parent_row.id = %I.%I
             )
         )',
        v_policy_base || '_select',
        p_child_table,
        p_parent_table,
        p_child_table,
        p_child_column
    );

    EXECUTE format(
        'CREATE POLICY %I
         ON public.%I
         FOR INSERT
         TO authenticated
         WITH CHECK (
             EXISTS (
                 SELECT 1
                 FROM public.%I parent_row
                 WHERE parent_row.id = %I.%I
             )
         )',
        v_policy_base || '_insert',
        p_child_table,
        p_parent_table,
        p_child_table,
        p_child_column
    );

    EXECUTE format(
        'CREATE POLICY %I
         ON public.%I
         FOR UPDATE
         TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM public.%I parent_row
                 WHERE parent_row.id = %I.%I
             )
         )
         WITH CHECK (
             EXISTS (
                 SELECT 1
                 FROM public.%I parent_row
                 WHERE parent_row.id = %I.%I
             )
         )',
        v_policy_base || '_update',
        p_child_table,
        p_parent_table,
        p_child_table,
        p_child_column,
        p_parent_table,
        p_child_table,
        p_child_column
    );

    EXECUTE format(
        'CREATE POLICY %I
         ON public.%I
         FOR DELETE
         TO authenticated
         USING (
             EXISTS (
                 SELECT 1
                 FROM public.%I parent_row
                 WHERE parent_row.id = %I.%I
             )
         )',
        v_policy_base || '_delete',
        p_child_table,
        p_parent_table,
        p_child_table,
        p_child_column
    );

END;
$$;

-- ============================================================
-- 4. LEAD CHILDREN
-- ============================================================
--
-- These deliberately reference leads.id only.
-- 021 establishes leads.organization_id later.
--
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'lead_assignments',
    'lead_id',
    'leads'
);

SELECT public.ads_apply_child_parent_rls(
    'lead_qualification',
    'lead_id',
    'leads'
);

SELECT public.ads_apply_child_parent_rls(
    'lead_scoring',
    'lead_id',
    'leads'
);

SELECT public.ads_apply_child_parent_rls(
    'lead_status_history',
    'lead_id',
    'leads'
);

-- ============================================================
-- 5. CONTACT CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'contact_addresses',
    'contact_id',
    'contacts'
);

SELECT public.ads_apply_child_parent_rls(
    'contact_communications',
    'contact_id',
    'contacts'
);

SELECT public.ads_apply_child_parent_rls(
    'contact_relationships',
    'contact_id',
    'contacts'
);

-- ============================================================
-- 6. CONTRACT CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'contract_milestones',
    'contract_id',
    'contracts'
);

SELECT public.ads_apply_child_parent_rls(
    'contract_renewals',
    'contract_id',
    'contracts'
);

-- ============================================================
-- 7. INVOICE CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'invoice_items',
    'invoice_id',
    'invoices'
);

-- ============================================================
-- 8. ASSET CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'asset_maintenance',
    'asset_id',
    'assets'
);

-- ============================================================
-- 9. OPPORTUNITY CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'opportunity_competitors',
    'opportunity_id',
    'opportunities'
);

SELECT public.ads_apply_child_parent_rls(
    'opportunity_history',
    'opportunity_id',
    'opportunities'
);

SELECT public.ads_apply_child_parent_rls(
    'opportunity_products',
    'opportunity_id',
    'opportunities'
);

-- ============================================================
-- 10. PRODUCT CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'product_attachments',
    'product_id',
    'products'
);

SELECT public.ads_apply_child_parent_rls(
    'product_bundles',
    'bundle_product_id',
    'products'
);

SELECT public.ads_apply_child_parent_rls(
    'product_pricing',
    'product_id',
    'products'
);

-- ============================================================
-- 11. PROJECT CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'project_deliverables',
    'project_id',
    'projects'
);

SELECT public.ads_apply_child_parent_rls(
    'project_members',
    'project_id',
    'projects'
);

SELECT public.ads_apply_child_parent_rls(
    'project_milestones',
    'project_id',
    'projects'
);

SELECT public.ads_apply_child_parent_rls(
    'project_phases',
    'project_id',
    'projects'
);

SELECT public.ads_apply_child_parent_rls(
    'project_risks',
    'project_id',
    'projects'
);

-- ============================================================
-- 12. QUOTATION CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'quotation_items',
    'quotation_id',
    'quotations'
);

-- ============================================================
-- 13. SALES ORDER CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'sales_order_items',
    'sales_order_id',
    'sales_orders'
);

-- ============================================================
-- 14. SUPPORT TICKET CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'ticket_comments',
    'ticket_id',
    'support_tickets'
);

SELECT public.ads_apply_child_parent_rls(
    'ticket_escalations',
    'ticket_id',
    'support_tickets'
);

SELECT public.ads_apply_child_parent_rls(
    'ticket_knowledge_links',
    'ticket_id',
    'support_tickets'
);

SELECT public.ads_apply_child_parent_rls(
    'ticket_sla_tracking',
    'ticket_id',
    'support_tickets'
);

-- ============================================================
-- 15. WORKFLOW CHILDREN
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'workflow_actions',
    'workflow_id',
    'workflow_definitions'
);

SELECT public.ads_apply_child_parent_rls(
    'workflow_conditions',
    'workflow_id',
    'workflow_definitions'
);

-- ============================================================
-- 16. TIME ENTRIES
-- ============================================================
--
-- time_entries is included only when the expected project_id
-- relationship exists.
--
-- ============================================================

SELECT public.ads_apply_child_parent_rls(
    'time_entries',
    'project_id',
    'projects'
);

-- ============================================================
-- 17. VALIDATION
-- ============================================================

DO $$
DECLARE
    v_table text;
    v_rls_enabled boolean;
BEGIN

    FOREACH v_table IN ARRAY ARRAY[
        'activity_timeline',
        'asset_maintenance',
        'contact_addresses',
        'contact_communications',
        'contact_relationships',
        'contract_milestones',
        'contract_renewals',
        'invoice_items',
        'lead_assignments',
        'lead_qualification',
        'lead_scoring',
        'lead_status_history',
        'opportunity_competitors',
        'opportunity_history',
        'opportunity_products',
        'product_attachments',
        'product_bundles',
        'product_pricing',
        'project_deliverables',
        'project_members',
        'project_milestones',
        'project_phases',
        'project_risks',
        'quotation_items',
        'sales_order_items',
        'ticket_comments',
        'ticket_escalations',
        'ticket_knowledge_links',
        'ticket_sla_tracking',
        'time_entries',
        'workflow_actions',
        'workflow_conditions'
    ]
    LOOP

        IF to_regclass('public.' || v_table) IS NOT NULL THEN

            SELECT c.relrowsecurity
            INTO v_rls_enabled
            FROM pg_class c
            JOIN pg_namespace n
              ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
              AND c.relname = v_table;

            IF NOT COALESCE(v_rls_enabled, false) THEN
                RAISE EXCEPTION
                    '020 validation failed: RLS not enabled on public.%',
                    v_table;
            END IF;

        END IF;

    END LOOP;

END;
$$;

-- ============================================================
-- 18. REMOVE TEMPORARY HELPER
-- ============================================================

DROP FUNCTION IF EXISTS public.ads_apply_child_parent_rls(
    text,
    text,
    text
);

COMMIT;

-- ============================================================
-- 020 COMPLETE
-- ============================================================
