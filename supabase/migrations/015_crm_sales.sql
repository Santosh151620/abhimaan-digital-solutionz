BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM SALES FOUNDATION
-- Migration : 015
-- ============================================================================
-- Purpose
-- Enterprise sales capability foundation.
--
-- Supports:
-- Leads
-- Companies
-- Contacts
-- Opportunities
-- Sales Pipeline
-- Revenue Tracking
-- Forecasting foundation
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- No duplicate business logic
-- Preserve existing CRM capability
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- SALES PIPELINE DEFINITIONS
-- ============================================================================
-- Pipeline configuration.
--
-- Example:
-- New Lead
-- Qualification
-- Proposal
-- Negotiation
-- Won
-- Lost
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.sales_pipelines (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    pipeline_code TEXT NOT NULL,

    pipeline_name TEXT NOT NULL,

    description TEXT,

    is_default BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_sales_pipeline

    UNIQUE(
        organization_id,
        pipeline_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_sales_pipeline_org
ON crm.sales_pipelines(organization_id);



-- ============================================================================
-- PIPELINE STAGES
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.pipeline_stages (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    pipeline_id UUID NOT NULL,

    stage_code TEXT NOT NULL,

    stage_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    probability NUMERIC(5,2) DEFAULT 0,

    stage_type TEXT DEFAULT 'OPEN',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_pipeline_stage_pipeline

    FOREIGN KEY(pipeline_id)

    REFERENCES crm.sales_pipelines(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_pipeline_stage

    UNIQUE(
        pipeline_id,
        stage_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_pipeline_stage_pipeline
ON crm.pipeline_stages(pipeline_id);



CREATE INDEX IF NOT EXISTS
idx_pipeline_stage_order
ON crm.pipeline_stages(display_order);



-- ============================================================================
-- LEAD SALES EXTENSION
-- ============================================================================
-- Extends existing leads capability.
--
-- Does not replace public leads table.
-- Adds enterprise sales attributes.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.lead_sales (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    lead_id UUID NOT NULL,

    pipeline_id UUID,

    current_stage_id UUID,

    source_id UUID,

    owner_user_id UUID,

    team_id UUID,

    qualification_status TEXT DEFAULT 'NEW',

    score INTEGER DEFAULT 0,

    estimated_value NUMERIC(14,2) DEFAULT 0,

    expected_close_date DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_lead_sales

    UNIQUE(lead_id)

);



CREATE INDEX IF NOT EXISTS
idx_lead_sales_org
ON crm.lead_sales(organization_id);



CREATE INDEX IF NOT EXISTS
idx_lead_sales_stage
ON crm.lead_sales(current_stage_id);



-- ============================================================================
-- COMPANIES SALES PROFILE
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.company_sales_profiles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    company_id UUID NOT NULL,

    account_type TEXT DEFAULT 'CUSTOMER',

    industry TEXT,

    annual_revenue NUMERIC(14,2),

    employee_count INTEGER,

    customer_since DATE,

    account_status TEXT DEFAULT 'ACTIVE',

    owner_user_id UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_company_sales_profile

    UNIQUE(company_id)

);



CREATE INDEX IF NOT EXISTS
idx_company_sales_org
ON crm.company_sales_profiles(organization_id);



-- ============================================================================
-- CONTACT SALES PROFILE
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.contact_sales_profiles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    contact_id UUID NOT NULL,

    contact_role TEXT,

    decision_level TEXT,

    influence_level TEXT,

    preferred_channel TEXT,

    owner_user_id UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_contact_sales_profile

    UNIQUE(contact_id)

);



CREATE INDEX IF NOT EXISTS
idx_contact_sales_org
ON crm.contact_sales_profiles(organization_id);



-- ============================================================================
-- OPPORTUNITIES
-- ============================================================================
-- Core sales opportunity entity.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.opportunities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    opportunity_number TEXT NOT NULL,

    opportunity_name TEXT NOT NULL,

    company_id UUID,

    primary_contact_id UUID,

    pipeline_id UUID,

    stage_id UUID,

    owner_user_id UUID,

    team_id UUID,

    source_id UUID,

    status TEXT DEFAULT 'OPEN',

    amount NUMERIC(14,2) DEFAULT 0,

    probability NUMERIC(5,2) DEFAULT 0,

    expected_close_date DATE,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_opportunity_number

    UNIQUE(
        organization_id,
        opportunity_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_opportunities_org
ON crm.opportunities(organization_id);



CREATE INDEX IF NOT EXISTS
idx_opportunities_stage
ON crm.opportunities(stage_id);



CREATE INDEX IF NOT EXISTS
idx_opportunities_owner
ON crm.opportunities(owner_user_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'sales_pipelines',

        'pipeline_stages',

        'lead_sales',

        'company_sales_profiles',

        'contact_sales_profiles',

        'opportunities'

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

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM SALES FOUNDATION
-- Migration : 015
-- Part 2
-- ============================================================================
-- Purpose
-- Complete enterprise sales operating layer.
--
-- Adds:
-- Default pipelines
-- Stage history
-- Sales forecast foundation
-- Revenue intelligence views
-- Sales validation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- DEFAULT SALES PIPELINE
-- ============================================================================


INSERT INTO crm.sales_pipelines
(
    organization_id,
    pipeline_code,
    pipeline_name,
    description,
    is_default
)

SELECT

id,

'DEFAULT_SALES',

'Standard Sales Pipeline',

'Enterprise sales opportunity lifecycle',

TRUE

FROM public.organizations

ON CONFLICT(
    organization_id,
    pipeline_code
)

DO NOTHING;



-- ============================================================================
-- DEFAULT PIPELINE STAGES
-- ============================================================================


INSERT INTO crm.pipeline_stages
(
    pipeline_id,
    stage_code,
    stage_name,
    display_order,
    probability,
    stage_type
)

SELECT

sp.id,

stage.stage_code,

stage.stage_name,

stage.display_order,

stage.probability,

stage.stage_type

FROM crm.sales_pipelines sp

CROSS JOIN
(
    VALUES

    (
        'NEW',
        'New',
        1,
        10,
        'OPEN'
    ),

    (
        'QUALIFICATION',
        'Qualification',
        2,
        25,
        'OPEN'
    ),

    (
        'PROPOSAL',
        'Proposal',
        3,
        50,
        'OPEN'
    ),

    (
        'NEGOTIATION',
        'Negotiation',
        4,
        75,
        'OPEN'
    ),

    (
        'WON',
        'Won',
        5,
        100,
        'WON'
    ),

    (
        'LOST',
        'Lost',
        6,
        0,
        'LOST'
    )

)
AS stage
(
    stage_code,
    stage_name,
    display_order,
    probability,
    stage_type
)

ON CONFLICT(
    pipeline_id,
    stage_code
)

DO NOTHING;



-- ============================================================================
-- OPPORTUNITY STAGE HISTORY
-- ============================================================================
-- Tracks opportunity movement.
--
-- Used for:
-- Sales velocity
-- Conversion analytics
-- Forecast accuracy
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.opportunity_stage_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    opportunity_id UUID NOT NULL,

    previous_stage_id UUID,

    new_stage_id UUID NOT NULL,

    changed_by UUID,

    change_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_opportunity_stage_history_opportunity

ON crm.opportunity_stage_history(opportunity_id);



CREATE INDEX IF NOT EXISTS
idx_opportunity_stage_history_date

ON crm.opportunity_stage_history(created_at);



-- ============================================================================
-- SALES FORECAST SNAPSHOTS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.sales_forecast_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    forecast_period DATE NOT NULL,

    owner_user_id UUID,

    team_id UUID,

    total_pipeline_value NUMERIC(14,2) DEFAULT 0,

    weighted_pipeline_value NUMERIC(14,2) DEFAULT 0,

    expected_revenue NUMERIC(14,2) DEFAULT 0,

    closed_revenue NUMERIC(14,2) DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_sales_forecast_org

ON crm.sales_forecast_snapshots(organization_id);



CREATE INDEX IF NOT EXISTS
idx_sales_forecast_period

ON crm.sales_forecast_snapshots(forecast_period);



-- ============================================================================
-- SALES PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_sales_pipeline_summary AS

SELECT

    sp.pipeline_name,

    ps.stage_name,

    ps.probability,

    COUNT(o.id) AS opportunity_count,

    COALESCE(
        SUM(o.amount),
        0
    ) AS pipeline_value,

    COALESCE(
        SUM(
            o.amount *
            ps.probability /
            100
        ),
        0
    ) AS weighted_value

FROM crm.sales_pipelines sp

JOIN crm.pipeline_stages ps

ON ps.pipeline_id = sp.id

LEFT JOIN crm.opportunities o

ON o.stage_id = ps.id

GROUP BY

sp.pipeline_name,

ps.stage_name,

ps.probability;



-- ============================================================================
-- OPPORTUNITY OWNER SUMMARY
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_sales_owner_summary AS

SELECT

owner_user_id,

COUNT(*) AS opportunities,

COALESCE(
    SUM(amount),
    0
) AS total_value,

COALESCE(
    AVG(probability),
    0
) AS average_probability

FROM crm.opportunities

GROUP BY owner_user_id;



-- ============================================================================
-- SALES FOUNDATION VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_sales_health AS


SELECT

'PIPELINES' AS check_name,

COUNT(*) AS total_records,

CASE

WHEN COUNT(*) > 0

THEN 'PASS'

ELSE 'FAIL'

END AS status

FROM crm.sales_pipelines



UNION ALL



SELECT

'PIPELINE_STAGES',

COUNT(*),

CASE

WHEN COUNT(*) >= 6

THEN 'PASS'

ELSE 'FAIL'

END

FROM crm.pipeline_stages



UNION ALL



SELECT

'OPPORTUNITIES',

COUNT(*),

'PASS'

FROM crm.opportunities;



-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================


DO
$$
BEGIN

    DROP TRIGGER IF EXISTS trg_sales_forecast_snapshots_updated
    ON crm.sales_forecast_snapshots;


    CREATE TRIGGER trg_sales_forecast_snapshots_updated

    BEFORE UPDATE

    ON crm.sales_forecast_snapshots

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
    15,
    '015_crm_sales.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;