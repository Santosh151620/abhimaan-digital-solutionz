BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM FOUNDATION
-- Migration : 014
-- ============================================================================
-- Purpose
-- Establish enterprise CRM foundation.
--
-- Supports:
-- Companies
-- Contacts
-- Leads
-- Opportunities
-- Activities
-- Notes
-- Tasks
-- Pipeline
-- Quotations
-- Future CRM modules
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Multi-module reusable
-- No business logic duplication
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- CRM ENTITY TYPES
-- ============================================================================
-- Central entity registry.
--
-- Avoids module-specific foreign key dependency.
-- Supports:
-- entityType + entityId architecture
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.entity_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_code TEXT NOT NULL UNIQUE,

    entity_name TEXT NOT NULL,

    module_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_crm_entity_types_module
ON crm.entity_types(module_name);



CREATE INDEX IF NOT EXISTS
idx_crm_entity_types_status
ON crm.entity_types(active);



-- ============================================================================
-- CRM CUSTOM FIELDS
-- ============================================================================
-- Dynamic metadata extension.
--
-- Enables:
-- Industry specific customization
-- SaaS extensibility
-- No schema explosion
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.custom_fields (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    field_code TEXT NOT NULL,

    field_name TEXT NOT NULL,

    field_type TEXT NOT NULL,

    required BOOLEAN DEFAULT FALSE,

    configuration JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_custom_field

    UNIQUE(
        organization_id,
        entity_type,
        field_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_custom_fields_org
ON crm.custom_fields(organization_id);



CREATE INDEX IF NOT EXISTS
idx_custom_fields_entity
ON crm.custom_fields(entity_type);



-- ============================================================================
-- CRM ENTITY METADATA
-- ============================================================================
-- Generic extension storage.
--
-- Used by:
-- Companies
-- Contacts
-- Leads
-- Opportunities
-- Projects
-- Tickets
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.entity_metadata (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_entity_metadata_entity
ON crm.entity_metadata(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_entity_metadata_org
ON crm.entity_metadata(organization_id);



-- ============================================================================
-- CRM TAGS
-- ============================================================================
-- Universal tagging system.
--
-- Supports:
-- Leads
-- Contacts
-- Companies
-- Opportunities
-- Activities
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.tags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    tag_name TEXT NOT NULL,

    tag_color TEXT,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_crm_tag

    UNIQUE(
        organization_id,
        tag_name
    )

);



CREATE INDEX IF NOT EXISTS
idx_crm_tags_org
ON crm.tags(organization_id);



-- ============================================================================
-- ENTITY TAG MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.entity_tags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tag_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_entity_tag

    FOREIGN KEY(tag_id)

    REFERENCES crm.tags(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_entity_tag

    UNIQUE(
        tag_id,
        entity_type,
        entity_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_entity_tags_entity
ON crm.entity_tags(entity_type, entity_id);



-- ============================================================================
-- CRM STATUS DEFINITIONS
-- ============================================================================
-- Shared status registry.
--
-- Examples:
-- Lead Status
-- Opportunity Status
-- Ticket Status
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.status_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    entity_type TEXT NOT NULL,

    status_code TEXT NOT NULL,

    status_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    is_default BOOLEAN DEFAULT FALSE,

    is_terminal BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_entity_status

    UNIQUE(
        organization_id,
        entity_type,
        status_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_status_definition_entity
ON crm.status_definitions(entity_type);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'entity_types',

        'custom_fields',

        'entity_metadata',

        'tags',

        'status_definitions'

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
-- CRM FOUNDATION
-- Migration : 014
-- Part 2
-- ============================================================================
-- Purpose
-- Complete CRM shared operational foundation.
--
-- Adds:
-- Activities
-- Notes
-- Timeline
-- Ownership
-- Teams
-- Sources
-- Default entity registry
-- Default CRM states
-- Validation layer
-- ============================================================================



-- ============================================================================
-- CRM TEAMS
-- ============================================================================
-- Supports:
-- Sales teams
-- Support teams
-- Department ownership
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.teams (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    team_code TEXT NOT NULL,

    team_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_crm_team

    UNIQUE(
        organization_id,
        team_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_crm_team_org
ON crm.teams(organization_id);



-- ============================================================================
-- CRM TEAM MEMBERS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.team_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    team_id UUID NOT NULL,

    user_id UUID NOT NULL,

    role TEXT DEFAULT 'MEMBER',

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_team_member_team

    FOREIGN KEY(team_id)

    REFERENCES crm.teams(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_team_member

    UNIQUE(
        team_id,
        user_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_team_members_user
ON crm.team_members(user_id);



-- ============================================================================
-- CRM OWNERSHIP
-- ============================================================================
-- Universal assignment model.
--
-- Avoids:
-- lead_owner
-- contact_owner
-- company_owner
-- duplication.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.entity_ownership (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    owner_user_id UUID,

    owner_team_id UUID,

    assigned_by UUID,

    assigned_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_entity_owner

    UNIQUE(
        entity_type,
        entity_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_entity_owner_entity
ON crm.entity_ownership(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_entity_owner_user
ON crm.entity_ownership(owner_user_id);



-- ============================================================================
-- CRM ACTIVITIES
-- ============================================================================
-- Universal activity engine foundation.
--
-- Used by:
-- Calls
-- Meetings
-- Emails
-- Follow-ups
-- Tasks
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.activities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    activity_type TEXT NOT NULL,

    title TEXT NOT NULL,

    description TEXT,

    activity_status TEXT DEFAULT 'OPEN',

    priority TEXT DEFAULT 'NORMAL',

    assigned_to UUID,

    due_date TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_crm_activity_entity
ON crm.activities(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_crm_activity_assignee
ON crm.activities(assigned_to);



-- ============================================================================
-- CRM NOTES
-- ============================================================================
-- Universal notes engine.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.notes (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    note_text TEXT NOT NULL,

    visibility TEXT DEFAULT 'INTERNAL',

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_crm_notes_entity
ON crm.notes(entity_type, entity_id);



-- ============================================================================
-- CRM TIMELINE
-- ============================================================================
-- Unified customer interaction history.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.timeline_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    event_type TEXT NOT NULL,

    event_title TEXT NOT NULL,

    event_description TEXT,

    actor_id UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_timeline_entity
ON crm.timeline_events(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_timeline_date
ON crm.timeline_events(created_at);



-- ============================================================================
-- CRM SOURCES
-- ============================================================================
-- Lead/customer acquisition sources.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.sources (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    source_code TEXT NOT NULL,

    source_name TEXT NOT NULL,

    source_type TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_crm_source

    UNIQUE(
        organization_id,
        source_code
    )

);



-- ============================================================================
-- DEFAULT ENTITY TYPES
-- ============================================================================


INSERT INTO crm.entity_types
(
    entity_code,
    entity_name,
    module_name,
    description
)

VALUES


(
    'LEAD',
    'Lead',
    'CRM',
    'Potential customer'
),


(
    'COMPANY',
    'Company',
    'CRM',
    'Customer organization'
),


(
    'CONTACT',
    'Contact',
    'CRM',
    'Customer contact'
),


(
    'OPPORTUNITY',
    'Opportunity',
    'CRM',
    'Sales opportunity'
),


(
    'PROJECT',
    'Project',
    'CRM',
    'Customer project'
),


(
    'TICKET',
    'Ticket',
    'CRM',
    'Customer service request'
)


ON CONFLICT(entity_code)
DO NOTHING;



-- ============================================================================
-- CRM VALIDATION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_foundation_health AS


SELECT

'ENTITY_TYPES' AS check_name,

COUNT(*) AS total_records,

CASE

WHEN COUNT(*) >= 6

THEN 'PASS'

ELSE 'FAIL'

END AS status

FROM crm.entity_types



UNION ALL



SELECT

'ACTIVITY_ENGINE',

COUNT(*),

'PASS'

FROM crm.activities



UNION ALL



SELECT

'NOTES_ENGINE',

COUNT(*),

'PASS'

FROM crm.notes;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'teams',

        'custom_fields',

        'entity_metadata',

        'tags',

        'status_definitions',

        'activities',

        'notes',

        'sources'

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
    14,
    '014_crm_foundation.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

