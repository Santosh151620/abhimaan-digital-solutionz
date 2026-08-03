-- ============================================================
-- 006_lookup.sql
-- PART 1
-- MASTER DATA FOUNDATION
-- ============================================================

BEGIN;


-- ============================================================
-- GENERIC LOOKUP GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_groups (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    group_key TEXT NOT NULL UNIQUE,

    group_name TEXT NOT NULL,

    description TEXT,

    is_system BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- GENERIC LOOKUP VALUES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_values (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    group_id UUID NOT NULL
        REFERENCES lookup_groups(id)
        ON DELETE CASCADE,

    value_key TEXT NOT NULL,

    value_name TEXT NOT NULL,

    description TEXT,

    sort_order INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(
        group_id,
        value_key
    )

);



CREATE INDEX IF NOT EXISTS idx_lookup_values_group
ON lookup_values(group_id);



CREATE INDEX IF NOT EXISTS idx_lookup_values_key
ON lookup_values(value_key);



-- ============================================================
-- COUNTRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_countries (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_code CHAR(2) NOT NULL UNIQUE,

    country_name TEXT NOT NULL UNIQUE,

    phone_code TEXT,

    currency_code TEXT,

    timezone TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_lookup_country_code
ON lookup_countries(country_code);



-- ============================================================
-- STATES / REGIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_states (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL
        REFERENCES lookup_countries(id)
        ON DELETE CASCADE,

    state_code TEXT,

    state_name TEXT NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        country_id,
        state_name
    )

);



CREATE INDEX IF NOT EXISTS idx_lookup_states_country
ON lookup_states(country_id);



-- ============================================================
-- CITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_cities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    state_id UUID NOT NULL
        REFERENCES lookup_states(id)
        ON DELETE CASCADE,

    city_name TEXT NOT NULL,

    postal_codes JSONB DEFAULT '[]'::jsonb,

    latitude NUMERIC,

    longitude NUMERIC,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        state_id,
        city_name
    )

);



CREATE INDEX IF NOT EXISTS idx_lookup_city_state
ON lookup_cities(state_id);



-- ============================================================
-- CURRENCIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_currencies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    currency_code CHAR(3) NOT NULL UNIQUE,

    currency_name TEXT NOT NULL,

    symbol TEXT,

    decimal_places INTEGER DEFAULT 2,

    exchange_rate JSONB DEFAULT '{}'::jsonb,

    is_base_currency BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- LANGUAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_languages (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    language_code TEXT NOT NULL UNIQUE,

    language_name TEXT NOT NULL,

    native_name TEXT,

    is_rtl BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- TIMEZONES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_timezones (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    timezone_name TEXT NOT NULL UNIQUE,

    utc_offset TEXT,

    country_code CHAR(2),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



COMMIT;
-- ============================================================
-- 006_lookup.sql
-- PART 2
-- CRM + BUSINESS MASTER DATA
-- ============================================================

BEGIN;


-- ============================================================
-- INDUSTRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_industries (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    industry_code TEXT NOT NULL UNIQUE,

    industry_name TEXT NOT NULL UNIQUE,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- COMPANY SIZE MASTER
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_company_sizes (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    size_code TEXT NOT NULL UNIQUE,

    size_name TEXT NOT NULL,

    employee_range JSONB DEFAULT '{}'::jsonb,

    sort_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- LEAD SOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_lead_sources (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    source_code TEXT NOT NULL UNIQUE,

    source_name TEXT NOT NULL,

    description TEXT,

    category TEXT,

    is_system BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- LEAD STATUS
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_lead_statuses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    status_code TEXT NOT NULL UNIQUE,

    status_name TEXT NOT NULL,

    probability INTEGER DEFAULT 0,

    is_closed BOOLEAN DEFAULT FALSE,

    sort_order INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- OPPORTUNITY STAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_opportunity_stages (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    stage_code TEXT NOT NULL UNIQUE,

    stage_name TEXT NOT NULL,

    probability INTEGER DEFAULT 0,

    is_won BOOLEAN DEFAULT FALSE,

    is_lost BOOLEAN DEFAULT FALSE,

    sort_order INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- ACTIVITY TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_activity_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    activity_code TEXT NOT NULL UNIQUE,

    activity_name TEXT NOT NULL,

    icon TEXT,

    category TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- TASK TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_task_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_code TEXT NOT NULL UNIQUE,

    task_name TEXT NOT NULL,

    description TEXT,

    default_priority TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- PRIORITY MASTER
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_priorities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    priority_code TEXT NOT NULL UNIQUE,

    priority_name TEXT NOT NULL,

    level INTEGER DEFAULT 0,

    color_code TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- PAYMENT TERMS
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_payment_terms (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    term_code TEXT NOT NULL UNIQUE,

    term_name TEXT NOT NULL,

    days INTEGER DEFAULT 0,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- TAX CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_tax_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tax_code TEXT NOT NULL UNIQUE,

    tax_name TEXT NOT NULL,

    tax_percentage NUMERIC(8,2) DEFAULT 0,

    country_code CHAR(2),

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- UNITS OF MEASURE
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_units (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    unit_code TEXT NOT NULL UNIQUE,

    unit_name TEXT NOT NULL,

    unit_category TEXT,

    conversion_factor NUMERIC(12,4),

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



COMMIT;
-- ============================================================
-- 006_lookup.sql
-- PART 3 FINAL
-- PLATFORM SUPPORTING MASTER DATA
-- ============================================================

BEGIN;


-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_product_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT NOT NULL UNIQUE,

    category_name TEXT NOT NULL,

    parent_id UUID
        REFERENCES lookup_product_categories(id)
        ON DELETE SET NULL,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_service_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT NOT NULL UNIQUE,

    category_name TEXT NOT NULL,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- DOCUMENT TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_document_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_code TEXT NOT NULL UNIQUE,

    document_name TEXT NOT NULL,

    module_name TEXT,

    file_required BOOLEAN DEFAULT FALSE,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- FILE TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_file_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    extension TEXT NOT NULL UNIQUE,

    mime_type TEXT,

    category TEXT,

    max_size_mb INTEGER DEFAULT 10,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- NOTIFICATION TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_notification_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_code TEXT NOT NULL UNIQUE,

    notification_name TEXT NOT NULL,

    channel TEXT,

    severity TEXT DEFAULT 'normal',

    template JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- COMMUNICATION CHANNELS
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_communication_channels (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    channel_code TEXT NOT NULL UNIQUE,

    channel_name TEXT NOT NULL,

    provider TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- WORKFLOW ACTION TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_workflow_actions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    action_code TEXT NOT NULL UNIQUE,

    action_name TEXT NOT NULL,

    action_category TEXT,

    configuration_schema JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- INTEGRATION TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_integration_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    integration_code TEXT NOT NULL UNIQUE,

    integration_name TEXT NOT NULL,

    category TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- REPORT TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_report_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_code TEXT NOT NULL UNIQUE,

    report_name TEXT NOT NULL,

    module_name TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- DASHBOARD WIDGET TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS lookup_dashboard_widgets (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    widget_code TEXT NOT NULL UNIQUE,

    widget_name TEXT NOT NULL,

    widget_category TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS (

    SELECT 1
    FROM information_schema.tables
    WHERE table_name='lookup_groups'

)

THEN

    RAISE EXCEPTION
    'Lookup foundation missing';

END IF;



IF NOT EXISTS (

    SELECT 1
    FROM information_schema.tables
    WHERE table_name='lookup_notification_types'

)

THEN

    RAISE EXCEPTION
    'Notification lookup missing';

END IF;



IF NOT EXISTS (

    SELECT 1
    FROM information_schema.tables
    WHERE table_name='lookup_dashboard_widgets'

)

THEN

    RAISE EXCEPTION
    'Dashboard lookup missing';

END IF;



END $$;



COMMIT;