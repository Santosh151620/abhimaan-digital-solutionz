-- ============================================================================
-- 032 — ADS CRM TENANT SECURITY HARDENING
-- ============================================================================
-- Purpose:
--   1. Remove unsafe public ALL policies from projects/payments.
--   2. Replace them with authenticated organization-member policies.
--   3. Enable RLS on direct CRM tenant tables currently missing RLS.
--   4. Add tenant CRUD policies to contracts, invoices,
--      support_tickets and workflow_definitions.
--
-- IMPORTANT SCHEMA FACT:
--   projects does NOT contain organization_id.
--   projects -> clients -> organization_id
--
--   payments does NOT contain organization_id.
--   payments -> projects -> clients -> organization_id
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PROJECTS
-- Tenant resolved through projects.client_id -> clients.organization_id
-- ============================================================================

DROP POLICY IF EXISTS allow_projects_all
ON public.projects;

DROP POLICY IF EXISTS projects_tenant_select
ON public.projects;

DROP POLICY IF EXISTS projects_tenant_insert
ON public.projects;

DROP POLICY IF EXISTS projects_tenant_update
ON public.projects;

DROP POLICY IF EXISTS projects_tenant_delete
ON public.projects;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_tenant_select
ON public.projects
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.clients c
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE c.id = projects.client_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY projects_tenant_insert
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.clients c
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE c.id = projects.client_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY projects_tenant_update
ON public.projects
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.clients c
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE c.id = projects.client_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.clients c
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE c.id = projects.client_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY projects_tenant_delete
ON public.projects
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.clients c
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE c.id = projects.client_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);


-- ============================================================================
-- 2. PAYMENTS
-- Tenant resolved through payments.project_id -> projects.client_id
-- -> clients.organization_id
-- ============================================================================

DROP POLICY IF EXISTS allow_payments_all
ON public.payments;

DROP POLICY IF EXISTS payments_tenant_select
ON public.payments;

DROP POLICY IF EXISTS payments_tenant_insert
ON public.payments;

DROP POLICY IF EXISTS payments_tenant_update
ON public.payments;

DROP POLICY IF EXISTS payments_tenant_delete
ON public.payments;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_tenant_select
ON public.payments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        JOIN public.clients c
          ON c.id = p.client_id
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE p.id = payments.project_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY payments_tenant_insert
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        JOIN public.clients c
          ON c.id = p.client_id
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE p.id = payments.project_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY payments_tenant_update
ON public.payments
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        JOIN public.clients c
          ON c.id = p.client_id
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE p.id = payments.project_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        JOIN public.clients c
          ON c.id = p.client_id
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE p.id = payments.project_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY payments_tenant_delete
ON public.payments
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        JOIN public.clients c
          ON c.id = p.client_id
        JOIN public.organization_members om
          ON om.organization_id = c.organization_id
        WHERE p.id = payments.project_id
          AND om.profile_id = auth.uid()
          AND om.is_active = true
    )
);


-- ============================================================================
-- 3. CONTRACTS
-- ============================================================================

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contracts_tenant_select
ON public.contracts;

DROP POLICY IF EXISTS contracts_tenant_insert
ON public.contracts;

DROP POLICY IF EXISTS contracts_tenant_update
ON public.contracts;

DROP POLICY IF EXISTS contracts_tenant_delete
ON public.contracts;

CREATE POLICY contracts_tenant_select
ON public.contracts
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY contracts_tenant_insert
ON public.contracts
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY contracts_tenant_update
ON public.contracts
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
);

CREATE POLICY contracts_tenant_delete
ON public.contracts
FOR DELETE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);


-- ============================================================================
-- 4. INVOICES
-- ============================================================================

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS invoices_tenant_select
ON public.invoices;

DROP POLICY IF EXISTS invoices_tenant_insert
ON public.invoices;

DROP POLICY IF EXISTS invoices_tenant_update
ON public.invoices;

DROP POLICY IF EXISTS invoices_tenant_delete
ON public.invoices;

CREATE POLICY invoices_tenant_select
ON public.invoices
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY invoices_tenant_insert
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY invoices_tenant_update
ON public.invoices
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
);

CREATE POLICY invoices_tenant_delete
ON public.invoices
FOR DELETE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);


-- ============================================================================
-- 5. SUPPORT TICKETS
-- ============================================================================

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS support_tickets_tenant_select
ON public.support_tickets;

DROP POLICY IF EXISTS support_tickets_tenant_insert
ON public.support_tickets;

DROP POLICY IF EXISTS support_tickets_tenant_update
ON public.support_tickets;

DROP POLICY IF EXISTS support_tickets_tenant_delete
ON public.support_tickets;

CREATE POLICY support_tickets_tenant_select
ON public.support_tickets
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY support_tickets_tenant_insert
ON public.support_tickets
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY support_tickets_tenant_update
ON public.support_tickets
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
);

CREATE POLICY support_tickets_tenant_delete
ON public.support_tickets
FOR DELETE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);


-- ============================================================================
-- 6. WORKFLOW DEFINITIONS
-- ============================================================================

ALTER TABLE public.workflow_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workflow_definitions_tenant_select
ON public.workflow_definitions;

DROP POLICY IF EXISTS workflow_definitions_tenant_insert
ON public.workflow_definitions;

DROP POLICY IF EXISTS workflow_definitions_tenant_update
ON public.workflow_definitions;

DROP POLICY IF EXISTS workflow_definitions_tenant_delete
ON public.workflow_definitions;

CREATE POLICY workflow_definitions_tenant_select
ON public.workflow_definitions
FOR SELECT
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY workflow_definitions_tenant_insert
ON public.workflow_definitions
FOR INSERT
TO authenticated
WITH CHECK (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

CREATE POLICY workflow_definitions_tenant_update
ON public.workflow_definitions
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
);

CREATE POLICY workflow_definitions_tenant_delete
ON public.workflow_definitions
FOR DELETE
TO authenticated
USING (
    organization_id IN (
        SELECT om.organization_id
        FROM public.organization_members om
        WHERE om.profile_id = auth.uid()
          AND om.is_active = true
    )
);

COMMIT;