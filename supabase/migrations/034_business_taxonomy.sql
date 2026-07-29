BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- BUSINESS TAXONOMY FOUNDATION
-- Migration : 034
-- ============================================================================
-- Purpose
-- Enterprise business classification framework.
--
-- Supports:
-- Product/service classification
-- CRM opportunity categorization
-- Revenue intelligence
-- Business capability mapping
-- Reporting hierarchy
-- AI classification foundation
--
-- Principles:
-- Metadata driven
-- Extensible
-- Industry independent
-- Multi-tenant ready
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS business;



-- ============================================================================
-- BUSINESS DOMAIN MASTER
-- ============================================================================
-- High level business capability areas.
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.domains

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    domain_code TEXT UNIQUE NOT NULL,

    domain_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 0,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_business_domains_active

ON business.domains(active);



-- ============================================================================
-- BUSINESS CATEGORY MASTER
-- ============================================================================
-- Groups capabilities within domains.
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.categories

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    domain_id UUID NOT NULL,

    category_code TEXT NOT NULL,

    category_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_business_category_domain

    FOREIGN KEY(domain_id)

    REFERENCES business.domains(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_business_category

    UNIQUE

    (

        domain_id,

        category_code

    )

);



CREATE INDEX IF NOT EXISTS

idx_business_categories_domain

ON business.categories(domain_id);



-- ============================================================================
-- BUSINESS CAPABILITY MASTER
-- ============================================================================
-- Detailed reusable capabilities.
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.capabilities

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL,

    capability_code TEXT UNIQUE NOT NULL,

    capability_name TEXT NOT NULL,

    description TEXT,

    capability_type TEXT DEFAULT 'SERVICE',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_capability_category

    FOREIGN KEY(category_id)

    REFERENCES business.categories(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_business_capability_category

ON business.capabilities(category_id);



-- ============================================================================
-- ORGANIZATION BUSINESS PROFILE
-- ============================================================================
-- Maps organizations to capabilities.
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.organization_capabilities

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    capability_id UUID NOT NULL,

    primary_capability BOOLEAN DEFAULT FALSE,

    maturity_level TEXT DEFAULT 'STANDARD',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_org_capability

    FOREIGN KEY(capability_id)

    REFERENCES business.capabilities(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_org_capability

    UNIQUE

    (

        organization_id,

        capability_id

    )

);



CREATE INDEX IF NOT EXISTS

idx_org_capability_org

ON business.organization_capabilities

(

    organization_id

);



-- ============================================================================
-- PRODUCT / SERVICE CATALOG
-- ============================================================================
-- Reusable commercial offering classification.
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.offerings

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    capability_id UUID,

    offering_code TEXT UNIQUE NOT NULL,

    offering_name TEXT NOT NULL,

    offering_type TEXT DEFAULT 'SERVICE',

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_offering_capability

    FOREIGN KEY(capability_id)

    REFERENCES business.capabilities(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_offerings_capability

ON business.offerings(capability_id);



-- ============================================================================
-- BUSINESS DOMAIN SEEDS
-- ============================================================================


INSERT INTO business.domains

(

    domain_code,

    domain_name,

    description,

    display_order

)

VALUES


(

    'DIGITAL',

    'Digital Transformation',

    'Digital products and technology services',

    1

),


(

    'CONSULTING',

    'Consulting',

    'Professional advisory services',

    2

),


(

    'OPERATIONS',

    'Business Operations',

    'Operational business capabilities',

    3

),


(

    'FINANCE',

    'Finance',

    'Financial business capabilities',

    4

),


(

    'MARKETING',

    'Marketing',

    'Marketing and customer growth',

    5

)


ON CONFLICT(domain_code)

DO UPDATE SET

domain_name = EXCLUDED.domain_name;



-- ============================================================================
-- BUSINESS CATEGORY SEEDS
-- ============================================================================


INSERT INTO business.categories

(

    domain_id,

    category_code,

    category_name,

    description

)


SELECT


    d.id,

    c.category_code,

    c.category_name,

    c.description



FROM business.domains d



JOIN

(

VALUES


(

    'DIGITAL',

    'SOFTWARE',

    'Software Development Services'

),


(

    'DIGITAL',

    'CLOUD',

    'Cloud Solutions'

),


(

    'CONSULTING',

    'STRATEGY',

    'Business Strategy Consulting'

),


(

    'MARKETING',

    'DIGITAL_MARKETING',

    'Digital Marketing Services'

),


(

    'OPERATIONS',

    'AUTOMATION',

    'Business Process Automation'

)

)

AS c(domain_code,category_code,category_name)



ON d.domain_code=c.domain_code



ON CONFLICT

(

    domain_id,

    category_code

)

DO UPDATE SET

category_name = EXCLUDED.category_name;

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- BUSINESS TAXONOMY FOUNDATION
-- Migration : 034
-- Part 2
-- ============================================================================
-- Purpose
-- Complete business capability intelligence layer.
--
-- Adds:
-- Capability catalog
-- Offering catalog
-- Revenue intelligence dimensions
-- Business analytics views
-- Organization scoring
-- Timestamp automation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- BUSINESS CAPABILITY SEEDS
-- ============================================================================


INSERT INTO business.capabilities

(

    category_id,

    capability_code,

    capability_name,

    description,

    capability_type

)


SELECT


    c.id,

    x.capability_code,

    x.capability_name,

    x.description,

    x.capability_type



FROM business.categories c



JOIN

(

VALUES


(

    'SOFTWARE',

    'WEB_DEVELOPMENT',

    'Web Application Development',

    'SERVICE'

),


(

    'SOFTWARE',

    'CRM_IMPLEMENTATION',

    'CRM Platform Implementation',

    'SERVICE'

),


(

    'CLOUD',

    'CLOUD_MIGRATION',

    'Cloud Migration Services',

    'SERVICE'

),


(

    'STRATEGY',

    'DIGITAL_STRATEGY',

    'Digital Strategy Consulting',

    'SERVICE'

),


(

    'DIGITAL_MARKETING',

    'SEO',

    'Search Engine Optimization',

    'SERVICE'

),


(

    'DIGITAL_MARKETING',

    'CONTENT_MARKETING',

    'Content Marketing',

    'SERVICE'

),


(

    'AUTOMATION',

    'WORKFLOW_AUTOMATION',

    'Workflow Automation',

    'SERVICE'

)

)

AS x

(

    category_code,

    capability_code,

    capability_name,

    capability_type

)



ON c.category_code=x.category_code



ON CONFLICT(capability_code)

DO UPDATE SET

capability_name = EXCLUDED.capability_name,

description = EXCLUDED.description;



-- ============================================================================
-- OFFERING CATALOG SEEDS
-- ============================================================================


INSERT INTO business.offerings

(

    capability_id,

    offering_code,

    offering_name,

    offering_type,

    description

)


SELECT


    c.id,

    o.offering_code,

    o.offering_name,

    o.offering_type,

    o.description



FROM business.capabilities c



JOIN

(

VALUES


(

    'WEB_DEVELOPMENT',

    'WEBSITE_BUILD',

    'Enterprise Website Development',

    'SERVICE',

    'Professional website engineering services'

),


(

    'CRM_IMPLEMENTATION',

    'CRM_SETUP',

    'CRM Implementation Services',

    'SERVICE',

    'CRM configuration and deployment'

),


(

    'SEO',

    'SEO_PACKAGE',

    'SEO Optimization Package',

    'SERVICE',

    'Search visibility improvement services'

),


(

    'WORKFLOW_AUTOMATION',

    'AUTOMATION_PACKAGE',

    'Business Workflow Automation',

    'SERVICE',

    'Automation design and implementation'

)

)

AS o

(

    capability_code,

    offering_code,

    offering_name,

    offering_type,

    description

)



ON c.capability_code=o.capability_code



ON CONFLICT(offering_code)

DO UPDATE SET

offering_name = EXCLUDED.offering_name,

description = EXCLUDED.description;



-- ============================================================================
-- BUSINESS TAXONOMY ANALYTICS VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_business_taxonomy_summary AS


SELECT


    d.domain_code,

    d.domain_name,


    COUNT(DISTINCT c.id)

    AS category_count,


    COUNT(DISTINCT cap.id)

    AS capability_count,


    COUNT(DISTINCT o.id)

    AS offering_count



FROM business.domains d



LEFT JOIN business.categories c

ON c.domain_id=d.id



LEFT JOIN business.capabilities cap

ON cap.category_id=c.id



LEFT JOIN business.offerings o

ON o.capability_id=cap.id



GROUP BY


d.domain_code,

d.domain_name;



-- ============================================================================
-- ORGANIZATION CAPABILITY INTELLIGENCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_organization_capability_profile AS


SELECT


    oc.organization_id,


    cap.capability_code,


    cap.capability_name,


    cat.category_name,


    d.domain_name,


    oc.primary_capability,


    oc.maturity_level



FROM business.organization_capabilities oc



JOIN business.capabilities cap

ON cap.id=oc.capability_id



JOIN business.categories cat

ON cat.id=cap.category_id



JOIN business.domains d

ON d.id=cat.domain_id;



-- ============================================================================
-- OFFERING REVENUE DIMENSION FOUNDATION
-- ============================================================================


CREATE TABLE IF NOT EXISTS business.offering_metrics

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    offering_id UUID NOT NULL,

    metric_code TEXT NOT NULL,

    metric_name TEXT NOT NULL,

    metric_value NUMERIC DEFAULT 0,

    period_start DATE,

    period_end DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_offering_metric

    FOREIGN KEY(offering_id)

    REFERENCES business.offerings(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_offering_metric

    UNIQUE

    (

        offering_id,

        metric_code,

        period_start,

        period_end

    )

);



CREATE INDEX IF NOT EXISTS

idx_offering_metrics_offering

ON business.offering_metrics(offering_id);



-- ============================================================================
-- CAPABILITY SCORE FOUNDATION
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_capability_adoption AS


SELECT


    cap.capability_code,

    cap.capability_name,


    COUNT(oc.organization_id)

    AS organization_count,


    AVG(

        CASE

            WHEN oc.maturity_level='ADVANCED'

            THEN 3

            WHEN oc.maturity_level='STANDARD'

            THEN 2

            ELSE 1

        END

    )

    AS maturity_score



FROM business.capabilities cap



LEFT JOIN business.organization_capabilities oc

ON oc.capability_id=cap.id



GROUP BY


cap.capability_code,

cap.capability_name;



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'domains',

        'categories',

        'capabilities',

        'offerings'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON business.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON business.%I
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

    34,

    '034_business_taxonomy.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;