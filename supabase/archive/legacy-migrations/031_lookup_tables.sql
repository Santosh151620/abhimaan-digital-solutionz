BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE LOOKUP TABLE FOUNDATION
-- Migration : 031
-- ============================================================================
-- Purpose
-- Metadata-driven shared lookup architecture.
--
-- Supports:
-- CRM dropdown configuration
-- Status management
-- Category management
-- Priority handling
-- Currency references
-- Language/timezone references
-- Future module extensibility
--
-- Principles:
-- Generic reusable master data
-- No hard-coded module logic
-- Idempotent
-- Organization extensible
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS lookup;



-- ============================================================================
-- LOOKUP GROUPS
-- ============================================================================
-- Defines lookup categories.
--
-- Examples:
-- Lead Status
-- Priority
-- Industry
-- Currency
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.lookup_groups

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    group_code TEXT UNIQUE NOT NULL,

    group_name TEXT NOT NULL,

    description TEXT,

    module_name TEXT,

    system_defined BOOLEAN DEFAULT TRUE,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_lookup_groups_module

ON lookup.lookup_groups(module_name);



-- ============================================================================
-- LOOKUP VALUES
-- ============================================================================
-- Generic lookup value repository.
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.lookup_values

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    group_id UUID NOT NULL,

    value_code TEXT NOT NULL,

    value_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 0,

    color_code TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_lookup_group

    FOREIGN KEY(group_id)

    REFERENCES lookup.lookup_groups(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_lookup_value

    UNIQUE(

        group_id,

        value_code

    )

);



CREATE INDEX IF NOT EXISTS
idx_lookup_values_group

ON lookup.lookup_values(group_id);



CREATE INDEX IF NOT EXISTS
idx_lookup_values_active

ON lookup.lookup_values(active);



-- ============================================================================
-- ORGANIZATION CUSTOM LOOKUPS
-- ============================================================================
-- Allows tenant-specific extensions.
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.organization_lookup_values

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    group_id UUID NOT NULL,

    value_code TEXT NOT NULL,

    value_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_org_lookup_group

    FOREIGN KEY(group_id)

    REFERENCES lookup.lookup_groups(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_org_lookup_value

    UNIQUE(

        organization_id,

        group_id,

        value_code

    )

);



CREATE INDEX IF NOT EXISTS
idx_org_lookup_org

ON lookup.organization_lookup_values

(

    organization_id

);



-- ============================================================================
-- STANDARD LOOKUP GROUP SEEDS
-- ============================================================================


INSERT INTO lookup.lookup_groups

(

    group_code,

    group_name,

    description,

    module_name

)

VALUES


(

    'PRIORITY',

    'Priority',

    'Record priority levels',

    'CORE'

),


(

    'LEAD_SOURCE',

    'Lead Source',

    'Lead origin channels',

    'CRM'

),


(

    'CONTACT_TYPE',

    'Contact Type',

    'Contact classification',

    'CRM'

),


(

    'CUSTOMER_TYPE',

    'Customer Type',

    'Customer classification',

    'CRM'

),


(

    'TASK_PRIORITY',

    'Task Priority',

    'Task urgency levels',

    'TASK'

),


(

    'DOCUMENT_TYPE',

    'Document Type',

    'Document classification',

    'CORE'

)


ON CONFLICT(group_code)

DO UPDATE SET

group_name = EXCLUDED.group_name,

description = EXCLUDED.description;



-- ============================================================================
-- PRIORITY VALUES
-- ============================================================================


INSERT INTO lookup.lookup_values

(

    group_id,

    value_code,

    value_name,

    display_order

)


SELECT

    id,

    'LOW',

    'Low',

    1


FROM lookup.lookup_groups

WHERE group_code='PRIORITY'



ON CONFLICT(

    group_id,

    value_code

)

DO NOTHING;



INSERT INTO lookup.lookup_values

(

    group_id,

    value_code,

    value_name,

    display_order

)


SELECT

    id,

    'MEDIUM',

    'Medium',

    2


FROM lookup.lookup_groups

WHERE group_code='PRIORITY'



ON CONFLICT(

    group_id,

    value_code

)

DO NOTHING;



INSERT INTO lookup.lookup_values

(

    group_id,

    value_code,

    value_name,

    display_order

)


SELECT

    id,

    'HIGH',

    'High',

    3


FROM lookup.lookup_groups

WHERE group_code='PRIORITY'



ON CONFLICT(

    group_id,

    value_code

)

DO NOTHING;



INSERT INTO lookup.lookup_values

(

    group_id,

    value_code,

    value_name,

    display_order

)


SELECT

    id,

    'URGENT',

    'Urgent',

    4


FROM lookup.lookup_groups

WHERE group_code='PRIORITY'



ON CONFLICT(

    group_id,

    value_code

)

DO NOTHING;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE LOOKUP TABLE FOUNDATION
-- Migration : 031
-- Part 2
-- ============================================================================
-- Purpose
-- Complete shared lookup catalog.
--
-- Adds:
-- CRM reference values
-- Task/document references
-- Currency master
-- Language master
-- Timezone master
-- Validation views
-- Trigger alignment
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- LEAD SOURCE VALUES
-- ============================================================================


INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'WEBSITE',

'Website',

1

FROM lookup.lookup_groups

WHERE group_code='LEAD_SOURCE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'REFERRAL',

'Referral',

2

FROM lookup.lookup_groups

WHERE group_code='LEAD_SOURCE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'SOCIAL_MEDIA',

'Social Media',

3

FROM lookup.lookup_groups

WHERE group_code='LEAD_SOURCE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'CAMPAIGN',

'Marketing Campaign',

4

FROM lookup.lookup_groups

WHERE group_code='LEAD_SOURCE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



-- ============================================================================
-- CONTACT TYPE VALUES
-- ============================================================================


INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'PRIMARY',

'Primary Contact',

1

FROM lookup.lookup_groups

WHERE group_code='CONTACT_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'DECISION_MAKER',

'Decision Maker',

2

FROM lookup.lookup_groups

WHERE group_code='CONTACT_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'INFLUENCER',

'Influencer',

3

FROM lookup.lookup_groups

WHERE group_code='CONTACT_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



-- ============================================================================
-- CUSTOMER TYPE VALUES
-- ============================================================================


INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'PROSPECT',

'Prospect',

1

FROM lookup.lookup_groups

WHERE group_code='CUSTOMER_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'ACTIVE',

'Active Customer',

2

FROM lookup.lookup_groups

WHERE group_code='CUSTOMER_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'INACTIVE',

'Inactive Customer',

3

FROM lookup.lookup_groups

WHERE group_code='CUSTOMER_TYPE'


ON CONFLICT(group_id,value_code)

DO NOTHING;



-- ============================================================================
-- TASK PRIORITY VALUES
-- ============================================================================


INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'LOW',

'Low',

1

FROM lookup.lookup_groups

WHERE group_code='TASK_PRIORITY'


ON CONFLICT(group_id,value_code)

DO NOTHING;



INSERT INTO lookup.lookup_values
(
    group_id,
    value_code,
    value_name,
    display_order
)

SELECT

id,

'HIGH',

'High',

2

FROM lookup.lookup_groups

WHERE group_code='TASK_PRIORITY'


ON CONFLICT(group_id,value_code)

DO NOTHING;



-- ============================================================================
-- CURRENCY MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.currencies

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    currency_code TEXT UNIQUE NOT NULL,

    currency_name TEXT NOT NULL,

    symbol TEXT,

    decimal_places INTEGER DEFAULT 2,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO lookup.currencies

(

    currency_code,

    currency_name,

    symbol

)

VALUES


(

    'USD',

    'US Dollar',

    '$'

),


(

    'EUR',

    'Euro',

    '€'

),


(

    'GBP',

    'British Pound',

    '£'

),


(

    'INR',

    'Indian Rupee',

    '₹'

)


ON CONFLICT(currency_code)

DO UPDATE SET

currency_name = EXCLUDED.currency_name;



-- ============================================================================
-- LANGUAGE MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.languages

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    language_code TEXT UNIQUE NOT NULL,

    language_name TEXT NOT NULL,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO lookup.languages

(

    language_code,

    language_name

)

VALUES


('en','English'),

('de','German'),

('fr','French'),

('es','Spanish'),

('hi','Hindi')



ON CONFLICT(language_code)

DO NOTHING;



-- ============================================================================
-- TIMEZONE MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS lookup.timezones

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    timezone_code TEXT UNIQUE NOT NULL,

    timezone_name TEXT NOT NULL,

    utc_offset TEXT,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO lookup.timezones

(

    timezone_code,

    timezone_name,

    utc_offset

)

VALUES


(

'UTC',

'Universal Coordinated Time',

'+00:00'

),


(

'ASIA_KOLKATA',

'Asia Kolkata',

'+05:30'

),


(

'AMERICA_NEW_YORK',

'America New York',

'-05:00'

)



ON CONFLICT(timezone_code)

DO NOTHING;



COMMIT;

