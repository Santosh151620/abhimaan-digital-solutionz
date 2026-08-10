BEGIN;

-- ============================================================
-- ADS 033
-- CRM relationship tenant-integrity hardening
--
-- Purpose:
--   Ensure CRM relationship writes cannot connect records
--   across organizations.
--
-- Existing composite tenant FKs are preserved.
-- This migration only hardens relationship write validation.
-- ============================================================

-- ------------------------------------------------------------
-- CONTACTS -> COMPANIES
-- ------------------------------------------------------------

DROP POLICY IF EXISTS contacts_org_insert
    ON public.contacts;

CREATE POLICY contacts_org_insert
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND (
        company_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.companies c
            WHERE c.id = contacts.company_id
              AND c.organization_id = contacts.organization_id
        )
    )
);

DROP POLICY IF EXISTS contacts_org_update
    ON public.contacts;

CREATE POLICY contacts_org_update
ON public.contacts
FOR UPDATE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND (
        company_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.companies c
            WHERE c.id = contacts.company_id
              AND c.organization_id = contacts.organization_id
        )
    )
);

-- ------------------------------------------------------------
-- OPPORTUNITIES -> COMPANY / CONTACT / LEAD / PIPELINE STAGE
-- ------------------------------------------------------------

DROP POLICY IF EXISTS opportunities_org_insert
    ON public.opportunities;

CREATE POLICY opportunities_org_insert
ON public.opportunities
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND (
        company_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.companies c
            WHERE c.id = opportunities.company_id
              AND c.organization_id = opportunities.organization_id
        )
    )
    AND (
        contact_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.contacts c
            WHERE c.id = opportunities.contact_id
              AND c.organization_id = opportunities.organization_id
        )
    )
    AND (
        lead_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.leads l
            WHERE l.id = opportunities.lead_id
              AND l.organization_id = opportunities.organization_id
        )
    )
    AND (
        pipeline_stage_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.pipeline_stages ps
            WHERE ps.id = opportunities.pipeline_stage_id
              AND ps.organization_id = opportunities.organization_id
        )
    )
);

DROP POLICY IF EXISTS opportunities_org_update
    ON public.opportunities;

CREATE POLICY opportunities_org_update
ON public.opportunities
FOR UPDATE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND (
        company_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.companies c
            WHERE c.id = opportunities.company_id
              AND c.organization_id = opportunities.organization_id
        )
    )
    AND (
        contact_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.contacts c
            WHERE c.id = opportunities.contact_id
              AND c.organization_id = opportunities.organization_id
        )
    )
    AND (
        lead_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.leads l
            WHERE l.id = opportunities.lead_id
              AND l.organization_id = opportunities.organization_id
        )
    )
    AND (
        pipeline_stage_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.pipeline_stages ps
            WHERE ps.id = opportunities.pipeline_stage_id
              AND ps.organization_id = opportunities.organization_id
        )
    )
);

-- ------------------------------------------------------------
-- QUOTATIONS -> COMPANY / CONTACT / OPPORTUNITY
-- ------------------------------------------------------------

DROP POLICY IF EXISTS quotations_tenant_insert
    ON public.quotations;

CREATE POLICY quotations_tenant_insert
ON public.quotations
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND EXISTS (
        SELECT 1
        FROM public.companies c
        WHERE c.id = quotations.company_id
          AND c.organization_id = quotations.organization_id
    )
    AND (
        contact_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.contacts c
            WHERE c.id = quotations.contact_id
              AND c.organization_id = quotations.organization_id
        )
    )
    AND (
        opportunity_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.opportunities o
            WHERE o.id = quotations.opportunity_id
              AND o.organization_id = quotations.organization_id
        )
    )
);

DROP POLICY IF EXISTS quotations_tenant_update
    ON public.quotations;

CREATE POLICY quotations_tenant_update
ON public.quotations
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.organization_members om
        WHERE om.organization_id = quotations.organization_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
    AND EXISTS (
        SELECT 1
        FROM public.companies c
        WHERE c.id = quotations.company_id
          AND c.organization_id = quotations.organization_id
    )
    AND (
        contact_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.contacts c
            WHERE c.id = quotations.contact_id
              AND c.organization_id = quotations.organization_id
        )
    )
    AND (
        opportunity_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.opportunities o
            WHERE o.id = quotations.opportunity_id
              AND o.organization_id = quotations.organization_id
        )
    )
);

COMMIT;
