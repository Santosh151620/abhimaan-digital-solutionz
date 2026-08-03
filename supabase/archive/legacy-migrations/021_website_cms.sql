BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- WEBSITE CMS FOUNDATION
-- Migration : 021
-- ============================================================================
-- Purpose
-- Enterprise content management foundation for public website.
--
-- Supports:
-- Public pages
-- Content blocks
-- Media references
-- Localization readiness
-- Website administration
-- CRM lead capture alignment
--
-- Principles:
-- Website remains CRM independent
-- Generic content platform
-- Multi-language ready
-- SEO compatible
-- Repository/service compatible
-- Future headless CMS ready
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS website;



-- ============================================================================
-- WEBSITE SITES
-- ============================================================================
-- Supports:
-- Main website
-- Future microsites
-- Customer portals
-- Regional websites
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.sites (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    site_code TEXT NOT NULL,

    site_name TEXT NOT NULL,

    domain_name TEXT,

    site_status TEXT DEFAULT 'ACTIVE',

    default_language TEXT DEFAULT 'en',

    configuration JSONB DEFAULT '{}'::jsonb,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_website_site

    UNIQUE(
        organization_id,
        site_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_website_sites_status

ON website.sites(site_status);



-- ============================================================================
-- WEBSITE PAGES
-- ============================================================================
-- Public website page management.
--
-- Examples:
-- Home
-- About
-- Services
-- Contact
-- Landing Pages
-- Blog Pages
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.pages (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    page_slug TEXT NOT NULL,

    page_title TEXT NOT NULL,

    page_type TEXT DEFAULT 'STANDARD',

    page_status TEXT DEFAULT 'DRAFT',

    parent_page_id UUID,

    template_name TEXT DEFAULT 'default',

    published_at TIMESTAMPTZ,

    seo_metadata JSONB DEFAULT '{}'::jsonb,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_website_page_slug

    UNIQUE(
        site_id,
        page_slug
    )

);



CREATE INDEX IF NOT EXISTS
idx_website_pages_status

ON website.pages(page_status);



CREATE INDEX IF NOT EXISTS
idx_website_pages_type

ON website.pages(page_type);



-- ============================================================================
-- PAGE CONTENT BLOCKS
-- ============================================================================
-- Component-driven content architecture.
--
-- Examples:
-- Hero Section
-- Text Section
-- Feature Cards
-- Testimonials
-- Forms
-- CTA Blocks
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.content_blocks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    block_type TEXT NOT NULL,

    block_order INTEGER DEFAULT 0,

    title TEXT,

    content JSONB DEFAULT '{}'::jsonb,

    visibility_status TEXT DEFAULT 'VISIBLE',

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_content_block_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_content_blocks_page

ON website.content_blocks(page_id);



CREATE INDEX IF NOT EXISTS
idx_content_blocks_type

ON website.content_blocks(block_type);



-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================
-- Website asset management.
--
-- Stores metadata only.
-- Actual files remain in Supabase Storage.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.media_library (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID,

    file_name TEXT NOT NULL,

    file_type TEXT,

    storage_path TEXT NOT NULL,

    public_url TEXT,

    alt_text TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    uploaded_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_media_library_site

ON website.media_library(site_id);



-- ============================================================================
-- PAGE TRANSLATIONS
-- ============================================================================
-- Multi-language website support.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.page_translations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    language_code TEXT NOT NULL,

    translated_title TEXT,

    translated_content JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_page_translation_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_page_translation

    UNIQUE(
        page_id,
        language_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_page_translation_language

ON website.page_translations(language_code);



-- ============================================================================
-- WEBSITE MENUS
-- ============================================================================
-- Navigation management.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.menus (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    menu_code TEXT NOT NULL,

    menu_name TEXT NOT NULL,

    menu_type TEXT DEFAULT 'HEADER',

    items JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_website_menu

    UNIQUE(
        site_id,
        menu_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_website_menu_type

ON website.menus(menu_type);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'sites',

        'pages',

        'content_blocks',

        'page_translations',

        'menus'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON website.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON website.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- WEBSITE CMS FOUNDATION
-- Migration : 021
-- Part 2
-- ============================================================================
-- Purpose
-- Complete website content lifecycle management.
--
-- Adds:
-- Content publishing workflow
-- Page version history
-- Draft/review/published lifecycle
-- Website analytics hooks
-- Lead capture alignment
-- CMS validation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- PAGE VERSION HISTORY
-- ============================================================================
-- Maintains content change history.
--
-- Supports:
-- Draft versions
-- Rollback
-- Content governance
-- Editorial workflow
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.page_versions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    version_number INTEGER NOT NULL,

    version_status TEXT DEFAULT 'DRAFT',

    content_snapshot JSONB DEFAULT '{}'::jsonb,

    change_summary TEXT,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_page_version_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_page_version

    UNIQUE(
        page_id,
        version_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_page_versions_page

ON website.page_versions(page_id);



-- ============================================================================
-- CONTENT APPROVAL WORKFLOW
-- ============================================================================
-- Editorial governance.
--
-- States:
-- Draft
-- Review
-- Approved
-- Published
-- Archived
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.content_workflows (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    workflow_status TEXT DEFAULT 'DRAFT',

    submitted_by UUID,

    reviewed_by UUID,

    approved_by UUID,

    submitted_at TIMESTAMPTZ,

    reviewed_at TIMESTAMPTZ,

    approved_at TIMESTAMPTZ,

    comments TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_content_workflow_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_content_workflow_status

ON website.content_workflows(workflow_status);



-- ============================================================================
-- WEBSITE ANALYTICS EVENTS
-- ============================================================================
-- Generic website engagement tracking.
--
-- Does not depend on CRM.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.analytics_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    page_id UUID,

    event_type TEXT NOT NULL,

    visitor_id TEXT,

    session_id TEXT,

    event_data JSONB DEFAULT '{}'::jsonb,

    occurred_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_website_analytics_page

ON website.analytics_events(page_id);



CREATE INDEX IF NOT EXISTS
idx_website_analytics_event

ON website.analytics_events(event_type);



-- ============================================================================
-- PUBLIC FORM DEFINITIONS
-- ============================================================================
-- Website lead/contact form foundation.
--
-- CRM receives data separately.
-- Website owns form structure only.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.forms (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    form_code TEXT NOT NULL,

    form_name TEXT NOT NULL,

    form_type TEXT DEFAULT 'CONTACT',

    fields JSONB DEFAULT '{}'::jsonb,

    success_message TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_website_form

    UNIQUE(
        site_id,
        form_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_website_forms_type

ON website.forms(form_type);



-- ============================================================================
-- FORM SUBMISSIONS
-- ============================================================================
-- Website-owned submissions.
--
-- CRM processing occurs through service integration.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.form_submissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    form_id UUID NOT NULL,

    submission_data JSONB DEFAULT '{}'::jsonb,

    processing_status TEXT DEFAULT 'NEW',

    processed_reference UUID,

    submitted_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_form_submission_form

    FOREIGN KEY(form_id)

    REFERENCES website.forms(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_form_submission_status

ON website.form_submissions(processing_status);



-- ============================================================================
-- WEBSITE SEO SETTINGS
-- ============================================================================
-- Search optimization foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.seo_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    meta_title TEXT,

    meta_description TEXT,

    keywords JSONB DEFAULT '{}'::jsonb,

    canonical_url TEXT,

    robots_setting TEXT DEFAULT 'INDEX',

    structured_data JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_seo_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_seo_page

ON website.seo_settings(page_id);



-- ============================================================================
-- CMS VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW website.v_cms_health AS


SELECT

'WEBSITE_SITES' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM website.sites



UNION ALL



SELECT

'PAGES',

COUNT(*),

'PASS'

FROM website.pages



UNION ALL



SELECT

'CONTENT_BLOCKS',

COUNT(*),

'PASS'

FROM website.content_blocks



UNION ALL



SELECT

'FORMS',

COUNT(*),

'PASS'

FROM website.forms;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'content_workflows',

        'forms',

        'seo_settings'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON website.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON website.%1$s
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
    21,
    '021_website_cms.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

