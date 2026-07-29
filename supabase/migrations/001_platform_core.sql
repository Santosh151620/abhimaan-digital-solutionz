BEGIN;

-- ============================================================================
-- ADS PLATFORM CORE
-- Enterprise Foundation
-- Version 1.0
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS platform;

-- ============================================================================
-- COMMON FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_code(
    prefix TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN CONCAT(
        prefix,
        '-',
        TO_CHAR(NOW(),'YYYYMMDD'),
        '-',
        SUBSTRING(
            REPLACE(
                gen_random_uuid()::TEXT,
                '-',
                ''
            ),
            1,
            8
        )
    );
END;
$$;

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

ALTER TABLE public.organizations

ADD COLUMN IF NOT EXISTS code TEXT,

ADD COLUMN IF NOT EXISTS organization_type TEXT DEFAULT 'Customer',

ADD COLUMN IF NOT EXISTS organization_number TEXT,

ADD COLUMN IF NOT EXISTS email TEXT,

ADD COLUMN IF NOT EXISTS phone TEXT,

ADD COLUMN IF NOT EXISTS website TEXT,

ADD COLUMN IF NOT EXISTS logo_url TEXT,

ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',

ADD COLUMN IF NOT EXISTS language_code TEXT DEFAULT 'en',

ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD',

ADD COLUMN IF NOT EXISTS country_code TEXT,

ADD COLUMN IF NOT EXISTS region_code TEXT,

ADD COLUMN IF NOT EXISTS city TEXT,

ADD COLUMN IF NOT EXISTS address_line1 TEXT,

ADD COLUMN IF NOT EXISTS address_line2 TEXT,

ADD COLUMN IF NOT EXISTS postal_code TEXT,

ADD COLUMN IF NOT EXISTS industry_code TEXT,

ADD COLUMN IF NOT EXISTS employee_band TEXT,

ADD COLUMN IF NOT EXISTS annual_revenue NUMERIC(18,2),

ADD COLUMN IF NOT EXISTS tax_number TEXT,

ADD COLUMN IF NOT EXISTS registration_number TEXT,

ADD COLUMN IF NOT EXISTS parent_organization_id UUID,

ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,

ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS created_by UUID,

ADD COLUMN IF NOT EXISTS updated_by UUID;

UPDATE public.organizations
SET organization_number =
COALESCE(
    organization_number,
    public.generate_code('ORG')
);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_org_number
ON public.organizations
(
    organization_number
);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_org_code
ON public.organizations
(
    code
);

CREATE INDEX IF NOT EXISTS
idx_org_country
ON public.organizations
(
    country_code
);

CREATE INDEX IF NOT EXISTS
idx_org_industry
ON public.organizations
(
    industry_code
);

CREATE INDEX IF NOT EXISTS
idx_org_archived
ON public.organizations
(
    archived
);
-- ============================================================================
-- PROFILES
-- ============================================================================

ALTER TABLE public.profiles

ADD COLUMN IF NOT EXISTS organization_id UUID,

ADD COLUMN IF NOT EXISTS employee_number TEXT,

ADD COLUMN IF NOT EXISTS first_name TEXT,

ADD COLUMN IF NOT EXISTS middle_name TEXT,

ADD COLUMN IF NOT EXISTS last_name TEXT,

ADD COLUMN IF NOT EXISTS display_name TEXT,

ADD COLUMN IF NOT EXISTS email TEXT,

ADD COLUMN IF NOT EXISTS phone TEXT,

ADD COLUMN IF NOT EXISTS mobile TEXT,

ADD COLUMN IF NOT EXISTS alternate_phone TEXT,

ADD COLUMN IF NOT EXISTS date_of_birth DATE,

ADD COLUMN IF NOT EXISTS gender TEXT,

ADD COLUMN IF NOT EXISTS timezone TEXT,

ADD COLUMN IF NOT EXISTS language_code TEXT,

ADD COLUMN IF NOT EXISTS department_code TEXT,

ADD COLUMN IF NOT EXISTS designation TEXT,

ADD COLUMN IF NOT EXISTS manager_profile_id UUID,

ADD COLUMN IF NOT EXISTS reporting_level INTEGER DEFAULT 1,

ADD COLUMN IF NOT EXISTS employment_type TEXT,

ADD COLUMN IF NOT EXISTS joining_date DATE,

ADD COLUMN IF NOT EXISTS leaving_date DATE,

ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',

ADD COLUMN IF NOT EXISTS is_platform_user BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,

ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,

ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS created_by UUID,

ADD COLUMN IF NOT EXISTS updated_by UUID;

UPDATE public.profiles
SET display_name =
COALESCE(
    display_name,
    full_name
);

UPDATE public.profiles
SET employee_number =
COALESCE(
    employee_number,
    public.generate_code('EMP')
);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_profiles_employee_number
ON public.profiles
(
    employee_number
);

CREATE INDEX IF NOT EXISTS
idx_profiles_org
ON public.profiles
(
    organization_id
);

CREATE INDEX IF NOT EXISTS
idx_profiles_department
ON public.profiles
(
    department_code
);

CREATE INDEX IF NOT EXISTS
idx_profiles_manager
ON public.profiles
(
    manager_profile_id
);

CREATE INDEX IF NOT EXISTS
idx_profiles_status
ON public.profiles
(
    status
);

CREATE INDEX IF NOT EXISTS
idx_profiles_archived
ON public.profiles
(
    archived
);

-- ============================================================================
-- ORGANIZATION MEMBERS
-- ============================================================================

ALTER TABLE public.organization_members

ADD COLUMN IF NOT EXISTS membership_number TEXT,

ADD COLUMN IF NOT EXISTS department_code TEXT,

ADD COLUMN IF NOT EXISTS designation TEXT,

ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW(),

ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT TRUE,

ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,

ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,

ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS created_by UUID,

ADD COLUMN IF NOT EXISTS updated_by UUID;

UPDATE public.organization_members
SET membership_number =
COALESCE(
    membership_number,
    public.generate_code('MEM')
);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_membership_number
ON public.organization_members
(
    membership_number
);

CREATE INDEX IF NOT EXISTS
idx_members_org
ON public.organization_members
(
    organization_id
);

CREATE INDEX IF NOT EXISTS
idx_members_profile
ON public.organization_members
(
    profile_id
);

CREATE INDEX IF NOT EXISTS
idx_members_archived
ON public.organization_members
(
    archived
);
-- ============================================================================
-- GLOBAL PLATFORM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform.platform_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key TEXT NOT NULL UNIQUE,

    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,

    category TEXT NOT NULL DEFAULT 'General',

    description TEXT,

    is_system BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_platform_settings_category
ON platform.platform_settings(category);

-- ============================================================================
-- GLOBAL LOOKUP CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform.lookup_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL,

    description TEXT,

    is_system BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS platform.lookup_values (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT NOT NULL,

    code TEXT NOT NULL,

    display_name TEXT NOT NULL,

    sequence_no INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_lookup_value
    UNIQUE (
        category_code,
        code
    )

);

CREATE INDEX IF NOT EXISTS
idx_lookup_category
ON platform.lookup_values(category_code);

-- ============================================================================
-- UNIVERSAL UPDATED_AT TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS
trg_org_updated
ON public.organizations;

CREATE TRIGGER
trg_org_updated

BEFORE UPDATE

ON public.organizations

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS
trg_profile_updated
ON public.profiles;

CREATE TRIGGER
trg_profile_updated

BEFORE UPDATE

ON public.profiles

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS
trg_member_updated
ON public.organization_members;

CREATE TRIGGER
trg_member_updated

BEFORE UPDATE

ON public.organization_members

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS
trg_platform_settings_updated
ON platform.platform_settings;

CREATE TRIGGER
trg_platform_settings_updated

BEFORE UPDATE

ON platform.platform_settings

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS
trg_lookup_categories_updated
ON platform.lookup_categories;

CREATE TRIGGER
trg_lookup_categories_updated

BEFORE UPDATE

ON platform.lookup_categories

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS
trg_lookup_values_updated
ON platform.lookup_values;

CREATE TRIGGER
trg_lookup_values_updated

BEFORE UPDATE

ON platform.lookup_values

FOR EACH ROW

EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- INITIAL PLATFORM SETTINGS
-- ============================================================================

INSERT INTO platform.platform_settings
(
    setting_key,
    setting_value,
    category,
    description
)
VALUES
(
    'platform.version',
    '"1.0.0"'::jsonb,
    'Platform',
    'Current platform version'
)
ON CONFLICT (setting_key)
DO NOTHING;

INSERT INTO platform.platform_settings
(
    setting_key,
    setting_value,
    category,
    description
)
VALUES
(
    'platform.mode',
    '"SaaS"'::jsonb,
    'Platform',
    'Deployment mode'
)
ON CONFLICT (setting_key)
DO NOTHING;

INSERT INTO platform.platform_settings
(
    setting_key,
    setting_value,
    category,
    description
)
VALUES
(
    'platform.soft_delete_days',
    '60'::jsonb,
    'Retention',
    'Default soft delete retention'
)
ON CONFLICT (setting_key)
DO NOTHING;

-- ============================================================================
-- PLATFORM FOUNDATION COMPLETE
-- ============================================================================

COMMIT;