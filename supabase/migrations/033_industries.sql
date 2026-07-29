BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- INDUSTRY TAXONOMY FOUNDATION
-- Migration : 033
-- ============================================================================
-- Purpose
-- Enterprise industry classification framework.
--
-- Supports:
-- Customer segmentation
-- CRM intelligence
-- Sales analytics
-- Market classification
-- AI recommendations
-- Reporting dimensions
-- Organization profiling
--
-- Principles:
-- Hierarchical taxonomy
-- Extensible
-- Multi-industry support
-- No hard-coded business logic
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS industry;



-- ============================================================================
-- INDUSTRY CATEGORY MASTER
-- ============================================================================
-- Top-level industry classification.
-- ============================================================================


CREATE TABLE IF NOT EXISTS industry.categories

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT UNIQUE NOT NULL,

    category_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 0,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_industry_categories_active

ON industry.categories(active);



-- ============================================================================
-- INDUSTRY MASTER
-- ============================================================================
-- Detailed industry classification.
-- ============================================================================


CREATE TABLE IF NOT EXISTS industry.industries

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID,

    industry_code TEXT UNIQUE NOT NULL,

    industry_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_industry_category

    FOREIGN KEY(category_id)

    REFERENCES industry.categories(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_industries_category

ON industry.industries(category_id);



CREATE INDEX IF NOT EXISTS

idx_industries_active

ON industry.industries(active);



-- ============================================================================
-- SUB INDUSTRY MASTER
-- ============================================================================
-- Supports deeper segmentation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS industry.sub_industries

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    industry_id UUID NOT NULL,

    sub_industry_code TEXT NOT NULL,

    sub_industry_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_sub_industry

    FOREIGN KEY(industry_id)

    REFERENCES industry.industries(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_sub_industry

    UNIQUE

    (

        industry_id,

        sub_industry_code

    )

);



CREATE INDEX IF NOT EXISTS

idx_sub_industry_parent

ON industry.sub_industries(industry_id);



-- ============================================================================
-- ORGANIZATION INDUSTRY MAPPING
-- ============================================================================
-- Allows multiple industries per organization.
-- ============================================================================


CREATE TABLE IF NOT EXISTS industry.organization_industries

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    industry_id UUID NOT NULL,

    primary_industry BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_org_industry

    FOREIGN KEY(industry_id)

    REFERENCES industry.industries(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_org_industry

    UNIQUE

    (

        organization_id,

        industry_id

    )

);



CREATE INDEX IF NOT EXISTS

idx_org_industry_org

ON industry.organization_industries

(

    organization_id

);



-- ============================================================================
-- INDUSTRY CATEGORY SEEDS
-- ============================================================================


INSERT INTO industry.categories

(

    category_code,

    category_name,

    description,

    display_order

)

VALUES


(

    'TECHNOLOGY',

    'Technology',

    'Software, IT and digital businesses',

    1

),


(

    'FINANCIAL',

    'Financial Services',

    'Banking, insurance and finance',

    2

),


(

    'HEALTHCARE',

    'Healthcare',

    'Healthcare and life sciences',

    3

),


(

    'MANUFACTURING',

    'Manufacturing',

    'Industrial and manufacturing sectors',

    4

),


(

    'RETAIL',

    'Retail and Consumer',

    'Retail and consumer businesses',

    5

),


(

    'EDUCATION',

    'Education',

    'Education and training',

    6

)


ON CONFLICT(category_code)

DO UPDATE SET

category_name = EXCLUDED.category_name,

description = EXCLUDED.description;



-- ============================================================================
-- INDUSTRY SEEDS
-- ============================================================================


INSERT INTO industry.industries

(

    category_id,

    industry_code,

    industry_name,

    description

)

SELECT

    c.id,

    i.industry_code,

    i.industry_name,

    i.description


FROM industry.categories c


JOIN

(

VALUES

(

    'TECHNOLOGY',

    'SOFTWARE',

    'Software Development'

),

(

    'TECHNOLOGY',

    'IT_SERVICES',

    'IT Services and Consulting'

),

(

    'FINANCIAL',

    'BANKING',

    'Banking Services'

),

(

    'HEALTHCARE',

    'HOSPITALS',

    'Hospitals and Healthcare Providers'

),

(

    'MANUFACTURING',

    'AUTOMOTIVE',

    'Automotive Manufacturing'

),

(

    'RETAIL',

    'ECOMMERCE',

    'E-Commerce Businesses'

),

(

    'EDUCATION',

    'EDTECH',

    'Education Technology'

)

)

AS i(category_code,industry_code,industry_name)


ON c.category_code=i.category_code



ON CONFLICT(industry_code)

DO UPDATE SET

industry_name = EXCLUDED.industry_name;

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- INDUSTRY TAXONOMY FOUNDATION
-- Migration : 033
-- Part 2
-- ============================================================================
-- Purpose
-- Complete industry intelligence layer.
--
-- Adds:
-- Sub-industry taxonomy
-- Industry analytics
-- Customer segmentation
-- Organization intelligence
-- AI recommendation foundation
-- Timestamp automation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- SUB INDUSTRY SEEDS
-- ============================================================================


INSERT INTO industry.sub_industries

(

    industry_id,

    sub_industry_code,

    sub_industry_name,

    description

)


SELECT

    i.id,

    s.sub_industry_code,

    s.sub_industry_name,

    s.description



FROM industry.industries i


JOIN

(

VALUES


(

    'SOFTWARE',

    'SAAS',

    'Software as a Service Platforms'

),


(

    'SOFTWARE',

    'MOBILE_APP',

    'Mobile Application Development'

),


(

    'IT_SERVICES',

    'CONSULTING',

    'IT Consulting Services'

),


(

    'IT_SERVICES',

    'CLOUD',

    'Cloud Infrastructure Services'

),


(

    'BANKING',

    'FINTECH',

    'Financial Technology'

),


(

    'HOSPITALS',

    'CLINICAL',

    'Clinical Healthcare Services'

),


(

    'AUTOMOTIVE',

    'AUTO_COMPONENTS',

    'Automotive Components'

),


(

    'ECOMMERCE',

    'ONLINE_RETAIL',

    'Online Retail Platforms'

),


(

    'EDTECH',

    'ONLINE_LEARNING',

    'Online Learning Platforms'

)


)

AS s

(

    industry_code,

    sub_industry_code,

    sub_industry_name

)


ON i.industry_code=s.industry_code



ON CONFLICT

(

    industry_id,

    sub_industry_code

)

DO UPDATE SET

sub_industry_name = EXCLUDED.sub_industry_name;



-- ============================================================================
-- INDUSTRY CUSTOMER SEGMENT VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_industry_customer_segment AS


SELECT


    oi.organization_id,


    ic.category_name,


    i.industry_name,


    COUNT(oi.organization_id)

    OVER

    (

        PARTITION BY i.industry_id

    )

    AS industry_customer_count



FROM industry.organization_industries oi



JOIN industry.industries i

ON i.id = oi.industry_id



JOIN industry.categories ic

ON ic.id = i.category_id;



-- ============================================================================
-- INDUSTRY DISTRIBUTION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_industry_distribution AS


SELECT


    ic.category_code,


    ic.category_name,


    COUNT(i.id)

    AS industry_count



FROM industry.categories ic



LEFT JOIN industry.industries i

ON i.category_id = ic.id



GROUP BY


ic.category_code,

ic.category_name;



-- ============================================================================
-- ORGANIZATION INDUSTRY PROFILE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_organization_industry_profile AS


SELECT


    oi.organization_id,


    i.industry_code,


    i.industry_name,


    ic.category_name,


    oi.primary_industry



FROM industry.organization_industries oi



JOIN industry.industries i

ON i.id = oi.industry_id



JOIN industry.categories ic

ON ic.id = i.category_id;



-- ============================================================================
-- AI INDUSTRY RECOMMENDATION FOUNDATION
-- ============================================================================


CREATE TABLE IF NOT EXISTS industry.industry_signals

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    industry_id UUID NOT NULL,

    signal_code TEXT NOT NULL,

    signal_name TEXT NOT NULL,

    weight NUMERIC DEFAULT 1,


    metadata JSONB DEFAULT '{}'::jsonb,


    active BOOLEAN DEFAULT TRUE,


    created_at TIMESTAMPTZ DEFAULT NOW(),



    CONSTRAINT fk_signal_industry

    FOREIGN KEY(industry_id)

    REFERENCES industry.industries(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_industry_signal

    UNIQUE

    (

        industry_id,

        signal_code

    )

);



INSERT INTO industry.industry_signals

(

    industry_id,

    signal_code,

    signal_name,

    weight

)


SELECT


    id,

    'DIGITAL_MATURITY',

    'Digital maturity indicator',

    1.0



FROM industry.industries



ON CONFLICT

(

    industry_id,

    signal_code

)

DO NOTHING;



-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS

idx_industry_signal_active

ON industry.industry_signals(active);



CREATE INDEX IF NOT EXISTS

idx_org_industries_primary

ON industry.organization_industries

(

    organization_id,

    primary_industry

);



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'categories',

        'industries',

        'sub_industries'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON industry.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON industry.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl,

            tbl

        );


    END LOOP;


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

    33,

    '033_industries.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;