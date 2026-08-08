-- ============================================================
-- ADS V1 MISSING FOUNDATION OBJECTS
-- Migration: 017
--
-- PURPOSE
-- Create only foundation tables/types that are absent from the
-- confirmed remote production schema.
--
-- SAFETY
-- * Existing remote tables are NOT recreated.
-- * Existing data is NOT modified.
-- * No DROP TABLE.
-- * No DROP COLUMN.
-- * No DELETE.
-- * No TRUNCATE.
-- * No RLS changes.
-- * No policy changes.
-- * No index recreation.
--
-- DUPLICATE RESOLUTION
-- * audit_logs = 001_platform.sql authoritative definition
-- * report_executions = 003_crm.sql authoritative definition
--
-- NOTE
-- This migration is intentionally limited to missing foundation
-- objects. Tenant isolation/RLS/policies are handled separately.
-- ============================================================

BEGIN;


-- ============================================================
-- FOUNDATION TYPES
-- ============================================================
DO $$
BEGIN
    CREATE TYPE admin_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'archived'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE configuration_scope AS ENUM (
    'platform',
    'organization',
    'user'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE crm_status AS ENUM (
'active',
'inactive',
'archived'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE job_status AS ENUM (
    'pending',
    'running',
    'completed',
    'failed',
    'cancelled'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE lead_source AS ENUM (
'website',
'manual',
'email',
'phone',
'social',
'campaign',
'partner',
'referral',
'api',
'import'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE member_status AS ENUM (
'invited',
'active',
'disabled',
'removed'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE menu_location AS ENUM (
'header',
'footer',
'sidebar',
'mobile'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE organization_status AS ENUM (
'active',
'inactive',
'suspended',
'trial'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE page_status AS ENUM (
'draft',
'published',
'archived'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE profile_status AS ENUM (
'active',
'inactive',
'blocked'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE subscription_status AS ENUM (
    'trial',
    'active',
    'paused',
    'cancelled',
    'expired'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE user_invitation_status AS ENUM (
    'pending',
    'accepted',
    'expired',
    'cancelled'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;


-- ============================================================
-- SOURCE: 001_platform.sql
-- ============================================================
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

CREATE TABLE IF NOT EXISTS languages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

code varchar(15) UNIQUE NOT NULL,

name varchar(120) NOT NULL,

native_name varchar(120),

is_active boolean DEFAULT true,

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);

CREATE TABLE IF NOT EXISTS timezones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

timezone_name varchar(120) UNIQUE NOT NULL,

utc_offset varchar(20),

display_name varchar(200),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb

);


-- ============================================================
-- SOURCE: 002_website.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

site_name varchar(255) NOT NULL,

tagline varchar(500),

default_language varchar(20),

default_timezone varchar(100),

theme varchar(100),

logo_url text,

favicon_url text,

maintenance_mode boolean DEFAULT false,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_website_settings_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS navigation_menus
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

location menu_location NOT NULL,

description text,

sort_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_navigation_menu_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS navigation_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

menu_id uuid NOT NULL,

parent_id uuid,

title varchar(255) NOT NULL,

url varchar(500),

icon varchar(100),

target varchar(20),

sort_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_nav_item_menu
FOREIGN KEY(menu_id)
REFERENCES navigation_menus(id)
ON DELETE CASCADE,

CONSTRAINT fk_nav_item_parent
FOREIGN KEY(parent_id)
REFERENCES navigation_items(id)

);

CREATE TABLE IF NOT EXISTS pages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

title varchar(255) NOT NULL,

slug varchar(255) NOT NULL,

status page_status DEFAULT 'draft',

layout varchar(100),

template varchar(100),

published_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_pages_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_page_slug
UNIQUE(organization_id, slug)

);

CREATE TABLE IF NOT EXISTS page_sections
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

page_id uuid NOT NULL,

title varchar(255),

section_type varchar(100),

sort_order integer DEFAULT 0,

settings jsonb DEFAULT '{}'::jsonb,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_page_sections_page
FOREIGN KEY(page_id)
REFERENCES pages(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS page_blocks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

section_id uuid NOT NULL,

block_type varchar(100) NOT NULL,

sort_order integer DEFAULT 0,

content jsonb DEFAULT '{}'::jsonb,

settings jsonb DEFAULT '{}'::jsonb,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_page_blocks_section
FOREIGN KEY(section_id)
REFERENCES page_sections(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS blog_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

slug varchar(150) NOT NULL,

description text,

sort_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_blog_category_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_blog_category_slug
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS blog_tags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(100) NOT NULL,

slug varchar(120) NOT NULL,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_blog_tag_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_blog_tag_slug
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS authors
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

name varchar(255) NOT NULL,

designation varchar(150),

bio text,

photo_url text,

linkedin_url text,

twitter_url text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_author_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT fk_author_profile
FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS blogs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_id uuid,

author_id uuid,

title varchar(300) NOT NULL,

slug varchar(255) NOT NULL,

summary text,

content jsonb,

featured_image text,

reading_time integer,

status page_status DEFAULT 'draft',

published_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_blog_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT fk_blog_category
FOREIGN KEY(category_id)
REFERENCES blog_categories(id),

CONSTRAINT fk_blog_author
FOREIGN KEY(author_id)
REFERENCES authors(id),

CONSTRAINT uq_blog_slug
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS blog_tag_map
(

blog_id uuid NOT NULL,

tag_id uuid NOT NULL,

PRIMARY KEY(blog_id,tag_id),

FOREIGN KEY(blog_id)
REFERENCES blogs(id)
ON DELETE CASCADE,

FOREIGN KEY(tag_id)
REFERENCES blog_tags(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS seo_metadata
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100) NOT NULL,

entity_id uuid NOT NULL,

meta_title varchar(255),

meta_description text,

meta_keywords text,

canonical_url text,

robots varchar(100),

schema_markup jsonb,

open_graph jsonb,

twitter_card jsonb,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_seo_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS redirects
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

source_url text NOT NULL,

destination_url text NOT NULL,

http_status integer DEFAULT 301,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS media_library
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

folder varchar(255),

file_name varchar(255),

original_name varchar(255),

mime_type varchar(100),

extension varchar(20),

file_size bigint,

storage_path text,

public_url text,

image_width integer,

image_height integer,

uploaded_by uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(uploaded_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS forms
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(255) NOT NULL,

slug varchar(200) NOT NULL,

description text,

success_message text,

redirect_url text,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

CONSTRAINT fk_forms_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_form_slug
UNIQUE (organization_id, slug)

);

CREATE TABLE IF NOT EXISTS form_fields
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

form_id uuid NOT NULL,

label varchar(255) NOT NULL,

field_name varchar(150) NOT NULL,

field_type varchar(100) NOT NULL,

placeholder varchar(255),

default_value text,

validation jsonb,

sort_order integer DEFAULT 0,

is_required boolean DEFAULT false,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(form_id)
REFERENCES forms(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS form_submissions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

form_id uuid NOT NULL,

submitted_at timestamptz DEFAULT now(),

ip_address inet,

user_agent text,

submission jsonb NOT NULL,

lead_id uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(form_id)
REFERENCES forms(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS newsletter_subscribers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

email citext NOT NULL,

first_name varchar(150),

last_name varchar(150),

status varchar(50) DEFAULT 'subscribed',

subscribed_at timestamptz DEFAULT now(),

unsubscribed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_newsletter_email
UNIQUE(organization_id,email)

);

CREATE TABLE IF NOT EXISTS service_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

slug varchar(150) NOT NULL,

description text,

sort_order integer DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

CONSTRAINT uq_service_category
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS services
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_id uuid,

title varchar(255) NOT NULL,

slug varchar(255) NOT NULL,

summary text,

description jsonb,

icon varchar(120),

featured_image text,

display_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(category_id)
REFERENCES service_categories(id),

CONSTRAINT uq_service_slug
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS project_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150),

slug varchar(150),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS website_projects
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_id uuid,

title varchar(255) NOT NULL,

slug varchar(255) NOT NULL,

summary text,

description jsonb,

client_name varchar(255),

featured_image text,

project_url text,

completed_on date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(category_id)
REFERENCES project_categories(id),

CONSTRAINT uq_project_slug
UNIQUE(organization_id,slug)

);

CREATE TABLE IF NOT EXISTS testimonials
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

customer_name varchar(255),

company_name varchar(255),

designation varchar(150),

testimonial text,

rating integer,

photo_url text,

display_order integer DEFAULT 0,

is_featured boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS team_members
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

full_name varchar(255) NOT NULL,

designation varchar(150),

department varchar(150),

bio text,

photo_url text,

email varchar(255),

linkedin_url text,

twitter_url text,

github_url text,

display_order integer DEFAULT 0,

is_featured boolean DEFAULT false,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (profile_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS careers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

title varchar(255) NOT NULL,

department varchar(150),

employment_type varchar(100),

location varchar(200),

experience_level varchar(100),

description jsonb,

requirements jsonb,

salary_range varchar(120),

vacancies integer,

closing_date date,

status varchar(50) DEFAULT 'open',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS career_applications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

career_id uuid NOT NULL,

full_name varchar(255),

email varchar(255),

phone varchar(50),

resume_url text,

cover_letter text,

status varchar(50) DEFAULT 'new',

submitted_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (career_id)
REFERENCES careers(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS faqs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category varchar(150),

question text NOT NULL,

answer text NOT NULL,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS website_events
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

title varchar(255),

description text,

event_type varchar(100),

venue varchar(255),

start_datetime timestamptz,

end_datetime timestamptz,

banner_url text,

registration_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS announcements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

title varchar(255),

content text,

priority varchar(50),

publish_from timestamptz,

publish_to timestamptz,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS website_search_index
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

title text,

search_content text,

slug text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS website_cache
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

cache_key varchar(255) UNIQUE,

cache_value jsonb,

expires_at timestamptz,

created_at timestamptz DEFAULT now()

);


-- ============================================================
-- SOURCE: 003_crm.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS companies
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_code varchar(50),

company_name varchar(255) NOT NULL,

legal_name varchar(255),

display_name varchar(255),

industry_id uuid,

company_type varchar(100),

website text,

email varchar(255),

phone varchar(50),

mobile varchar(50),

gst_number varchar(100),

tax_number varchar(100),

registration_number varchar(100),

employee_count integer,

annual_revenue numeric(18,2),

currency varchar(10),

timezone varchar(100),

status crm_status DEFAULT 'active',

owner_id uuid,

description text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
company_code
)

);

CREATE TABLE IF NOT EXISTS contacts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_id uuid,

contact_code varchar(50),

first_name varchar(150),

middle_name varchar(150),

last_name varchar(150),

display_name varchar(255),

job_title varchar(150),

department varchar(150),

email varchar(255),

phone varchar(50),

mobile varchar(50),

whatsapp varchar(50),

linkedin_url text,

date_of_birth date,

anniversary date,

owner_id uuid,

status crm_status DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
contact_code
)

);

CREATE TABLE IF NOT EXISTS contact_addresses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

address_type varchar(50),

address_line1 text,

address_line2 text,

city varchar(150),

state varchar(150),

postal_code varchar(30),

country varchar(100),

latitude numeric(12,8),

longitude numeric(12,8),

is_primary boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS contact_communications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

communication_type varchar(50),

communication_value text,

is_primary boolean DEFAULT false,

is_verified boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS contact_relationships
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

related_contact_id uuid NOT NULL,

relationship_type varchar(100),

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE,

FOREIGN KEY(related_contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS lead_sources
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

description text,

is_default boolean DEFAULT false,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

CREATE TABLE IF NOT EXISTS lead_statuses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

stage_order integer DEFAULT 0,

is_closed boolean DEFAULT false,

is_won boolean DEFAULT false,

color varchar(20),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

CREATE TABLE IF NOT EXISTS lead_assignments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

assigned_to uuid NOT NULL,

assigned_by uuid,

assigned_at timestamptz DEFAULT now(),

reason text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE,

FOREIGN KEY (assigned_to)
REFERENCES profiles(id),

FOREIGN KEY (assigned_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS lead_qualification
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

budget boolean,

authority boolean,

need_identified boolean,

timeline boolean,

score integer DEFAULT 0,

qualified_by uuid,

qualified_at timestamptz,

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE,

FOREIGN KEY (qualified_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS lead_status_history
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

old_status uuid,

new_status uuid,

changed_by uuid,

changed_at timestamptz DEFAULT now(),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS lead_scoring
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

engagement_score integer DEFAULT 0,

behavior_score integer DEFAULT 0,

fit_score integer DEFAULT 0,

ai_score integer DEFAULT 0,

total_score integer DEFAULT 0,

last_calculated timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS pipeline_stages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

stage_order integer NOT NULL,

default_probability numeric(5,2),

color varchar(20),

is_closed boolean DEFAULT false,

is_won boolean DEFAULT false,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

CREATE TABLE IF NOT EXISTS opportunities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

opportunity_number varchar(50),

lead_id uuid,

company_id uuid,

contact_id uuid,

pipeline_stage_id uuid,

owner_id uuid,

title varchar(255) NOT NULL,

expected_revenue numeric(18,2),

forecast_revenue numeric(18,2),

currency varchar(10),

probability numeric(5,2),

expected_close_date date,

actual_close_date date,

priority varchar(50),

description text,

status varchar(50) DEFAULT 'open',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (lead_id)
REFERENCES leads(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (contact_id)
REFERENCES contacts(id),

FOREIGN KEY (pipeline_stage_id)
REFERENCES pipeline_stages(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
opportunity_number
)

);

CREATE TABLE IF NOT EXISTS opportunity_history
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

old_stage_id uuid,

new_stage_id uuid,

old_probability numeric(5,2),

new_probability numeric(5,2),

changed_by uuid,

changed_at timestamptz DEFAULT now(),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS sales_forecasts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

forecast_period date NOT NULL,

forecast_type varchar(50),

expected_revenue numeric(18,2),

committed_revenue numeric(18,2),

best_case_revenue numeric(18,2),

worst_case_revenue numeric(18,2),

generated_by uuid,

generated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (generated_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS revenue_pipeline
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

pipeline_stage_id uuid,

expected_amount numeric(18,2),

weighted_amount numeric(18,2),

probability numeric(5,2),

forecast_month date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE,

FOREIGN KEY(pipeline_stage_id)
REFERENCES pipeline_stages(id)

);

CREATE TABLE IF NOT EXISTS opportunity_competitors
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

competitor_name varchar(255),

strengths text,

weaknesses text,

win_probability numeric(5,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS opportunity_products
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

product_id uuid,

quantity numeric(18,2),

unit_price numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS activity_timeline
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

timeline_type varchar(100),

timeline_title varchar(255),

timeline_description text,

event_datetime timestamptz DEFAULT now(),

performed_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE,

FOREIGN KEY(performed_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS meetings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

meeting_mode varchar(50),

meeting_link text,

meeting_location text,

agenda text,

minutes text,

recording_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS calls
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

call_direction varchar(50),

phone_number varchar(50),

call_duration integer,

call_result varchar(100),

recording_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS emails
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

from_email varchar(255),

to_email text,

cc_email text,

bcc_email text,

subject varchar(500),

body text,

email_status varchar(100),

sent_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS quotations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

quotation_number varchar(50) NOT NULL,

opportunity_id uuid,

company_id uuid NOT NULL,

contact_id uuid,

owner_id uuid,

status varchar(50) DEFAULT 'draft',

issue_date date,

expiry_date date,

subtotal numeric(18,2) DEFAULT 0,

discount_amount numeric(18,2) DEFAULT 0,

tax_amount numeric(18,2) DEFAULT 0,

shipping_amount numeric(18,2) DEFAULT 0,

grand_total numeric(18,2) DEFAULT 0,

currency varchar(10),

terms_conditions text,

notes text,

approved_by uuid,

approved_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),
FOREIGN KEY (owner_id) REFERENCES profiles(id),

UNIQUE(organization_id, quotation_number)

);

CREATE TABLE IF NOT EXISTS quotation_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

quotation_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount_percent numeric(8,2),

discount_amount numeric(18,2),

tax_percent numeric(8,2),

tax_amount numeric(18,2),

line_total numeric(18,2),

sort_order integer DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (quotation_id)
REFERENCES quotations(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS sales_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

sales_order_number varchar(50) NOT NULL,

quotation_id uuid,

company_id uuid NOT NULL,

contact_id uuid,

status varchar(50) DEFAULT 'draft',

order_date date,

delivery_date date,

subtotal numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

grand_total numeric(18,2),

currency varchar(10),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (quotation_id) REFERENCES quotations(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),

UNIQUE(organization_id,sales_order_number)

);

CREATE TABLE IF NOT EXISTS sales_order_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

sales_order_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (sales_order_id)
REFERENCES sales_orders(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS contracts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

contract_number varchar(50) NOT NULL,

sales_order_id uuid,

company_id uuid NOT NULL,

contract_title varchar(255),

contract_type varchar(100),

contract_status varchar(50),

effective_date date,

expiry_date date,

renewal_date date,

contract_value numeric(18,2),

currency varchar(10),

signed_by_customer boolean DEFAULT false,

signed_by_company boolean DEFAULT false,

document_url text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),
FOREIGN KEY (company_id) REFERENCES companies(id),

UNIQUE(organization_id,contract_number)

);

CREATE TABLE IF NOT EXISTS contract_milestones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id uuid NOT NULL,

title varchar(255),

description text,

planned_date date,

completed_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS contract_renewals
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id uuid NOT NULL,

renewal_number integer,

renewal_date date,

new_expiry_date date,

renewal_amount numeric(18,2),

status varchar(50),

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS product_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

parent_category_id uuid,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (parent_category_id)
REFERENCES product_categories(id)

);

CREATE TABLE IF NOT EXISTS products
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_id uuid,

product_code varchar(50) NOT NULL,

product_name varchar(255) NOT NULL,

product_type varchar(100),

sku varchar(100),

barcode varchar(100),

description text,

short_description text,

unit_of_measure varchar(50),

standard_cost numeric(18,2),

list_price numeric(18,2),

currency varchar(10),

tax_percentage numeric(8,2),

is_sellable boolean DEFAULT true,

is_service boolean DEFAULT false,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (category_id)
REFERENCES product_categories(id),

UNIQUE
(
organization_id,
product_code
)

);

CREATE TABLE IF NOT EXISTS price_books
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

price_book_name varchar(255),

description text,

currency varchar(10),

effective_from date,

effective_to date,

is_default boolean DEFAULT false,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS product_pricing
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

price_book_id uuid NOT NULL,

product_id uuid NOT NULL,

unit_price numeric(18,2),

minimum_price numeric(18,2),

maximum_discount_percent numeric(8,2),

effective_from date,

effective_to date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (price_book_id)
REFERENCES price_books(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS product_inventory
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

product_id uuid NOT NULL,

warehouse_name varchar(255),

quantity_on_hand numeric(18,2),

quantity_reserved numeric(18,2),

reorder_level numeric(18,2),

reorder_quantity numeric(18,2),

last_stock_update timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (product_id)
REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS product_bundles
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bundle_product_id uuid NOT NULL,

child_product_id uuid NOT NULL,

quantity numeric(18,2),

sort_order integer DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(bundle_product_id)
REFERENCES products(id)
ON DELETE CASCADE,

FOREIGN KEY(child_product_id)
REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS product_attachments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

product_id uuid NOT NULL,

attachment_name varchar(255),

attachment_type varchar(100),

storage_path text,

public_url text,

file_size bigint,

mime_type varchar(100),

uploaded_by uuid,

uploaded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(product_id)
REFERENCES products(id)
ON DELETE CASCADE,

FOREIGN KEY(uploaded_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS invoices
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

invoice_number varchar(50) NOT NULL,

company_id uuid NOT NULL,

contact_id uuid,

contract_id uuid,

sales_order_id uuid,

invoice_date date NOT NULL,

due_date date,

status varchar(50) DEFAULT 'draft',

subtotal numeric(18,2) DEFAULT 0,

discount_amount numeric(18,2) DEFAULT 0,

tax_amount numeric(18,2) DEFAULT 0,

grand_total numeric(18,2) DEFAULT 0,

balance_due numeric(18,2) DEFAULT 0,

currency varchar(10),

notes text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),
FOREIGN KEY (contract_id) REFERENCES contracts(id),
FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),

UNIQUE(organization_id,invoice_number)

);

CREATE TABLE IF NOT EXISTS invoice_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

invoice_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(invoice_id)
REFERENCES invoices(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS payment_transactions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

payment_id uuid NOT NULL,

gateway varchar(100),

gateway_transaction_id varchar(255),

authorization_code varchar(255),

transaction_status varchar(100),

gateway_response jsonb,

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(payment_id)
REFERENCES payments(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS credit_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

credit_note_number varchar(50),

invoice_id uuid,

credit_date date,

reason text,

credit_amount numeric(18,2),

status varchar(50),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(invoice_id)
REFERENCES invoices(id)

);

CREATE TABLE IF NOT EXISTS refunds
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

payment_id uuid,

refund_date date,

refund_amount numeric(18,2),

refund_reason text,

refund_status varchar(50),

processed_by uuid,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(payment_id)
REFERENCES payments(id),

FOREIGN KEY(processed_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS revenue_recognition
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

contract_id uuid,

invoice_id uuid,

recognition_period date,

recognized_amount numeric(18,2),

recognition_type varchar(100),

recognized_at timestamptz,

recognized_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(contract_id)
REFERENCES contracts(id),

FOREIGN KEY(invoice_id)
REFERENCES invoices(id),

FOREIGN KEY(recognized_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS project_members
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

profile_id uuid NOT NULL,

role_name varchar(100),

allocation_percent numeric(5,2),

joined_on date,

left_on date,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS project_phases
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

phase_name varchar(255),

phase_order integer,

phase_status varchar(50),

planned_start date,

planned_end date,

actual_start date,

actual_end date,

progress_percent numeric(5,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS project_milestones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

phase_id uuid,

milestone_name varchar(255),

description text,

planned_date date,

completed_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(phase_id)
REFERENCES project_phases(id)

);

CREATE TABLE IF NOT EXISTS project_deliverables
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

milestone_id uuid,

deliverable_name varchar(255),

description text,

delivery_status varchar(50),

delivery_date date,

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(milestone_id)
REFERENCES project_milestones(id),

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS time_entries
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

task_id uuid,

profile_id uuid NOT NULL,

work_date date,

hours numeric(10,2),

billable_hours numeric(10,2),

hourly_rate numeric(18,2),

description text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(task_id)
REFERENCES tasks(id),

FOREIGN KEY(profile_id)
REFERENCES profiles(id),

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS resource_allocations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

profile_id uuid NOT NULL,

allocation_start date,

allocation_end date,

allocation_percent numeric(5,2),

planned_hours numeric(10,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS project_risks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

risk_title varchar(255),

risk_category varchar(100),

probability varchar(50),

impact varchar(50),

severity varchar(50),

mitigation_plan text,

owner_id uuid,

status varchar(50),

identified_on date,

closed_on date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(owner_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS ticket_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,category_code)

);

CREATE TABLE IF NOT EXISTS ticket_priorities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

priority_code varchar(50),

priority_name varchar(100),

response_hours integer,

resolution_hours integer,

color varchar(20),

display_order integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,priority_code)

);

CREATE TABLE IF NOT EXISTS support_tickets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

ticket_number varchar(50) NOT NULL,

company_id uuid,

contact_id uuid,

project_id uuid,

category_id uuid,

priority_id uuid,

assigned_to uuid,

ticket_subject varchar(255),

ticket_description text,

ticket_status varchar(50),

opened_at timestamptz,

closed_at timestamptz,

first_response_at timestamptz,

resolution_due_at timestamptz,

customer_satisfaction integer,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (contact_id)
REFERENCES contacts(id),

FOREIGN KEY (project_id)
REFERENCES projects(id),

FOREIGN KEY (category_id)
REFERENCES ticket_categories(id),

FOREIGN KEY (priority_id)
REFERENCES ticket_priorities(id),

FOREIGN KEY (assigned_to)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
ticket_number
)

);

CREATE TABLE IF NOT EXISTS ticket_comments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

comment_type varchar(50),

comment_text text,

is_internal boolean DEFAULT false,

commented_by uuid,

commented_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(commented_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS sla_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

sla_name varchar(255),

priority_id uuid,

response_time_hours integer,

resolution_time_hours integer,

business_hours_only boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(priority_id)
REFERENCES ticket_priorities(id)

);

CREATE TABLE IF NOT EXISTS ticket_sla_tracking
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

sla_definition_id uuid,

response_due timestamptz,

resolution_due timestamptz,

response_met boolean,

resolution_met boolean,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(sla_definition_id)
REFERENCES sla_definitions(id)

);

CREATE TABLE IF NOT EXISTS ticket_escalations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

escalation_level integer,

escalated_to uuid,

reason text,

escalated_at timestamptz,

resolved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(escalated_to)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS ticket_knowledge_links
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

knowledge_article_id uuid,

linked_by uuid,

linked_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(linked_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS ai_assistants
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

assistant_code varchar(100),

assistant_name varchar(255) NOT NULL,

assistant_type varchar(100),

model_name varchar(150),

system_prompt text,

temperature numeric(4,2),

max_tokens integer,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,assistant_code)

);

CREATE TABLE IF NOT EXISTS ai_conversations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

assistant_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

conversation_title varchar(255),

started_by uuid,

started_at timestamptz DEFAULT now(),

ended_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (assistant_id)
REFERENCES ai_assistants(id),

FOREIGN KEY (started_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS ai_messages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

conversation_id uuid NOT NULL,

message_role varchar(50),

message_content text,

token_count integer,

response_time_ms integer,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(conversation_id)
REFERENCES ai_conversations(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS ai_prompts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

prompt_name varchar(255),

prompt_category varchar(100),

prompt_template text,

version integer DEFAULT 1,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS ai_recommendations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

recommendation_type varchar(100),

recommendation text,

confidence_score numeric(5,2),

accepted boolean,

accepted_by uuid,

accepted_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(accepted_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS workflow_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

workflow_code varchar(100),

workflow_name varchar(255),

module_name varchar(100),

trigger_type varchar(100),

workflow_definition jsonb,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,workflow_code)

);

CREATE TABLE IF NOT EXISTS workflow_executions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

execution_status varchar(50),

started_at timestamptz,

completed_at timestamptz,

execution_log jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS workflow_conditions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

condition_order integer,

field_name varchar(255),

operator varchar(50),

comparison_value text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS workflow_actions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

action_order integer,

action_type varchar(100),

action_configuration jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS dashboards
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

dashboard_code varchar(100),

dashboard_name varchar(255) NOT NULL,

dashboard_type varchar(100),

description text,

is_default boolean DEFAULT false,

visibility varchar(50),

owner_id uuid,

layout jsonb,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE(organization_id,dashboard_code)

);

CREATE TABLE IF NOT EXISTS dashboard_widgets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

dashboard_id uuid NOT NULL,

widget_code varchar(100),

widget_type varchar(100),

widget_title varchar(255),

widget_configuration jsonb,

position_x integer,

position_y integer,

width integer,

height integer,

refresh_interval integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(dashboard_id)
REFERENCES dashboards(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS kpi_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

kpi_code varchar(100),

kpi_name varchar(255),

category varchar(100),

calculation_method text,

display_format varchar(50),

target_value numeric(18,4),

warning_threshold numeric(18,4),

critical_threshold numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,kpi_code)

);

CREATE TABLE IF NOT EXISTS kpi_values
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

kpi_definition_id uuid NOT NULL,

calculation_date date,

period_type varchar(50),

actual_value numeric(18,4),

target_value numeric(18,4),

variance numeric(18,4),

variance_percent numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(kpi_definition_id)
REFERENCES kpi_definitions(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS reports
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

report_code varchar(100),

report_name varchar(255),

module_name varchar(100),

report_type varchar(100),

query_definition jsonb,

chart_definition jsonb,

is_scheduled boolean DEFAULT false,

owner_id uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id),

UNIQUE(organization_id,report_code)

);

CREATE TABLE IF NOT EXISTS report_executions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

report_id uuid NOT NULL,

executed_by uuid,

started_at timestamptz,

completed_at timestamptz,

execution_status varchar(50),

execution_time_ms integer,

result_location text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(report_id)
REFERENCES reports(id)
ON DELETE CASCADE,

FOREIGN KEY(executed_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS executive_snapshots
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

snapshot_date date,

snapshot_type varchar(100),

snapshot_data jsonb,

generated_by uuid,

generated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(generated_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS forecast_models
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

model_code varchar(100),

model_name varchar(255),

forecast_type varchar(100),

algorithm varchar(150),

training_period varchar(100),

forecast_period varchar(100),

model_accuracy numeric(8,4),

last_trained_at timestamptz,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,model_code)

);

CREATE TABLE IF NOT EXISTS forecast_results
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

forecast_model_id uuid NOT NULL,

forecast_period date,

predicted_value numeric(18,4),

confidence_score numeric(8,4),

actual_value numeric(18,4),

prediction_error numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(forecast_model_id)
REFERENCES forecast_models(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS system_events
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid,

event_name varchar(255),

event_category varchar(100),

severity varchar(50),

payload jsonb,

processed boolean DEFAULT false,

processed_at timestamptz,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb

);

CREATE TABLE IF NOT EXISTS tags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

tag_name varchar(150),

tag_color varchar(20),

tag_category varchar(100),

metadata jsonb DEFAULT '{}'::jsonb,

UNIQUE(organization_id,tag_name),

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS entity_tags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

entity_type varchar(100),

entity_id uuid,

tag_id uuid,

created_at timestamptz DEFAULT now(),

FOREIGN KEY(tag_id)
REFERENCES tags(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS saved_filters
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

owner_id uuid,

module_name varchar(100),

filter_name varchar(255),

filter_definition jsonb,

is_shared boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS custom_fields
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

field_name varchar(255),

field_label varchar(255),

field_type varchar(100),

validation_rules jsonb,

default_value text,

display_order integer,

is_required boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS custom_field_values
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

custom_field_id uuid,

entity_type varchar(100),

entity_id uuid,

field_value jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(custom_field_id)
REFERENCES custom_fields(id)
ON DELETE CASCADE

);


-- ============================================================
-- SOURCE: 004_erp.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS vendor_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

is_active boolean DEFAULT true,

display_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
category_code
)

);

CREATE TABLE IF NOT EXISTS vendors
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_code varchar(50) NOT NULL,

vendor_name varchar(255) NOT NULL,

legal_name varchar(255),

vendor_category_id uuid,

website text,

email varchar(255),

phone varchar(50),

mobile varchar(50),

gst_number varchar(100),

tax_number varchar(100),

registration_number varchar(100),

payment_terms varchar(100),

credit_limit numeric(18,2),

currency varchar(10),

vendor_rating numeric(5,2),

status varchar(50) DEFAULT 'active',

owner_id uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (vendor_category_id)
REFERENCES vendor_categories(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
vendor_code
)

);

CREATE TABLE IF NOT EXISTS vendor_contacts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

vendor_id uuid NOT NULL,

first_name varchar(150),

last_name varchar(150),

designation varchar(150),

email varchar(255),

phone varchar(50),

mobile varchar(50),

is_primary boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(vendor_id)
REFERENCES vendors(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS purchase_requisitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

requisition_number varchar(50) NOT NULL,

department varchar(150),

requested_by uuid,

approved_by uuid,

status varchar(50),

priority varchar(50),

required_date date,

description text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (requested_by)
REFERENCES profiles(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
requisition_number
)

);

CREATE TABLE IF NOT EXISTS purchase_requisition_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

requisition_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

estimated_unit_cost numeric(18,2),

required_date date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(requisition_id)
REFERENCES purchase_requisitions(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS purchase_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

purchase_order_number varchar(50) NOT NULL,

vendor_id uuid NOT NULL,

requisition_id uuid,

status varchar(50),

order_date date,

expected_delivery_date date,

subtotal numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

grand_total numeric(18,2),

currency varchar(10),

approved_by uuid,

approved_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (vendor_id)
REFERENCES vendors(id),

FOREIGN KEY (requisition_id)
REFERENCES purchase_requisitions(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
purchase_order_number
)

);

CREATE TABLE IF NOT EXISTS purchase_order_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

purchase_order_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_cost numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

received_quantity numeric(18,2) DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(purchase_order_id)
REFERENCES purchase_orders(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS warehouses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_code varchar(50) NOT NULL,

warehouse_name varchar(255) NOT NULL,

warehouse_type varchar(100),

address_line1 text,

address_line2 text,

city varchar(150),

state varchar(150),

postal_code varchar(30),

country varchar(100),

manager_id uuid,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (manager_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
warehouse_code
)

);

CREATE TABLE IF NOT EXISTS warehouse_bins
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

warehouse_id uuid NOT NULL,

bin_code varchar(100),

bin_name varchar(255),

zone varchar(100),

aisle varchar(100),

rack varchar(100),

shelf varchar(100),

capacity numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS inventory
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid NOT NULL,

product_id uuid NOT NULL,

available_quantity numeric(18,2) DEFAULT 0,

reserved_quantity numeric(18,2) DEFAULT 0,

damaged_quantity numeric(18,2) DEFAULT 0,

minimum_stock numeric(18,2),

maximum_stock numeric(18,2),

reorder_level numeric(18,2),

average_cost numeric(18,2),

last_stock_update timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (product_id)
REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS stock_movements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid,

product_id uuid,

movement_type varchar(50),

reference_type varchar(100),

reference_id uuid,

quantity numeric(18,2),

unit_cost numeric(18,2),

movement_date timestamptz,

performed_by uuid,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (performed_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS goods_receipt_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

grn_number varchar(50),

purchase_order_id uuid,

warehouse_id uuid,

vendor_id uuid,

received_date date,

received_by uuid,

status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (purchase_order_id)
REFERENCES purchase_orders(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (vendor_id)
REFERENCES vendors(id),

FOREIGN KEY (received_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS goods_issue_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

gin_number varchar(50),

warehouse_id uuid,

issued_date date,

issued_to uuid,

issued_by uuid,

purpose varchar(255),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (issued_to)
REFERENCES profiles(id),

FOREIGN KEY (issued_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS inventory_adjustments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid,

product_id uuid,

adjustment_type varchar(50),

old_quantity numeric(18,2),

new_quantity numeric(18,2),

adjustment_reason text,

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS inventory_transfers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

transfer_number varchar(50),

from_warehouse_id uuid,

to_warehouse_id uuid,

transfer_date date,

status varchar(50),

approved_by uuid,

approved_at timestamptz,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (from_warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (to_warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS bill_of_materials
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

product_id uuid NOT NULL,

bom_code varchar(50),

bom_name varchar(255),

revision varchar(50),

status varchar(50) DEFAULT 'active',

effective_from date,

effective_to date,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (product_id)
REFERENCES products(id),

UNIQUE
(
organization_id,
bom_code
)

);

CREATE TABLE IF NOT EXISTS bom_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bom_id uuid NOT NULL,

component_product_id uuid NOT NULL,

quantity numeric(18,4),

unit_of_measure varchar(50),

wastage_percent numeric(8,2),

sort_order integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (bom_id)
REFERENCES bill_of_materials(id)
ON DELETE CASCADE,

FOREIGN KEY (component_product_id)
REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS work_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

work_order_number varchar(50),

bom_id uuid,

product_id uuid,

planned_quantity numeric(18,2),

completed_quantity numeric(18,2),

production_status varchar(50),

planned_start date,

planned_finish date,

actual_start timestamptz,

actual_finish timestamptz,

production_manager uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (bom_id)
REFERENCES bill_of_materials(id),

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (production_manager)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
work_order_number
)

);

CREATE TABLE IF NOT EXISTS production_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

work_order_id uuid NOT NULL,

run_number integer,

machine_name varchar(255),

operator_id uuid,

planned_output numeric(18,2),

actual_output numeric(18,2),

start_time timestamptz,

end_time timestamptz,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (work_order_id)
REFERENCES work_orders(id)
ON DELETE CASCADE,

FOREIGN KEY (operator_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS material_consumption
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

planned_quantity numeric(18,2),

actual_quantity numeric(18,2),

variance_quantity numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id)

);

CREATE TABLE IF NOT EXISTS finished_goods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

quantity numeric(18,2),

warehouse_id uuid,

received_date timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id)

);

CREATE TABLE IF NOT EXISTS quality_inspections
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

inspection_number varchar(50),

inspection_type varchar(100),

reference_type varchar(100),

reference_id uuid,

inspector_id uuid,

inspection_date timestamptz,

overall_result varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (inspector_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
inspection_number
)

);

CREATE TABLE IF NOT EXISTS quality_checks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

inspection_id uuid NOT NULL,

check_name varchar(255),

expected_value text,

actual_value text,

result varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (inspection_id)
REFERENCES quality_inspections(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS production_scrap
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

scrap_quantity numeric(18,2),

scrap_reason text,

scrap_cost numeric(18,2),

recorded_by uuid,

recorded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (recorded_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS fiscal_years
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

fiscal_year_code varchar(50),

fiscal_year_name varchar(100),

start_date date NOT NULL,

end_date date NOT NULL,

status varchar(50) DEFAULT 'Open',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,fiscal_year_code)

);

CREATE TABLE IF NOT EXISTS accounting_periods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

fiscal_year_id uuid NOT NULL,

period_number integer,

period_name varchar(100),

start_date date,

end_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(fiscal_year_id)
REFERENCES fiscal_years(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS chart_of_accounts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_code varchar(50),

account_name varchar(255),

account_type varchar(100),

parent_account_id uuid,

normal_balance varchar(10),

allow_posting boolean DEFAULT true,

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(parent_account_id)
REFERENCES chart_of_accounts(id),

UNIQUE(organization_id,account_code)

);

CREATE TABLE IF NOT EXISTS cost_centers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

cost_center_code varchar(50),

cost_center_name varchar(255),

manager_id uuid,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(manager_id)
REFERENCES profiles(id),

UNIQUE(organization_id,cost_center_code)

);

CREATE TABLE IF NOT EXISTS journal_entries
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

journal_number varchar(50),

journal_date date,

journal_type varchar(100),

reference_type varchar(100),

reference_id uuid,

description text,

posting_status varchar(50),

posted_by uuid,

posted_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(posted_by)
REFERENCES profiles(id),

UNIQUE(organization_id,journal_number)

);

CREATE TABLE IF NOT EXISTS journal_entry_lines
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

journal_entry_id uuid NOT NULL,

account_id uuid NOT NULL,

cost_center_id uuid,

debit_amount numeric(18,2) DEFAULT 0,

credit_amount numeric(18,2) DEFAULT 0,

line_description text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(journal_entry_id)
REFERENCES journal_entries(id)
ON DELETE CASCADE,

FOREIGN KEY(account_id)
REFERENCES chart_of_accounts(id),

FOREIGN KEY(cost_center_id)
REFERENCES cost_centers(id)

);

CREATE TABLE IF NOT EXISTS general_ledger
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_id uuid,

journal_line_id uuid,

transaction_date date,

debit_amount numeric(18,2),

credit_amount numeric(18,2),

running_balance numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(account_id)
REFERENCES chart_of_accounts(id),

FOREIGN KEY(journal_line_id)
REFERENCES journal_entry_lines(id)

);

CREATE TABLE IF NOT EXISTS bank_accounts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_name varchar(255),

bank_name varchar(255),

account_number varchar(100),

ifsc_code varchar(50),

swift_code varchar(100),

currency varchar(10),

opening_balance numeric(18,2),

current_balance numeric(18,2),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

CREATE TABLE IF NOT EXISTS bank_transactions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bank_account_id uuid NOT NULL,

transaction_date date,

transaction_type varchar(100),

reference_number varchar(255),

description text,

debit_amount numeric(18,2),

credit_amount numeric(18,2),

balance_after numeric(18,2),

reconciled boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(bank_account_id)
REFERENCES bank_accounts(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS accounts_receivable
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

invoice_id uuid NOT NULL,

company_id uuid NOT NULL,

due_date date,

original_amount numeric(18,2),

received_amount numeric(18,2) DEFAULT 0,

outstanding_amount numeric(18,2),

aging_bucket varchar(50),

collection_status varchar(50),

last_followup_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (invoice_id) REFERENCES invoices(id),

FOREIGN KEY (company_id) REFERENCES companies(id)

);

CREATE TABLE IF NOT EXISTS accounts_payable
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_id uuid NOT NULL,

purchase_order_id uuid,

vendor_invoice_number varchar(100),

invoice_date date,

due_date date,

invoice_amount numeric(18,2),

paid_amount numeric(18,2) DEFAULT 0,

balance_amount numeric(18,2),

payment_status varchar(50),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (vendor_id) REFERENCES vendors(id),

FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id)

);

CREATE TABLE IF NOT EXISTS customer_statements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_id uuid NOT NULL,

statement_period_from date,

statement_period_to date,

opening_balance numeric(18,2),

closing_balance numeric(18,2),

generated_at timestamptz,

generated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (company_id) REFERENCES companies(id),

FOREIGN KEY (generated_by) REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS vendor_statements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_id uuid NOT NULL,

statement_period_from date,

statement_period_to date,

opening_balance numeric(18,2),

closing_balance numeric(18,2),

generated_at timestamptz,

generated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (vendor_id) REFERENCES vendors(id),

FOREIGN KEY (generated_by) REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS payment_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

payment_run_number varchar(50),

payment_date date,

payment_method varchar(100),

status varchar(50),

total_payments integer,

total_amount numeric(18,2),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (approved_by) REFERENCES profiles(id),

UNIQUE(organization_id,payment_run_number)

);

CREATE TABLE IF NOT EXISTS expense_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255),

requires_approval boolean DEFAULT true,

is_billable boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,category_code)

);

CREATE TABLE IF NOT EXISTS expense_claims
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

employee_id uuid,

expense_category_id uuid,

claim_number varchar(50),

expense_date date,

expense_amount numeric(18,2),

currency varchar(10),

description text,

receipt_url text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

reimbursed boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (employee_id)
REFERENCES profiles(id),

FOREIGN KEY (expense_category_id)
REFERENCES expense_categories(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE(organization_id,claim_number)

);

CREATE TABLE IF NOT EXISTS tax_configuration
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

tax_code varchar(50),

tax_name varchar(255),

tax_type varchar(100),

tax_percentage numeric(8,4),

country varchar(100),

state varchar(100),

effective_from date,

effective_to date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,tax_code)

);

CREATE TABLE IF NOT EXISTS departments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

department_code varchar(50) NOT NULL,

department_name varchar(255) NOT NULL,

parent_department_id uuid,

manager_id uuid,

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (parent_department_id) REFERENCES departments(id),

FOREIGN KEY (manager_id) REFERENCES profiles(id),

UNIQUE(organization_id,department_code)

);

CREATE TABLE IF NOT EXISTS designations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

designation_code varchar(50),

designation_name varchar(255),

job_level varchar(100),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,designation_code)

);

CREATE TABLE IF NOT EXISTS employees
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

employee_number varchar(50) NOT NULL,

department_id uuid,

designation_id uuid,

reporting_manager uuid,

employment_type varchar(100),

joining_date date,

confirmation_date date,

exit_date date,

employment_status varchar(50),

work_location varchar(255),

annual_ctc numeric(18,2),

currency varchar(10),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (profile_id) REFERENCES profiles(id),

FOREIGN KEY (department_id) REFERENCES departments(id),

FOREIGN KEY (designation_id) REFERENCES designations(id),

FOREIGN KEY (reporting_manager) REFERENCES employees(id),

UNIQUE(organization_id,employee_number)

);

CREATE TABLE IF NOT EXISTS attendance
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

attendance_date date,

check_in timestamptz,

check_out timestamptz,

worked_hours numeric(10,2),

attendance_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id)

);

CREATE TABLE IF NOT EXISTS leave_types
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

leave_code varchar(50),

leave_name varchar(255),

annual_quota numeric(10,2),

carry_forward boolean DEFAULT false,

requires_approval boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,leave_code)

);

CREATE TABLE IF NOT EXISTS leave_requests
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

leave_type_id uuid,

from_date date,

to_date date,

total_days numeric(10,2),

reason text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id),

FOREIGN KEY(leave_type_id)
REFERENCES leave_types(id),

FOREIGN KEY(approved_by)
REFERENCES employees(id)

);

CREATE TABLE IF NOT EXISTS payroll_periods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

period_code varchar(50),

period_name varchar(100),

period_start date,

period_end date,

status varchar(50),

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,period_code)

);

CREATE TABLE IF NOT EXISTS payroll_components
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

component_code varchar(50),

component_name varchar(255),

component_type varchar(50),

taxable boolean,

formula text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,component_code)

);

CREATE TABLE IF NOT EXISTS payroll_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

payroll_period_id uuid NOT NULL,

employee_id uuid,

gross_salary numeric(18,2),

deductions numeric(18,2),

net_salary numeric(18,2),

payment_status varchar(50),

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(payroll_period_id)
REFERENCES payroll_periods(id),

FOREIGN KEY(employee_id)
REFERENCES employees(id)

);

CREATE TABLE IF NOT EXISTS employee_documents
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

document_type varchar(100),

document_name varchar(255),

storage_path text,

public_url text,

expiry_date date,

uploaded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id)
ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS asset_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50) NOT NULL,

category_name varchar(255) NOT NULL,

depreciation_method varchar(100),

default_life_months integer,

default_depreciation_rate numeric(10,4),

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
category_code
)

);

CREATE TABLE IF NOT EXISTS assets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

asset_number varchar(50) NOT NULL,

asset_name varchar(255) NOT NULL,

asset_category_id uuid,

serial_number varchar(255),

manufacturer varchar(255),

model_number varchar(255),

purchase_date date,

purchase_cost numeric(18,2),

current_book_value numeric(18,2),

salvage_value numeric(18,2),

useful_life_months integer,

status varchar(50),

warehouse_id uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (asset_category_id)
REFERENCES asset_categories(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

UNIQUE
(
organization_id,
asset_number
)

);

CREATE TABLE IF NOT EXISTS asset_allocations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

employee_id uuid,

department_id uuid,

allocated_date date,

expected_return_date date,

returned_date date,

allocation_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(employee_id)
REFERENCES employees(id),

FOREIGN KEY(department_id)
REFERENCES departments(id)

);

CREATE TABLE IF NOT EXISTS asset_maintenance
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

maintenance_type varchar(100),

vendor_id uuid,

scheduled_date date,

completed_date date,

maintenance_cost numeric(18,2),

maintenance_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(vendor_id)
REFERENCES vendors(id)

);

CREATE TABLE IF NOT EXISTS asset_depreciation
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

depreciation_period date,

opening_value numeric(18,2),

depreciation_amount numeric(18,2),

closing_value numeric(18,2),

journal_entry_id uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(journal_entry_id)
REFERENCES journal_entries(id)

);

CREATE TABLE IF NOT EXISTS asset_disposals
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

disposal_date date,

disposal_method varchar(100),

sale_amount numeric(18,2),

gain_loss numeric(18,2),

approved_by uuid,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS compliance_registers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

register_code varchar(50),

register_name varchar(255),

compliance_type varchar(100),

owner_id uuid,

status varchar(50),

review_frequency varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
register_code
)

);

CREATE TABLE IF NOT EXISTS licenses_certifications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

license_number varchar(100),

license_name varchar(255),

issuing_authority varchar(255),

issue_date date,

expiry_date date,

renewal_required boolean DEFAULT true,

owner_department uuid,

status varchar(50),

document_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_department)
REFERENCES departments(id)

);

CREATE TABLE IF NOT EXISTS erp_reports
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

report_code varchar(50) NOT NULL,

report_name varchar(255) NOT NULL,

report_category varchar(100),

description text,

query_definition text,

report_status varchar(50) DEFAULT 'Active',

created_by uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (created_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
report_code
)

);

CREATE TABLE IF NOT EXISTS approval_workflows
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

workflow_code varchar(50),

workflow_name varchar(255),

entity_name varchar(100),

minimum_amount numeric(18,2),

maximum_amount numeric(18,2),

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
workflow_code
)

);

CREATE TABLE IF NOT EXISTS approval_steps
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

step_order integer,

role_name varchar(100),

approver_id uuid,

approval_required boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES approval_workflows(id)
ON DELETE CASCADE,

FOREIGN KEY(approver_id)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS erp_audit_logs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_name varchar(100),

entity_id uuid,

operation varchar(50),

performed_by uuid,

performed_at timestamptz DEFAULT now(),

old_values jsonb,

new_values jsonb,

ip_address inet,

user_agent text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(performed_by)
REFERENCES profiles(id)

);

CREATE TABLE IF NOT EXISTS erp_settings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

setting_group varchar(100),

setting_key varchar(150),

setting_value jsonb,

updated_by uuid,

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(updated_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
setting_group,
setting_key
)

);

CREATE TABLE IF NOT EXISTS erp_dashboard_widgets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

widget_code varchar(50),

widget_name varchar(255),

widget_category varchar(100),

default_position integer,

configuration jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
widget_code
)

);

CREATE TABLE IF NOT EXISTS erp_system_events
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

event_name varchar(255),

event_source varchar(100),

severity varchar(50),

event_time timestamptz DEFAULT now(),

details jsonb,

resolved boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);


-- ============================================================
-- SOURCE: 005_admin.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_platform_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key TEXT NOT NULL UNIQUE,

    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,

    description TEXT,

    scope configuration_scope NOT NULL DEFAULT 'platform',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_organizations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    status admin_status DEFAULT 'active',

    display_name TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    notes TEXT,

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ

);

CREATE TABLE IF NOT EXISTS admin_organization_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    setting_key TEXT NOT NULL,

    setting_value JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(
        organization_id,
        setting_key
    )

);

CREATE TABLE IF NOT EXISTS admin_users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    status admin_status DEFAULT 'active',

    admin_notes TEXT,

    last_login_at TIMESTAMPTZ,

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ

);

CREATE TABLE IF NOT EXISTS admin_user_invitations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    email TEXT NOT NULL,

    role_id UUID,

    status user_invitation_status
        DEFAULT 'pending',

    invitation_token TEXT UNIQUE,

    expires_at TIMESTAMPTZ,

    invited_by UUID REFERENCES profiles(id),

    accepted_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_organization_features (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    feature_key TEXT NOT NULL,

    enabled BOOLEAN DEFAULT FALSE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(
        organization_id,
        feature_key
    )

);

CREATE TABLE IF NOT EXISTS admin_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    role_name TEXT NOT NULL,

    role_key TEXT NOT NULL,

    description TEXT,

    is_system_role BOOLEAN DEFAULT FALSE,

    status admin_status DEFAULT 'active',

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    UNIQUE(
        organization_id,
        role_key
    )

);

CREATE TABLE IF NOT EXISTS admin_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    permission_key TEXT NOT NULL UNIQUE,

    module_name TEXT NOT NULL,

    action_name TEXT NOT NULL,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_system_permission BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_role_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,

    permission_id UUID NOT NULL
        REFERENCES admin_permissions(id)
        ON DELETE CASCADE,


    granted BOOLEAN DEFAULT TRUE,


    created_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        role_id,
        permission_id
    )

);

CREATE TABLE IF NOT EXISTS admin_user_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,


    is_primary BOOLEAN DEFAULT FALSE,


    assigned_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        user_id,
        organization_id,
        role_id
    )

);

CREATE TABLE IF NOT EXISTS admin_role_delegations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    delegator_user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    delegate_user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,


    start_date TIMESTAMPTZ NOT NULL,


    end_date TIMESTAMPTZ NOT NULL,


    reason TEXT,


    is_active BOOLEAN DEFAULT TRUE,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_user_permission_overrides (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    permission_id UUID NOT NULL
        REFERENCES admin_permissions(id)
        ON DELETE CASCADE,


    granted BOOLEAN DEFAULT TRUE,


    reason TEXT,


    expires_at TIMESTAMPTZ,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        user_id,
        organization_id,
        permission_id
    )

);

CREATE TABLE IF NOT EXISTS admin_audit_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    user_id UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,


    event_type TEXT NOT NULL,


    module_name TEXT,


    entity_type TEXT,


    entity_id UUID,


    action TEXT NOT NULL,


    old_values JSONB DEFAULT '{}'::jsonb,


    new_values JSONB DEFAULT '{}'::jsonb,


    metadata JSONB DEFAULT '{}'::jsonb,


    ip_address INET,


    user_agent TEXT,


    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_feature_flags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    feature_key TEXT NOT NULL UNIQUE,


    feature_name TEXT NOT NULL,


    description TEXT,


    is_enabled BOOLEAN DEFAULT FALSE,


    rollout_percentage INTEGER DEFAULT 0,


    configuration JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_feature_flag_assignments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    feature_flag_id UUID NOT NULL
        REFERENCES admin_feature_flags(id)
        ON DELETE CASCADE,


    enabled BOOLEAN DEFAULT FALSE,


    configuration JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        feature_flag_id
    )

);

CREATE TABLE IF NOT EXISTS admin_license_plans (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    plan_code TEXT NOT NULL UNIQUE,


    plan_name TEXT NOT NULL,


    description TEXT,


    pricing JSONB DEFAULT '{}'::jsonb,


    limits JSONB DEFAULT '{}'::jsonb,


    features JSONB DEFAULT '{}'::jsonb,


    is_active BOOLEAN DEFAULT TRUE,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_organization_licenses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    license_plan_id UUID NOT NULL
        REFERENCES admin_license_plans(id)
        ON DELETE RESTRICT,


    status subscription_status DEFAULT 'trial',


    start_date TIMESTAMPTZ DEFAULT NOW(),


    end_date TIMESTAMPTZ,


    auto_renew BOOLEAN DEFAULT FALSE,


    metadata JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_subscription_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    license_id UUID NOT NULL
        REFERENCES admin_organization_licenses(id)
        ON DELETE CASCADE,


    previous_status subscription_status,


    new_status subscription_status NOT NULL,


    reason TEXT,


    changed_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_plan_entitlements (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    license_plan_id UUID NOT NULL
        REFERENCES admin_license_plans(id)
        ON DELETE CASCADE,


    entitlement_key TEXT NOT NULL,


    entitlement_value JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        license_plan_id,
        entitlement_key
    )

);

CREATE TABLE IF NOT EXISTS admin_system_jobs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    job_name TEXT NOT NULL,


    job_key TEXT NOT NULL,


    description TEXT,


    schedule_expression TEXT,


    status job_status DEFAULT 'pending',


    enabled BOOLEAN DEFAULT TRUE,


    configuration JSONB DEFAULT '{}'::jsonb,


    last_run_at TIMESTAMPTZ,


    next_run_at TIMESTAMPTZ,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        job_key
    )

);

CREATE TABLE IF NOT EXISTS admin_job_executions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    job_id UUID NOT NULL
        REFERENCES admin_system_jobs(id)
        ON DELETE CASCADE,


    status job_status DEFAULT 'running',


    started_at TIMESTAMPTZ DEFAULT NOW(),


    completed_at TIMESTAMPTZ,


    execution_time_ms INTEGER,


    result JSONB DEFAULT '{}'::jsonb,


    error_message TEXT,


    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_platform_health_metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    metric_name TEXT NOT NULL,


    metric_category TEXT NOT NULL,


    metric_value JSONB DEFAULT '{}'::jsonb,


    severity TEXT DEFAULT 'normal',


    recorded_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_error_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    user_id UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,


    error_code TEXT,


    error_message TEXT NOT NULL,


    stack_trace TEXT,


    module_name TEXT,


    endpoint TEXT,


    metadata JSONB DEFAULT '{}'::jsonb,


    resolved BOOLEAN DEFAULT FALSE,


    resolved_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_configuration_registry (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    configuration_key TEXT NOT NULL UNIQUE,


    configuration_value JSONB DEFAULT '{}'::jsonb,


    scope configuration_scope DEFAULT 'platform',


    description TEXT,


    is_encrypted BOOLEAN DEFAULT FALSE,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE IF NOT EXISTS admin_dashboard_metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    metric_key TEXT NOT NULL,


    metric_value JSONB DEFAULT '{}'::jsonb,


    generated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        metric_key
    )

);


-- ============================================================
-- SOURCE: 006_lookup.sql
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

CREATE TABLE IF NOT EXISTS lookup_timezones (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    timezone_name TEXT NOT NULL UNIQUE,

    utc_offset TEXT,

    country_code CHAR(2),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

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
-- MIGRATION COMPLETE
-- ============================================================

COMMIT;
