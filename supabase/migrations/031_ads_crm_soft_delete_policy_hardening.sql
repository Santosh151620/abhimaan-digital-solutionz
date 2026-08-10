/*
  ADS 031
  CRM Soft-Delete Tenant Policy Hardening

  Scope:
    companies
    contacts
    opportunities

  Notes:
    - Preserve existing organization isolation.
    - Exclude soft-deleted rows from normal SELECT visibility.
    - Do NOT introduce soft-delete semantics to leads, quotations,
      or pipeline_stages because those tables do not expose the
      required soft-delete columns.
*/

BEGIN;

DROP POLICY IF EXISTS companies_org_select
    ON public.companies;

CREATE POLICY companies_org_select
ON public.companies
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND COALESCE(is_deleted, false) = false
    AND deleted_at IS NULL
);

DROP POLICY IF EXISTS contacts_org_select
    ON public.contacts;

CREATE POLICY contacts_org_select
ON public.contacts
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND COALESCE(is_deleted, false) = false
    AND deleted_at IS NULL
);

DROP POLICY IF EXISTS opportunities_org_select
    ON public.opportunities;

CREATE POLICY opportunities_org_select
ON public.opportunities
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND COALESCE(is_deleted, false) = false
    AND deleted_at IS NULL
);

COMMIT;
