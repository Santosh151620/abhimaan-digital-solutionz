BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE LOOKUP TABLE FOUNDATION
-- Migration : 031
-- Part 3 Final
-- ============================================================================
-- Purpose
-- Complete lookup infrastructure.
--
-- Adds:
-- Validation views
-- Lookup helper functions
-- Performance indexes
-- Timestamp automation
-- Security alignment
-- Migration registry
-- ============================================================================



-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_lookup_values_code

ON lookup.lookup_values(value_code);



CREATE INDEX IF NOT EXISTS
idx_lookup_values_group_active

ON lookup.lookup_values
(
    group_id,
    active
);



CREATE INDEX IF NOT EXISTS
idx_lookup_groups_active

ON lookup.lookup_groups(active);



CREATE INDEX IF NOT EXISTS
idx_currency_active

ON lookup.currencies(active);



CREATE INDEX IF NOT EXISTS
idx_language_active

ON lookup.languages(active);



CREATE INDEX IF NOT EXISTS
idx_timezone_active

ON lookup.timezones(active);



-- ============================================================================
-- LOOKUP VALIDATION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW validation.v_lookup_health AS


SELECT

    'LOOKUP_GROUPS'

    AS lookup_type,

    COUNT(*)

    AS total_records,

    COUNT(*)

        FILTER

        (

            WHERE active = TRUE

        )

    AS active_records


FROM lookup.lookup_groups



UNION ALL



SELECT

    'LOOKUP_VALUES',

    COUNT(*),

    COUNT(*)

        FILTER

        (

            WHERE active = TRUE

        )


FROM lookup.lookup_values;



-- ============================================================================
-- DUPLICATE LOOKUP DETECTION
-- ============================================================================


CREATE OR REPLACE VIEW validation.v_lookup_duplicates AS


SELECT


    group_id,

    value_code,

    COUNT(*) AS duplicate_count



FROM lookup.lookup_values



GROUP BY

group_id,

value_code



HAVING COUNT(*) > 1;



-- ============================================================================
-- GENERIC LOOKUP FETCH FUNCTION
-- ============================================================================
-- Used by CRM/Admin/UI layers.
-- ============================================================================


CREATE OR REPLACE FUNCTION lookup.get_values

(

    p_group_code TEXT

)


RETURNS TABLE

(

    value_code TEXT,

    value_name TEXT,

    display_order INTEGER

)


LANGUAGE plpgsql

AS

$$


BEGIN


    RETURN QUERY


    SELECT


        lv.value_code,

        lv.value_name,

        lv.display_order



    FROM lookup.lookup_values lv



    INNER JOIN lookup.lookup_groups lg


    ON lg.id = lv.group_id



    WHERE lg.group_code = p_group_code


    AND lv.active = TRUE



    ORDER BY

    lv.display_order;



END;


$$;



-- ============================================================================
-- ORGANIZATION LOOKUP FETCH FUNCTION
-- ============================================================================


CREATE OR REPLACE FUNCTION lookup.get_organization_values

(

    p_organization_id UUID,

    p_group_code TEXT

)


RETURNS TABLE

(

    value_code TEXT,

    value_name TEXT,

    display_order INTEGER

)


LANGUAGE plpgsql

AS

$$


BEGIN


    RETURN QUERY


    SELECT


        olv.value_code,

        olv.value_name,

        olv.display_order



    FROM lookup.organization_lookup_values olv



    INNER JOIN lookup.lookup_groups lg


    ON lg.id = olv.group_id



    WHERE olv.organization_id = p_organization_id


    AND lg.group_code = p_group_code


    AND olv.active = TRUE



    ORDER BY

    olv.display_order;



END;


$$;



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'lookup_groups',

        'lookup_values',

        'organization_lookup_values'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON lookup.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON lookup.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- SECURITY GRANT FOUNDATION
-- ============================================================================


GRANT USAGE

ON SCHEMA lookup

TO authenticated;



GRANT SELECT

ON ALL TABLES IN SCHEMA lookup

TO authenticated;



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

    31,

    '031_lookup_tables.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- COUNTRY & REGION MASTER FOUNDATION
-- Migration : 032
-- ============================================================================
-- Purpose
-- Global geography reference architecture.
--
-- Supports:
-- Country management
-- Region/state hierarchy
-- Customer addresses
-- Organization geography
-- Sales territory foundation
-- Localization
-- Currency mapping
-- Timezone mapping
--
-- Principles:
-- Global ready
-- Extensible
-- No hard-coded geography logic
-- Idempotent
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS geography;



-- ============================================================================
-- COUNTRY MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS geography.countries

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_code TEXT UNIQUE NOT NULL,

    iso_alpha2 TEXT UNIQUE,

    iso_alpha3 TEXT UNIQUE,

    country_name TEXT NOT NULL,

    phone_code TEXT,

    currency_code TEXT,

    timezone_code TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_countries_active

ON geography.countries(active);



CREATE INDEX IF NOT EXISTS

idx_countries_currency

ON geography.countries(currency_code);



-- ============================================================================
-- REGION / STATE MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS geography.regions

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL,

    region_code TEXT NOT NULL,

    region_name TEXT NOT NULL,

    region_type TEXT DEFAULT 'STATE',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_region_country

    FOREIGN KEY(country_id)

    REFERENCES geography.countries(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_country_region

    UNIQUE

    (

        country_id,

        region_code

    )

);



CREATE INDEX IF NOT EXISTS

idx_regions_country

ON geography.regions(country_id);



CREATE INDEX IF NOT EXISTS

idx_regions_active

ON geography.regions(active);



-- ============================================================================
-- CITY MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS geography.cities

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    region_id UUID NOT NULL,

    city_code TEXT,

    city_name TEXT NOT NULL,

    postal_code_pattern TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_city_region

    FOREIGN KEY(region_id)

    REFERENCES geography.regions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_cities_region

ON geography.cities(region_id);



-- ============================================================================
-- COUNTRY-CURRENCY MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS geography.country_currency_mapping

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL,

    currency_code TEXT NOT NULL,

    primary_currency BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,


    CONSTRAINT fk_country_currency

    FOREIGN KEY(country_id)

    REFERENCES geography.countries(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_country_currency_country

ON geography.country_currency_mapping(country_id);



-- ============================================================================
-- COUNTRY-TIMEZONE MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS geography.country_timezone_mapping

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL,

    timezone_code TEXT NOT NULL,

    primary_timezone BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,


    CONSTRAINT fk_country_timezone

    FOREIGN KEY(country_id)

    REFERENCES geography.countries(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_country_timezone_country

ON geography.country_timezone_mapping(country_id);



-- ============================================================================
-- COUNTRY SEEDS
-- ============================================================================


INSERT INTO geography.countries

(

    country_code,

    iso_alpha2,

    iso_alpha3,

    country_name,

    phone_code,

    currency_code,

    timezone_code

)

VALUES


(

    'IN',

    'IN',

    'IND',

    'India',

    '+91',

    'INR',

    'ASIA_KOLKATA'

),


(

    'US',

    'US',

    'USA',

    'United States',

    '+1',

    'USD',

    'AMERICA_NEW_YORK'

),


(

    'GB',

    'GB',

    'GBR',

    'United Kingdom',

    '+44',

    'GBP',

    'UTC'

),


(

    'DE',

    'DE',

    'DEU',

    'Germany',

    '+49',

    'EUR',

    'UTC'

)



ON CONFLICT(country_code)

DO UPDATE SET


country_name = EXCLUDED.country_name,

currency_code = EXCLUDED.currency_code,

timezone_code = EXCLUDED.timezone_code;



COMMIT;

