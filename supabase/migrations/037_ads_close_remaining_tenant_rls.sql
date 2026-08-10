/*
  ADS — Final Tenant RLS Closure
  Migration: 037_ads_close_remaining_tenant_rls.sql

  Purpose:
    Close remaining tenant-owned tables that:
      - are public base tables
      - contain organization_id
      - currently have RLS disabled

  Security rules:
    1. Existing RLS-enabled tables are untouched.
    2. Tables without organization_id are untouched.
    3. Normal tenant tables receive organization CRUD policies.
    4. Sensitive admin/security tables receive RLS only.
    5. audit_logs remains append-oriented.
    6. organization_members remains governed by dedicated policies.
    7. Existing policies are never replaced.
*/

BEGIN;

DO $$
DECLARE
    r RECORD;
BEGIN

    FOR r IN
        SELECT
            c.table_name
        FROM information_schema.columns c
        INNER JOIN information_schema.tables t
            ON t.table_schema = c.table_schema
           AND t.table_name = c.table_name
        WHERE c.table_schema = 'public'
          AND c.column_name = 'organization_id'
          AND t.table_type = 'BASE TABLE'
          AND NOT EXISTS (
              SELECT 1
              FROM pg_class pc
              INNER JOIN pg_namespace pn
                  ON pn.oid = pc.relnamespace
              WHERE pn.nspname = 'public'
                AND pc.relname = c.table_name
                AND pc.relrowsecurity = true
          )
        GROUP BY c.table_name
        ORDER BY c.table_name
    LOOP

        /*
          ----------------------------------------------------------
          STEP 1
          Enable RLS on every remaining tenant-owned table.
          ----------------------------------------------------------
        */

        EXECUTE format(
            'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
            r.table_name
        );


        /*
          ----------------------------------------------------------
          STEP 2
          Sensitive / privileged tables.
          
          These receive RLS but NOT generic organization CRUD.
          
          Their authorization must be handled by dedicated
          administrative/security policies.
          ----------------------------------------------------------
        */

        IF r.table_name IN (

            /* Platform / Admin identity */
            'admin_users',
            'admin_roles',
            'admin_user_roles',
            'admin_user_permission_overrides',
            'admin_role_delegations',
            'admin_user_invitations',

            /* Platform administration */
            'admin_organization_features',
            'admin_organization_licenses',
            'admin_organization_settings',
            'admin_subscription_history',
            'admin_system_jobs',
            'admin_audit_events',
            'admin_error_logs',
            'admin_dashboard_metrics',
            'admin_feature_flag_assignments',

            /* Credentials / sessions */
            'api_keys',
            'user_sessions',

            /* Security / system events */
            'system_events',
            'erp_system_events',

            /* Audit */
            'audit_logs'

        ) THEN

            CONTINUE;

        END IF;


        /*
          ----------------------------------------------------------
          STEP 3
          Normal tenant-owned tables.
          
          Create policies only when the corresponding command does
          not already have a policy.
          ----------------------------------------------------------
        */

        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = r.table_name
              AND cmd IN ('SELECT', 'ALL')
        ) THEN

            EXECUTE format(
                'CREATE POLICY %I
                 ON public.%I
                 FOR SELECT
                 TO authenticated
                 USING (is_current_org_member(organization_id))',
                r.table_name || '_ads_org_select',
                r.table_name
            );

        END IF;


        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = r.table_name
              AND cmd IN ('INSERT', 'ALL')
        ) THEN

            EXECUTE format(
                'CREATE POLICY %I
                 ON public.%I
                 FOR INSERT
                 TO authenticated
                 WITH CHECK (is_current_org_member(organization_id))',
                r.table_name || '_ads_org_insert',
                r.table_name
            );

        END IF;


        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = r.table_name
              AND cmd IN ('UPDATE', 'ALL')
        ) THEN

            EXECUTE format(
                'CREATE POLICY %I
                 ON public.%I
                 FOR UPDATE
                 TO authenticated
                 USING (is_current_org_member(organization_id))
                 WITH CHECK (is_current_org_member(organization_id))',
                r.table_name || '_ads_org_update',
                r.table_name
            );

        END IF;


        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = r.table_name
              AND cmd IN ('DELETE', 'ALL')
        ) THEN

            EXECUTE format(
                'CREATE POLICY %I
                 ON public.%I
                 FOR DELETE
                 TO authenticated
                 USING (is_current_org_member(organization_id))',
                r.table_name || '_ads_org_delete',
                r.table_name
            );

        END IF;

    END LOOP;

END
$$;


/*
  ============================================================
  SPECIAL CASE: audit_logs
  ============================================================

  RLS is enabled.

  Existing SELECT / INSERT policies are preserved.

  No UPDATE policy.
  No DELETE policy.

  Audit records remain append-oriented.
*/


/*
  ============================================================
  SPECIAL CASE: organization_members
  ============================================================

  Existing RLS and membership policies are preserved.

  Do NOT grant generic tenant CRUD.

  Membership mutation requires dedicated authorization logic.
*/


COMMIT;