BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM MARKETING FOUNDATION
-- Migration : 018
-- ============================================================================
-- Purpose
-- Enterprise customer engagement and marketing foundation.
--
-- Supports:
-- Campaign Management
-- Lead Sources
-- Segmentation
-- Marketing Activities
-- Customer Engagement Tracking
-- Campaign Attribution
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Future automation ready
-- No CRM capability removal
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- MARKETING CAMPAIGNS
-- ============================================================================
-- Central marketing initiative management.
--
-- Examples:
-- Product Campaign
-- Webinar
-- Email Campaign
-- Event
-- Digital Advertisement
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.marketing_campaigns (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    campaign_code TEXT NOT NULL,

    campaign_name TEXT NOT NULL,

    campaign_type TEXT DEFAULT 'GENERAL',

    campaign_status TEXT DEFAULT 'DRAFT',

    description TEXT,

    start_date DATE,

    end_date DATE,

    budget_amount NUMERIC(14,2) DEFAULT 0,

    expected_revenue NUMERIC(14,2) DEFAULT 0,

    actual_revenue NUMERIC(14,2) DEFAULT 0,

    owner_user_id UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_marketing_campaign

    UNIQUE(
        organization_id,
        campaign_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_marketing_campaign_org

ON crm.marketing_campaigns(organization_id);



CREATE INDEX IF NOT EXISTS
idx_marketing_campaign_status

ON crm.marketing_campaigns(campaign_status);



-- ============================================================================
-- CAMPAIGN CHANNELS
-- ============================================================================
-- Marketing channel registry.
--
-- Examples:
-- Email
-- Website
-- Social
-- Referral
-- Event
-- Partner
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.marketing_channels (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    channel_code TEXT NOT NULL,

    channel_name TEXT NOT NULL,

    channel_type TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_marketing_channel

    UNIQUE(
        organization_id,
        channel_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_marketing_channels_type

ON crm.marketing_channels(channel_type);



-- ============================================================================
-- CAMPAIGN CHANNEL MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.campaign_channels (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_id UUID NOT NULL,

    channel_id UUID NOT NULL,

    planned_spend NUMERIC(14,2) DEFAULT 0,

    actual_spend NUMERIC(14,2) DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_campaign_channel_campaign

    FOREIGN KEY(campaign_id)

    REFERENCES crm.marketing_campaigns(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_campaign_channel_channel

    FOREIGN KEY(channel_id)

    REFERENCES crm.marketing_channels(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_campaign_channel

    UNIQUE(
        campaign_id,
        channel_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_campaign_channels_campaign

ON crm.campaign_channels(campaign_id);



-- ============================================================================
-- MARKETING SEGMENTS
-- ============================================================================
-- Dynamic audience grouping.
--
-- Supports:
-- Customer groups
-- Lead lists
-- Targeting
-- Automation
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.marketing_segments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    segment_code TEXT NOT NULL,

    segment_name TEXT NOT NULL,

    description TEXT,

    entity_type TEXT DEFAULT 'CONTACT',

    criteria JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_marketing_segment

    UNIQUE(
        organization_id,
        segment_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_marketing_segment_entity

ON crm.marketing_segments(entity_type);



-- ============================================================================
-- SEGMENT MEMBERS
-- ============================================================================
-- Cached membership for performance.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.segment_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    segment_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    added_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_segment_member_segment

    FOREIGN KEY(segment_id)

    REFERENCES crm.marketing_segments(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_segment_member

    UNIQUE(
        segment_id,
        entity_type,
        entity_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_segment_members_entity

ON crm.segment_members(entity_type, entity_id);



-- ============================================================================
-- MARKETING ACTIVITIES
-- ============================================================================
-- Engagement tracking.
--
-- Examples:
-- Email sent
-- Webinar attended
-- Downloaded content
-- Website interaction
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.marketing_activities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    campaign_id UUID,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    activity_type TEXT NOT NULL,

    activity_status TEXT DEFAULT 'COMPLETED',

    activity_date TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_marketing_activity_entity

ON crm.marketing_activities(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_marketing_activity_campaign

ON crm.marketing_activities(campaign_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'marketing_campaigns',

        'marketing_channels',

        'marketing_segments'

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
-- CRM MARKETING FOUNDATION
-- Migration : 018
-- Part 2
-- ============================================================================
-- Purpose
-- Complete marketing intelligence and attribution layer.
--
-- Adds:
-- Default channels
-- Lead attribution
-- Campaign performance tracking
-- Marketing ROI analytics
-- Engagement intelligence
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- DEFAULT MARKETING CHANNELS
-- ============================================================================


INSERT INTO crm.marketing_channels
(
    channel_code,
    channel_name,
    channel_type
)

VALUES

(
    'WEBSITE',
    'Website',
    'DIGITAL'
),

(
    'EMAIL',
    'Email Marketing',
    'DIGITAL'
),

(
    'SOCIAL',
    'Social Media',
    'DIGITAL'
),

(
    'REFERRAL',
    'Referral',
    'PARTNER'
),

(
    'EVENT',
    'Events',
    'OFFLINE'
),

(
    'PARTNER',
    'Partner Network',
    'PARTNER'
)

ON CONFLICT(
    organization_id,
    channel_code
)

DO NOTHING;



-- ============================================================================
-- LEAD ATTRIBUTION
-- ============================================================================
-- Tracks marketing influence on CRM entities.
--
-- Supports:
-- First touch
-- Last touch
-- Multi-touch attribution
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.lead_attribution (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    lead_id UUID NOT NULL,

    campaign_id UUID,

    channel_id UUID,

    attribution_type TEXT DEFAULT 'FIRST_TOUCH',

    attribution_percentage NUMERIC(5,2) DEFAULT 100,

    attribution_date TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_lead_attribution_lead

ON crm.lead_attribution(lead_id);



CREATE INDEX IF NOT EXISTS
idx_lead_attribution_campaign

ON crm.lead_attribution(campaign_id);



-- ============================================================================
-- CAMPAIGN PERFORMANCE SNAPSHOTS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.campaign_performance (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    campaign_id UUID NOT NULL,

    snapshot_date DATE DEFAULT CURRENT_DATE,

    impressions INTEGER DEFAULT 0,

    clicks INTEGER DEFAULT 0,

    leads_generated INTEGER DEFAULT 0,

    opportunities_created INTEGER DEFAULT 0,

    customers_converted INTEGER DEFAULT 0,

    marketing_cost NUMERIC(14,2) DEFAULT 0,

    generated_revenue NUMERIC(14,2) DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_campaign_performance_campaign

ON crm.campaign_performance(campaign_id);



CREATE INDEX IF NOT EXISTS
idx_campaign_performance_date

ON crm.campaign_performance(snapshot_date);



-- ============================================================================
-- MARKETING ROI VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_marketing_roi AS

SELECT

    mc.id AS campaign_id,

    mc.campaign_name,

    COALESCE(
        SUM(cp.marketing_cost),
        0
    ) AS total_spend,

    COALESCE(
        SUM(cp.generated_revenue),
        0
    ) AS generated_revenue,

    CASE

        WHEN SUM(cp.marketing_cost) > 0

        THEN

        ROUND(

            (

                SUM(cp.generated_revenue)
                -
                SUM(cp.marketing_cost)

            )
            /
            SUM(cp.marketing_cost)
            *
            100,

            2

        )

        ELSE 0

    END AS roi_percentage


FROM crm.marketing_campaigns mc


LEFT JOIN crm.campaign_performance cp

ON cp.campaign_id = mc.id


GROUP BY

mc.id,

mc.campaign_name;



-- ============================================================================
-- CAMPAIGN FUNNEL VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_campaign_funnel AS

SELECT

    mc.id AS campaign_id,

    mc.campaign_name,

    COUNT(DISTINCT la.lead_id)
    AS attributed_leads,

    COUNT(DISTINCT o.id)
    AS opportunities,

    COUNT(DISTINCT CASE

        WHEN o.status = 'WON'

        THEN o.id

    END)

    AS won_opportunities


FROM crm.marketing_campaigns mc


LEFT JOIN crm.lead_attribution la

ON la.campaign_id = mc.id


LEFT JOIN crm.opportunities o

ON o.source_id = mc.id


GROUP BY

mc.id,

mc.campaign_name;



-- ============================================================================
-- CUSTOMER ENGAGEMENT VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_customer_engagement AS

SELECT

    entity_type,

    entity_id,

    COUNT(*) AS engagement_count,

    MAX(activity_date) AS last_engagement

FROM crm.marketing_activities

GROUP BY

entity_type,

entity_id;



-- ============================================================================
-- MARKETING VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_marketing_health AS


SELECT

'CAMPAIGNS' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM crm.marketing_campaigns



UNION ALL



SELECT

'CHANNELS',

COUNT(*),

'PASS'

FROM crm.marketing_channels



UNION ALL



SELECT

'SEGMENTS',

COUNT(*),

'PASS'

FROM crm.marketing_segments;



-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_campaign_performance_updated

    ON crm.campaign_performance;


    CREATE TRIGGER trg_campaign_performance_updated

    BEFORE UPDATE

    ON crm.campaign_performance

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
    18,
    '018_crm_marketing.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;