-- ==========================================================
-- ADS WEBSITE PLATFORM
-- Migration: 002_website.sql
-- Part 1
-- ==========================================================

BEGIN;

-------------------------------------------------------------
-- WEBSITE ENUMS
-------------------------------------------------------------

DO $$ BEGIN

CREATE TYPE page_status AS ENUM
(
'draft',
'published',
'archived'
);

EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN

CREATE TYPE menu_location AS ENUM
(
'header',
'footer',
'sidebar',
'mobile'
);

EXCEPTION
WHEN duplicate_object THEN NULL;
END $$;

-------------------------------------------------------------
-- WEBSITE SETTINGS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- NAVIGATION MENUS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- NAVIGATION ITEMS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- PAGES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- PAGE SECTIONS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- PAGE BLOCKS
-------------------------------------------------------------

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
-------------------------------------------------------------
-- BLOG CATEGORIES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- BLOG TAGS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- AUTHORS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- BLOGS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- BLOG TAG MAP
-------------------------------------------------------------

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

-------------------------------------------------------------
-- SEO METADATA
-------------------------------------------------------------

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

-------------------------------------------------------------
-- REDIRECTS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- MEDIA LIBRARY
-------------------------------------------------------------

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
-------------------------------------------------------------
-- FORMS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- FORM FIELDS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- FORM SUBMISSIONS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- SERVICE CATEGORIES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- SERVICES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- PROJECT CATEGORIES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- WEBSITE PROJECTS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- TESTIMONIALS
-------------------------------------------------------------

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
-------------------------------------------------------------
-- TEAM MEMBERS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- CAREERS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- CAREER APPLICATIONS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- FAQS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- EVENTS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- ANNOUNCEMENTS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- WEBSITE SEARCH INDEX
-------------------------------------------------------------

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

-------------------------------------------------------------
-- WEBSITE CACHE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS website_cache
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

cache_key varchar(255) UNIQUE,

cache_value jsonb,

expires_at timestamptz,

created_at timestamptz DEFAULT now()

);

-------------------------------------------------------------
-- WEBSITE INDEXES
-------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_pages_slug
ON pages(organization_id,slug);

CREATE INDEX IF NOT EXISTS idx_blog_slug
ON blogs(organization_id,slug);

CREATE INDEX IF NOT EXISTS idx_services_slug
ON services(organization_id,slug);

CREATE INDEX IF NOT EXISTS idx_projects_slug
ON website_projects(organization_id,slug);

CREATE INDEX IF NOT EXISTS idx_newsletter_email
ON newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_search_entity
ON website_search_index(entity_type,entity_id);

-------------------------------------------------------------
-- VALIDATION
-------------------------------------------------------------

DO $$
BEGIN

RAISE NOTICE 'ADS Website Migration Completed';

END $$;

COMMIT;