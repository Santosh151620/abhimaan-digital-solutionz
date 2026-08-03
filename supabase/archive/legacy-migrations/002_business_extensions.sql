BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- BUSINESS EXTENSIONS
-- Migration : 002
-- ============================================================================
-- Purpose
-- Business Master Data
-- Organization Classification
-- Geographic Foundation
-- Industry Foundation
-- Business Taxonomy
-- ERP Ready
-- CRM Ready
-- Website Ready
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS master;

-- ============================================================================
-- COUNTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.countries (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    iso2 CHAR(2) NOT NULL UNIQUE,

    iso3 CHAR(3) NOT NULL UNIQUE,

    numeric_code TEXT,

    country_name TEXT NOT NULL,

    official_name TEXT,

    phone_code TEXT,

    currency_code CHAR(3),

    language_code TEXT,

    continent TEXT,

    region TEXT,

    sub_region TEXT,

    nationality TEXT,

    capital_city TEXT,

    flag_url TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_country_region
ON master.countries(region);

CREATE INDEX IF NOT EXISTS
idx_country_continent
ON master.countries(continent);

-- ============================================================================
-- STATES / PROVINCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.states (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL,

    code TEXT NOT NULL,

    state_name TEXT NOT NULL,

    state_type TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_state_country
    FOREIGN KEY(country_id)
    REFERENCES master.countries(id)

);

CREATE INDEX IF NOT EXISTS
idx_states_country
ON master.states(country_id);

-- ============================================================================
-- CITIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.cities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    state_id UUID NOT NULL,

    city_name TEXT NOT NULL,

    postal_code TEXT,

    latitude NUMERIC,

    longitude NUMERIC,

    timezone TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_city_state
    FOREIGN KEY(state_id)
    REFERENCES master.states(id)

);

CREATE INDEX IF NOT EXISTS
idx_city_state
ON master.cities(state_id);

-- ============================================================================
-- TIMEZONES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.timezones (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    timezone_name TEXT UNIQUE NOT NULL,

    utc_offset TEXT,

    observes_dst BOOLEAN DEFAULT FALSE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_timezone_name
ON master.timezones(timezone_name);
-- ============================================================================
-- INDUSTRY MASTER
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.industries (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    industry_code TEXT NOT NULL UNIQUE,

    industry_name TEXT NOT NULL,

    parent_industry_id UUID,

    description TEXT,

    display_order INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_parent_industry
    FOREIGN KEY(parent_industry_id)
    REFERENCES master.industries(id)

);

CREATE INDEX IF NOT EXISTS
idx_industry_parent
ON master.industries(parent_industry_id);

-- ============================================================================
-- BUSINESS SECTORS
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.business_sectors (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sector_code TEXT NOT NULL UNIQUE,

    sector_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.departments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    department_code TEXT NOT NULL UNIQUE,

    department_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- DESIGNATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.designations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    designation_code TEXT NOT NULL UNIQUE,

    designation_name TEXT NOT NULL,

    hierarchy_level INTEGER DEFAULT 1,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_designation_level
ON master.designations(hierarchy_level);

-- ============================================================================
-- ORGANIZATION TYPES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.organization_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type_code TEXT NOT NULL UNIQUE,

    type_name TEXT NOT NULL,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- EMPLOYEE BANDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.employee_bands (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    band_code TEXT NOT NULL UNIQUE,

    band_name TEXT NOT NULL,

    minimum_count INTEGER,

    maximum_count INTEGER,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_employee_band_range
ON master.employee_bands(
    minimum_count,
    maximum_count
);
-- ============================================================================
-- BUSINESS CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.business_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT NOT NULL UNIQUE,

    category_name TEXT NOT NULL,

    description TEXT,

    display_order INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- COMPANY SIZES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.company_sizes (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    size_code TEXT NOT NULL UNIQUE,

    size_name TEXT NOT NULL,

    minimum_employees INTEGER,

    maximum_employees INTEGER,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- CURRENCIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.currencies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    currency_code CHAR(3) NOT NULL UNIQUE,

    currency_name TEXT NOT NULL,

    currency_symbol TEXT,

    decimal_places INTEGER DEFAULT 2,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

-- ============================================================================
-- LANGUAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS master.languages (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    language_code TEXT NOT NULL UNIQUE,

    language_name TEXT NOT NULL,

    native_name TEXT,

    rtl BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

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
        'countries',
        'states',
        'cities',
        'industries',
        'business_sectors',
        'departments',
        'designations',
        'organization_types',
        'employee_bands',
        'business_categories',
        'company_sizes',
        'currencies',
        'languages'
    ]
    LOOP

        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated ON master.%1$s;',
            tbl
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON master.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );

    END LOOP;

END;
$$;

-- ============================================================================
-- FOUNDATION LOOKUPS
-- ============================================================================

INSERT INTO master.organization_types
(
    type_code,
    type_name
)
VALUES
('Trial','Trial'),
('Customer','Customer'),
('Enterprise','Enterprise'),
('Internal','Internal')
ON CONFLICT (type_code)
DO NOTHING;

INSERT INTO master.business_categories
(
    category_code,
    category_name
)
VALUES
('SERVICE','Service'),
('MANUFACTURING','Manufacturing'),
('RETAIL','Retail'),
('HEALTHCARE','Healthcare'),
('EDUCATION','Education'),
('FINANCE','Finance'),
('IT','Information Technology'),
('GOVERNMENT','Government')
ON CONFLICT (category_code)
DO NOTHING;

INSERT INTO master.company_sizes
(
    size_code,
    size_name,
    minimum_employees,
    maximum_employees
)
VALUES
('MICRO','Micro',1,10),
('SMALL','Small',11,50),
('MEDIUM','Medium',51,250),
('LARGE','Large',251,1000),
('ENTERPRISE','Enterprise',1001,NULL)
ON CONFLICT (size_code)
DO NOTHING;

-- ============================================================================
-- BUSINESS FOUNDATION COMPLETE
-- ============================================================================

COMMIT;