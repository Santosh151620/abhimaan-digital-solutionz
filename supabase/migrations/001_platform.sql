-- ==========================================================
-- ADS ENTERPRISE PLATFORM
-- Migration: 001_platform.sql
-- Part 1
-- Extensions / Enums / Organizations / Profiles
-- ==========================================================

BEGIN;

-------------------------------------------------------------
-- EXTENSIONS
-------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-------------------------------------------------------------
-- ENUMS
-------------------------------------------------------------

DO $$ BEGIN

CREATE TYPE organization_status AS ENUM
(
'active',
'inactive',
'suspended',
'trial'
);

EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN

CREATE TYPE member_status AS ENUM
(
'invited',
'active',
'disabled',
'removed'
);

EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN

CREATE TYPE profile_status AS ENUM
(
'active',
'inactive',
'blocked'
);

EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;

-------------------------------------------------------------
-- ORGANIZATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

name varchar(250) NOT NULL,

legal_name varchar(300),

code varchar(50) UNIQUE,

email varchar(255),

phone varchar(50),

website varchar(255),

logo_url text,

industry_id uuid,

timezone varchar(100),

currency_code varchar(10),

language_code varchar(10),

country_code varchar(10),

status organization_status NOT NULL DEFAULT 'trial',

subscription_plan varchar(50),

subscription_expiry timestamptz,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean NOT NULL DEFAULT false,

is_active boolean NOT NULL DEFAULT true,

version integer NOT NULL DEFAULT 1,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- PROFILES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles
(

id uuid PRIMARY KEY,

organization_id uuid NOT NULL,

first_name varchar(150),

last_name varchar(150),

display_name varchar(250),

email citext NOT NULL,

mobile varchar(40),

avatar_url text,

job_title varchar(200),

department varchar(150),

status profile_status NOT NULL DEFAULT 'active',

last_login timestamptz,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean NOT NULL DEFAULT false,

is_active boolean NOT NULL DEFAULT true,

version integer NOT NULL DEFAULT 1,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_profiles_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- ORGANIZATION MEMBERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organization_members
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid NOT NULL,

employee_code varchar(50),

member_status member_status NOT NULL DEFAULT 'active',

joined_at timestamptz DEFAULT now(),

left_at timestamptz,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean NOT NULL DEFAULT false,

is_active boolean NOT NULL DEFAULT true,

version integer NOT NULL DEFAULT 1,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_member_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id),

CONSTRAINT fk_member_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)

);

COMMIT;
-------------------------------------------------------------
-- ROLES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

description text,

is_system boolean NOT NULL DEFAULT false,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean NOT NULL DEFAULT false,

is_active boolean NOT NULL DEFAULT true,

version integer NOT NULL DEFAULT 1,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_roles_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_roles_org_code
UNIQUE (organization_id, code)

);

-------------------------------------------------------------
-- PERMISSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS permissions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

module varchar(100) NOT NULL,

resource varchar(100) NOT NULL,

action varchar(100) NOT NULL,

permission_key varchar(255) NOT NULL UNIQUE,

description text,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- ROLE PERMISSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS role_permissions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

role_id uuid NOT NULL,

permission_id uuid NOT NULL,

created_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_role_permissions_role
FOREIGN KEY (role_id)
REFERENCES roles(id)
ON DELETE CASCADE,

CONSTRAINT fk_role_permissions_permission
FOREIGN KEY (permission_id)
REFERENCES permissions(id)
ON DELETE CASCADE,

CONSTRAINT uq_role_permission
UNIQUE(role_id, permission_id)

);

-------------------------------------------------------------
-- USER PERMISSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_permissions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

profile_id uuid NOT NULL,

permission_id uuid NOT NULL,

allow_access boolean NOT NULL DEFAULT true,

created_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_user_permission_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE,

CONSTRAINT fk_user_permission_permission
FOREIGN KEY (permission_id)
REFERENCES permissions(id)
ON DELETE CASCADE,

CONSTRAINT uq_user_permission
UNIQUE(profile_id, permission_id)

);

-------------------------------------------------------------
-- ORGANIZATION SETTINGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organization_settings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

setting_key varchar(255) NOT NULL,

setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,

category varchar(100),

description text,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_org_settings_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE,

CONSTRAINT uq_org_setting
UNIQUE(organization_id, setting_key)

);
-------------------------------------------------------------
-- USER SESSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_sessions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

profile_id uuid NOT NULL,

organization_id uuid NOT NULL,

session_token text NOT NULL UNIQUE,

refresh_token text,

device_name varchar(200),

device_type varchar(100),

browser varchar(100),

operating_system varchar(100),

ip_address inet,

user_agent text,

last_activity_at timestamptz,

expires_at timestamptz NOT NULL,

revoked_at timestamptz,

created_at timestamptz NOT NULL DEFAULT now(),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_session_profile
FOREIGN KEY(profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE,

CONSTRAINT fk_session_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- API KEYS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS api_keys
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(200) NOT NULL,

api_key_hash text NOT NULL,

key_prefix varchar(30),

permissions jsonb NOT NULL DEFAULT '[]'::jsonb,

expires_at timestamptz,

last_used_at timestamptz,

is_revoked boolean NOT NULL DEFAULT false,

created_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_api_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- FEATURE FLAGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feature_flags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid,

feature_key varchar(255) NOT NULL,

feature_name varchar(255) NOT NULL,

description text,

enabled boolean NOT NULL DEFAULT false,

rollout_percentage integer DEFAULT 100,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT uq_feature_key_org
UNIQUE(organization_id, feature_key),

CONSTRAINT fk_feature_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- AUDIT LOGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

entity_type varchar(150) NOT NULL,

entity_id uuid,

action varchar(100) NOT NULL,

old_values jsonb,

new_values jsonb,

ip_address inet,

user_agent text,

performed_at timestamptz NOT NULL DEFAULT now(),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_audit_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE,

CONSTRAINT fk_audit_profile
FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- SYSTEM SETTINGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS system_settings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

setting_key varchar(255) NOT NULL UNIQUE,

setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,

category varchar(100),

description text,

created_at timestamptz NOT NULL DEFAULT now(),

updated_at timestamptz NOT NULL DEFAULT now(),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);
-------------------------------------------------------------
-- COUNTRIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS countries
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

iso2 varchar(2) NOT NULL UNIQUE,

iso3 varchar(3) UNIQUE,

name varchar(150) NOT NULL,

phone_code varchar(20),

currency_code varchar(10),

is_active boolean NOT NULL DEFAULT true,

sort_order integer DEFAULT 0,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- STATES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS states
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

country_id uuid NOT NULL,

code varchar(20),

name varchar(150) NOT NULL,

is_active boolean NOT NULL DEFAULT true,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_states_country
FOREIGN KEY(country_id)
REFERENCES countries(id)
ON DELETE CASCADE,

CONSTRAINT uq_state_country
UNIQUE(country_id, name)

);

-------------------------------------------------------------
-- CITIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

country_id uuid NOT NULL,

state_id uuid,

name varchar(150) NOT NULL,

postal_code varchar(20),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_city_country
FOREIGN KEY(country_id)
REFERENCES countries(id),

CONSTRAINT fk_city_state
FOREIGN KEY(state_id)
REFERENCES states(id)

);

-------------------------------------------------------------
-- CURRENCIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS currencies
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

code varchar(10) UNIQUE NOT NULL,

name varchar(120) NOT NULL,

symbol varchar(20),

decimal_places integer DEFAULT 2,

is_active boolean DEFAULT true,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- LANGUAGES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS languages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

code varchar(15) UNIQUE NOT NULL,

name varchar(120) NOT NULL,

native_name varchar(120),

is_active boolean DEFAULT true,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- TIMEZONES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS timezones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

timezone_name varchar(120) UNIQUE NOT NULL,

utc_offset varchar(20),

display_name varchar(200),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- PLATFORM INDEXES
-------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_org
ON profiles(organization_id);

CREATE INDEX IF NOT EXISTS idx_org_members_org
ON organization_members(organization_id);

CREATE INDEX IF NOT EXISTS idx_roles_org
ON roles(organization_id);

CREATE INDEX IF NOT EXISTS idx_sessions_profile
ON user_sessions(profile_id);

CREATE INDEX IF NOT EXISTS idx_api_org
ON api_keys(organization_id);

CREATE INDEX IF NOT EXISTS idx_audit_org
ON audit_logs(organization_id);

CREATE INDEX IF NOT EXISTS idx_feature_org
ON feature_flags(organization_id);

-------------------------------------------------------------
-- UPDATE TRIGGER FUNCTION
-------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-------------------------------------------------------------

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_org_updated
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_roles_updated
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_org_settings_updated
BEFORE UPDATE ON organization_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_feature_updated
BEFORE UPDATE ON feature_flags
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-------------------------------------------------------------
-- PLATFORM VALIDATION
-------------------------------------------------------------

DO $$
BEGIN

RAISE NOTICE 'ADS Platform Migration Complete';

END $$;

COMMIT;