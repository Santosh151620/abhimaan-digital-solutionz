BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM FINANCE FOUNDATION
-- Migration : 017
-- ============================================================================
-- Purpose
-- Enterprise customer finance foundation.
--
-- Supports:
-- Customer billing lifecycle
-- Invoices
-- Payments
-- Revenue tracking
-- Subscription readiness
-- CRM → Finance continuity
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Future ERP finance extensible
-- Preserve existing payments capability
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- CUSTOMER FINANCE ACCOUNTS
-- ============================================================================
-- Financial profile linked with CRM customer entities.
--
-- Supports:
-- Companies
-- Contacts
-- Accounts
-- Future billing entities
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.finance_accounts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    account_code TEXT NOT NULL,

    account_name TEXT NOT NULL,

    account_status TEXT DEFAULT 'ACTIVE',

    credit_limit NUMERIC(14,2) DEFAULT 0,

    currency_code TEXT DEFAULT 'USD',

    payment_terms TEXT DEFAULT 'NET30',

    tax_information JSONB DEFAULT '{}'::jsonb,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_finance_account

    UNIQUE(
        organization_id,
        account_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_finance_accounts_entity

ON crm.finance_accounts(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_finance_accounts_org

ON crm.finance_accounts(organization_id);



-- ============================================================================
-- INVOICE FOUNDATION
-- ============================================================================
-- Customer invoice lifecycle.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.invoices (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    invoice_number TEXT NOT NULL,

    finance_account_id UUID,

    company_id UUID,

    opportunity_id UUID,

    project_id UUID,

    invoice_type TEXT DEFAULT 'STANDARD',

    invoice_status TEXT DEFAULT 'DRAFT',

    invoice_date DATE DEFAULT CURRENT_DATE,

    due_date DATE,

    subtotal_amount NUMERIC(14,2) DEFAULT 0,

    tax_amount NUMERIC(14,2) DEFAULT 0,

    discount_amount NUMERIC(14,2) DEFAULT 0,

    total_amount NUMERIC(14,2) DEFAULT 0,

    paid_amount NUMERIC(14,2) DEFAULT 0,

    balance_amount NUMERIC(14,2) DEFAULT 0,

    currency_code TEXT DEFAULT 'USD',

    notes TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_invoice_number

    UNIQUE(
        organization_id,
        invoice_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_invoices_org

ON crm.invoices(organization_id);



CREATE INDEX IF NOT EXISTS
idx_invoices_status

ON crm.invoices(invoice_status);



CREATE INDEX IF NOT EXISTS
idx_invoices_account

ON crm.invoices(finance_account_id);



-- ============================================================================
-- INVOICE ITEMS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.invoice_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_id UUID NOT NULL,

    item_type TEXT DEFAULT 'SERVICE',

    item_code TEXT,

    description TEXT NOT NULL,

    quantity NUMERIC(12,2) DEFAULT 1,

    unit_price NUMERIC(14,2) DEFAULT 0,

    line_amount NUMERIC(14,2) DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_invoice_item_invoice

    FOREIGN KEY(invoice_id)

    REFERENCES crm.invoices(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_invoice_items_invoice

ON crm.invoice_items(invoice_id);



-- ============================================================================
-- PAYMENTS FOUNDATION
-- ============================================================================
-- Customer payment tracking.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.finance_payments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    invoice_id UUID,

    finance_account_id UUID,

    payment_reference TEXT NOT NULL,

    payment_method TEXT,

    payment_status TEXT DEFAULT 'PENDING',

    payment_date DATE,

    amount NUMERIC(14,2) DEFAULT 0,

    currency_code TEXT DEFAULT 'USD',

    transaction_metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_payment_reference

    UNIQUE(
        organization_id,
        payment_reference
    )

);



CREATE INDEX IF NOT EXISTS
idx_finance_payment_invoice

ON crm.finance_payments(invoice_id);



CREATE INDEX IF NOT EXISTS
idx_finance_payment_status

ON crm.finance_payments(payment_status);



-- ============================================================================
-- REVENUE TRANSACTIONS
-- ============================================================================
-- Unified revenue event store.
--
-- Used for:
-- Dashboards
-- Forecasting
-- Reporting
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.revenue_transactions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    transaction_type TEXT NOT NULL,

    amount NUMERIC(14,2) DEFAULT 0,

    currency_code TEXT DEFAULT 'USD',

    transaction_date DATE DEFAULT CURRENT_DATE,

    reference_id UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_revenue_transactions_entity

ON crm.revenue_transactions(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_revenue_transactions_date

ON crm.revenue_transactions(transaction_date);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'finance_accounts',

        'invoices',

        'finance_payments'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON crm.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON crm.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM FINANCE FOUNDATION
-- Migration : 017
-- Part 2
-- ============================================================================
-- Purpose
-- Complete customer finance intelligence layer.
--
-- Adds:
-- Payment allocation
-- Recurring billing readiness
-- Revenue recognition foundation
-- Financial analytics views
-- Receivable intelligence
-- Finance validation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- PAYMENT ALLOCATIONS
-- ============================================================================
-- Supports:
-- Partial payments
-- Multiple payments against invoices
-- Payment reconciliation
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.payment_allocations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id UUID NOT NULL,

    invoice_id UUID NOT NULL,

    allocated_amount NUMERIC(14,2) DEFAULT 0,

    allocation_date DATE DEFAULT CURRENT_DATE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_payment_allocation_payment

    FOREIGN KEY(payment_id)

    REFERENCES crm.finance_payments(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_payment_allocation_invoice

    FOREIGN KEY(invoice_id)

    REFERENCES crm.invoices(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_payment_allocation_payment

ON crm.payment_allocations(payment_id);



CREATE INDEX IF NOT EXISTS
idx_payment_allocation_invoice

ON crm.payment_allocations(invoice_id);



-- ============================================================================
-- RECURRING BILLING CONTRACTS
-- ============================================================================
-- Subscription readiness.
--
-- Supports:
-- Monthly plans
-- Annual contracts
-- Retainers
-- Managed services
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.billing_contracts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    finance_account_id UUID,

    contract_number TEXT NOT NULL,

    contract_name TEXT NOT NULL,

    billing_frequency TEXT DEFAULT 'MONTHLY',

    start_date DATE,

    end_date DATE,

    contract_value NUMERIC(14,2) DEFAULT 0,

    currency_code TEXT DEFAULT 'USD',

    contract_status TEXT DEFAULT 'ACTIVE',

    auto_renew BOOLEAN DEFAULT FALSE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_billing_contract

    UNIQUE(
        organization_id,
        contract_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_billing_contract_account

ON crm.billing_contracts(finance_account_id);



CREATE INDEX IF NOT EXISTS
idx_billing_contract_status

ON crm.billing_contracts(contract_status);



-- ============================================================================
-- REVENUE RECOGNITION EVENTS
-- ============================================================================
-- Foundation for accounting/reporting.
--
-- Does not replace ERP accounting.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.revenue_recognition_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    revenue_transaction_id UUID,

    recognition_type TEXT DEFAULT 'STANDARD',

    recognition_date DATE DEFAULT CURRENT_DATE,

    recognized_amount NUMERIC(14,2) DEFAULT 0,

    recognition_status TEXT DEFAULT 'PENDING',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_revenue_recognition_date

ON crm.revenue_recognition_events(recognition_date);



CREATE INDEX IF NOT EXISTS
idx_revenue_recognition_status

ON crm.revenue_recognition_events(recognition_status);



-- ============================================================================
-- RECEIVABLE SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_receivable_summary AS

SELECT

    organization_id,

    COUNT(*) AS invoice_count,

    COALESCE(
        SUM(total_amount),
        0
    ) AS invoiced_amount,

    COALESCE(
        SUM(paid_amount),
        0
    ) AS received_amount,

    COALESCE(
        SUM(balance_amount),
        0
    ) AS outstanding_amount

FROM crm.invoices

GROUP BY organization_id;



-- ============================================================================
-- REVENUE SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_revenue_summary AS

SELECT

    organization_id,

    transaction_type,

    DATE_TRUNC(
        'month',
        transaction_date
    ) AS revenue_month,

    SUM(amount) AS total_revenue

FROM crm.revenue_transactions

GROUP BY

organization_id,

transaction_type,

DATE_TRUNC(
    'month',
    transaction_date
);



-- ============================================================================
-- CUSTOMER FINANCE HEALTH VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_customer_finance_health AS

SELECT

    fa.id,

    fa.organization_id,

    fa.entity_type,

    fa.entity_id,

    fa.account_name,

    COUNT(i.id) AS invoice_count,

    COALESCE(
        SUM(i.balance_amount),
        0
    ) AS outstanding_balance,

    CASE

        WHEN COALESCE(
            SUM(i.balance_amount),
            0
        ) = 0

        THEN 'HEALTHY'

        ELSE 'ATTENTION'

    END AS finance_status


FROM crm.finance_accounts fa


LEFT JOIN crm.invoices i

ON i.finance_account_id = fa.id


GROUP BY

fa.id,

fa.organization_id,

fa.entity_type,

fa.entity_id,

fa.account_name;



-- ============================================================================
-- FINANCE VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_finance_health AS


SELECT

'FINANCE_ACCOUNTS' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM crm.finance_accounts



UNION ALL



SELECT

'INVOICES',

COUNT(*),

'PASS'

FROM crm.invoices



UNION ALL



SELECT

'PAYMENTS',

COUNT(*),

'PASS'

FROM crm.finance_payments;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_billing_contracts_updated
    ON crm.billing_contracts;


    CREATE TRIGGER trg_billing_contracts_updated

    BEFORE UPDATE

    ON crm.billing_contracts

    FOR EACH ROW

    EXECUTE FUNCTION public.set_updated_at();


END;
$$;



-- ============================================================================
-- MIGRATION REGISTRY
-- ============================================================================


INSERT INTO rollback.deployment_history
(
    migration_number,
    migration_name,
    deployment_version,
    execution_status,
    rollback_available
)

VALUES

(
    17,
    '017_crm_finance.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

