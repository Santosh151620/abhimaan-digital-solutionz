-- ============================================================
-- CRM CONTRACTS
-- ============================================================
-- Sales / Customer Contracts
--
-- Lifecycle:
-- Lead
-- → Opportunity
-- → Quotation
-- → Contract
-- → Invoice
-- → Payment
--
-- This table intentionally does NOT replace
-- crm.billing_contracts.
--
-- billing_contracts belongs to Finance.
-- contracts belongs to CRM.
-- ============================================================

CREATE TABLE IF NOT EXISTS crm.contracts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES public.organizations(id)
        ON DELETE CASCADE,

    company_id UUID
        REFERENCES crm.companies(id),

    contact_id UUID
        REFERENCES crm.contacts(id),

    quotation_id UUID
        REFERENCES crm.quotations(id),

    owner_id UUID
        REFERENCES public.profiles(id),

    contract_number TEXT NOT NULL,

    title TEXT NOT NULL,

    description TEXT,

    status TEXT NOT NULL DEFAULT 'Draft',

    start_date DATE,

    end_date DATE,

    renewal_date DATE,

    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,

    currency_code TEXT NOT NULL DEFAULT 'INR',

    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,

    tax NUMERIC(14,2) NOT NULL DEFAULT 0,

    discount NUMERIC(14,2) NOT NULL DEFAULT 0,

    total NUMERIC(14,2) NOT NULL DEFAULT 0,

    signed_date DATE,

    signed_by TEXT,

    document_url TEXT,

    notes TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    archived BOOLEAN NOT NULL DEFAULT FALSE,

    created_by UUID
        REFERENCES public.profiles(id),

    updated_by UUID
        REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_contract_number
        UNIQUE (
            organization_id,
            contract_number
        )

);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_contracts_org
ON crm.contracts(organization_id);

CREATE INDEX IF NOT EXISTS idx_contracts_company
ON crm.contracts(company_id);

CREATE INDEX IF NOT EXISTS idx_contracts_contact
ON crm.contracts(contact_id);

CREATE INDEX IF NOT EXISTS idx_contracts_owner
ON crm.contracts(owner_id);

CREATE INDEX IF NOT EXISTS idx_contracts_status
ON crm.contracts(status);

CREATE INDEX IF NOT EXISTS idx_contracts_start_date
ON crm.contracts(start_date);

CREATE INDEX IF NOT EXISTS idx_contracts_end_date
ON crm.contracts(end_date);

CREATE INDEX IF NOT EXISTS idx_contracts_archived
ON crm.contracts(archived);

CREATE INDEX IF NOT EXISTS idx_contracts_created_at
ON crm.contracts(created_at DESC);

-- ============================================================
-- UPDATED AT
-- ============================================================

CREATE TRIGGER trg_contracts_updated_at
BEFORE UPDATE
ON crm.contracts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE crm.contracts
ENABLE ROW LEVEL SECURITY;

CREATE POLICY contracts_select
ON crm.contracts
FOR SELECT
USING (
    organization_id = public.current_organization_id()
);

CREATE POLICY contracts_insert
ON crm.contracts
FOR INSERT
WITH CHECK (
    organization_id = public.current_organization_id()
);

CREATE POLICY contracts_update
ON crm.contracts
FOR UPDATE
USING (
    organization_id = public.current_organization_id()
);

CREATE POLICY contracts_delete
ON crm.contracts
FOR DELETE
USING (
    organization_id = public.current_organization_id()
);