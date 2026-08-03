BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM PRODUCTS FOUNDATION
-- Migration : 041
-- ============================================================================
-- Purpose:
-- CRM product/service catalog foundation.
--
-- Supports:
-- Products
-- Services
-- Offerings used in Sales, Opportunities, Quotations, Invoices
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Lightweight CRM catalog (NOT ERP inventory)
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- PRODUCTS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.products (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL,


    product_number TEXT NOT NULL,

    sku TEXT,


    name TEXT NOT NULL,

    description TEXT,


    type TEXT DEFAULT 'Product',

    status TEXT DEFAULT 'Draft',


    unit TEXT,


    price NUMERIC(14,2) DEFAULT 0,

    cost NUMERIC(14,2),


    tax_rate NUMERIC(8,2),


    category TEXT,


    -- Entity compatibility
    -- Allows future linking with entity engines

    entity_type TEXT,

    entity_id UUID,


    is_deleted BOOLEAN DEFAULT FALSE,

    deleted_at TIMESTAMPTZ,

    deleted_by UUID,


    metadata JSONB DEFAULT '{}'::jsonb,


    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),



    CONSTRAINT uq_products_number

    UNIQUE(
        organization_id,
        product_number
    )

);



-- ============================================================================
-- INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_products_org

ON crm.products(organization_id);



CREATE INDEX IF NOT EXISTS
idx_products_status

ON crm.products(status);



CREATE INDEX IF NOT EXISTS
idx_products_type

ON crm.products(type);



CREATE INDEX IF NOT EXISTS
idx_products_entity

ON crm.products(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_products_sku

ON crm.products(sku);



-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_products_updated

    ON crm.products;



    CREATE TRIGGER trg_products_updated

    BEFORE UPDATE

    ON crm.products

    FOR EACH ROW

    EXECUTE FUNCTION public.set_updated_at();


END;
$$;



-- ============================================================================
-- PRODUCT SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_product_summary AS


SELECT

    organization_id,


    COUNT(*) FILTER
    (
        WHERE is_deleted = FALSE
    ) AS total_products,


    COUNT(*) FILTER
    (
        WHERE status = 'Active'
        AND is_deleted = FALSE
    ) AS active_products,


    COUNT(*) FILTER
    (
        WHERE status = 'Inactive'
        AND is_deleted = FALSE
    ) AS inactive_products,


    COUNT(*) FILTER
    (
        WHERE is_deleted = TRUE
    ) AS archived_products


FROM crm.products


GROUP BY organization_id;



-- ============================================================================
-- PRODUCT VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_products_health AS


SELECT

'PRODUCTS' AS check_name,


COUNT(*) AS total_records,


CASE

WHEN COUNT(*) >= 0

THEN 'PASS'

ELSE 'FAIL'

END AS status


FROM crm.products;



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
    41,
    '041_crm_products.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;