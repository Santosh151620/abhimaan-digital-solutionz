BEGIN;

-- ============================================================
-- 027 ADS CORE CRM RELATIONAL FK HARDENING
-- ============================================================

-- PostgreSQL requires the referenced composite columns to be
-- covered by a UNIQUE or PRIMARY KEY constraint.

ALTER TABLE public.companies
    ADD CONSTRAINT companies_organization_id_id_key
    UNIQUE (organization_id, id);

ALTER TABLE public.contacts
    ADD CONSTRAINT contacts_organization_id_id_key
    UNIQUE (organization_id, id);

ALTER TABLE public.opportunities
    ADD CONSTRAINT opportunities_organization_id_id_key
    UNIQUE (organization_id, id);

ALTER TABLE public.leads
    ADD CONSTRAINT leads_organization_id_id_key
    UNIQUE (organization_id, id);

ALTER TABLE public.pipeline_stages
    ADD CONSTRAINT pipeline_stages_organization_id_id_key
    UNIQUE (organization_id, id);

-- ============================================================
-- CONTACTS -> COMPANIES
-- ============================================================

ALTER TABLE public.contacts
    DROP CONSTRAINT IF EXISTS contacts_company_id_fkey;

ALTER TABLE public.contacts
    ADD CONSTRAINT contacts_company_tenant_fkey
    FOREIGN KEY (organization_id, company_id)
    REFERENCES public.companies (organization_id, id)
    NOT VALID;

-- ============================================================
-- OPPORTUNITIES -> COMPANIES
-- ============================================================

ALTER TABLE public.opportunities
    DROP CONSTRAINT IF EXISTS opportunities_company_id_fkey;

ALTER TABLE public.opportunities
    ADD CONSTRAINT opportunities_company_tenant_fkey
    FOREIGN KEY (organization_id, company_id)
    REFERENCES public.companies (organization_id, id)
    NOT VALID;

-- ============================================================
-- OPPORTUNITIES -> CONTACTS
-- ============================================================

ALTER TABLE public.opportunities
    DROP CONSTRAINT IF EXISTS opportunities_contact_id_fkey;

ALTER TABLE public.opportunities
    ADD CONSTRAINT opportunities_contact_tenant_fkey
    FOREIGN KEY (organization_id, contact_id)
    REFERENCES public.contacts (organization_id, id)
    NOT VALID;

-- ============================================================
-- OPPORTUNITIES -> LEADS
-- ============================================================

ALTER TABLE public.opportunities
    DROP CONSTRAINT IF EXISTS opportunities_lead_id_fkey;

ALTER TABLE public.opportunities
    ADD CONSTRAINT opportunities_lead_tenant_fkey
    FOREIGN KEY (organization_id, lead_id)
    REFERENCES public.leads (organization_id, id)
    NOT VALID;

-- ============================================================
-- OPPORTUNITIES -> PIPELINE STAGES
-- ============================================================

ALTER TABLE public.opportunities
    DROP CONSTRAINT IF EXISTS opportunities_pipeline_stage_id_fkey;

ALTER TABLE public.opportunities
    ADD CONSTRAINT opportunities_pipeline_stage_tenant_fkey
    FOREIGN KEY (organization_id, pipeline_stage_id)
    REFERENCES public.pipeline_stages (organization_id, id)
    NOT VALID;

-- ============================================================
-- QUOTATIONS -> COMPANIES
-- ============================================================

ALTER TABLE public.quotations
    DROP CONSTRAINT IF EXISTS quotations_company_id_fkey;

ALTER TABLE public.quotations
    ADD CONSTRAINT quotations_company_tenant_fkey
    FOREIGN KEY (organization_id, company_id)
    REFERENCES public.companies (organization_id, id)
    NOT VALID;

-- ============================================================
-- QUOTATIONS -> CONTACTS
-- ============================================================

ALTER TABLE public.quotations
    DROP CONSTRAINT IF EXISTS quotations_contact_id_fkey;

ALTER TABLE public.quotations
    ADD CONSTRAINT quotations_contact_tenant_fkey
    FOREIGN KEY (organization_id, contact_id)
    REFERENCES public.contacts (organization_id, id)
    NOT VALID;

-- ============================================================
-- QUOTATIONS -> OPPORTUNITIES
-- ============================================================

ALTER TABLE public.quotations
    DROP CONSTRAINT IF EXISTS quotations_opportunity_id_fkey;

ALTER TABLE public.quotations
    ADD CONSTRAINT quotations_opportunity_tenant_fkey
    FOREIGN KEY (organization_id, opportunity_id)
    REFERENCES public.opportunities (organization_id, id)
    NOT VALID;

COMMIT;
