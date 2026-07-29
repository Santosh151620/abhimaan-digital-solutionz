BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- WEBSITE SEO FOUNDATION
-- Migration : 022
-- ============================================================================
-- Purpose
-- Enterprise SEO management foundation.
--
-- Supports:
-- Advanced SEO configuration
-- Sitemap management
-- Metadata automation
-- Search indexing controls
-- Structured data
-- Multi-language SEO readiness
-- SEO analytics foundation
--
-- Principles:
-- Website independent
-- Search-engine friendly
-- Content driven
-- Repository/service compatible
-- Future marketing intelligence ready
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS website;



-- ============================================================================
-- SEO PROFILES
-- ============================================================================
-- Global SEO configuration.
--
-- Supports:
-- Organization defaults
-- Website defaults
-- Brand SEO rules
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.seo_profiles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    profile_name TEXT NOT NULL,

    default_title TEXT,

    default_description TEXT,

    default_keywords JSONB DEFAULT '{}'::jsonb,

    default_image_url TEXT,

    robots_policy TEXT DEFAULT 'INDEX_FOLLOW',

    sitemap_enabled BOOLEAN DEFAULT TRUE,

    analytics_configuration JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_seo_profile

    UNIQUE(
        site_id,
        profile_name
    )

);



CREATE INDEX IF NOT EXISTS
idx_seo_profiles_site

ON website.seo_profiles(site_id);



-- ============================================================================
-- PAGE SEO CONFIGURATION
-- ============================================================================
-- Extended page-level SEO management.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.page_seo (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    seo_title TEXT,

    seo_description TEXT,

    focus_keyword TEXT,

    secondary_keywords JSONB DEFAULT '{}'::jsonb,

    open_graph_data JSONB DEFAULT '{}'::jsonb,

    twitter_card_data JSONB DEFAULT '{}'::jsonb,

    structured_data JSONB DEFAULT '{}'::jsonb,

    index_status TEXT DEFAULT 'INDEX',

    canonical_reference TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_page_seo_page

    FOREIGN KEY(page_id)

    REFERENCES website.pages(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_page_seo

    UNIQUE(page_id)

);



CREATE INDEX IF NOT EXISTS
idx_page_seo_index_status

ON website.page_seo(index_status);



-- ============================================================================
-- SITEMAP MANAGEMENT
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.sitemaps (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    sitemap_name TEXT NOT NULL,

    sitemap_type TEXT DEFAULT 'XML',

    sitemap_url TEXT,

    generation_status TEXT DEFAULT 'PENDING',

    last_generated_at TIMESTAMPTZ,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_sitemap

    UNIQUE(
        site_id,
        sitemap_name
    )

);



CREATE INDEX IF NOT EXISTS
idx_sitemap_site

ON website.sitemaps(site_id);



-- ============================================================================
-- SITEMAP ENTRIES
-- ============================================================================
-- Individual searchable URLs.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.sitemap_entries (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sitemap_id UUID NOT NULL,

    page_id UUID,

    url_path TEXT NOT NULL,

    priority NUMERIC(3,2) DEFAULT 0.50,

    change_frequency TEXT DEFAULT 'WEEKLY',

    last_modified TIMESTAMPTZ,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_sitemap_entry_sitemap

    FOREIGN KEY(sitemap_id)

    REFERENCES website.sitemaps(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_sitemap_entries_url

ON website.sitemap_entries(url_path);



-- ============================================================================
-- REDIRECT MANAGEMENT
-- ============================================================================
-- SEO-safe URL changes.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.url_redirects (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    source_path TEXT NOT NULL,

    destination_path TEXT NOT NULL,

    redirect_type INTEGER DEFAULT 301,

    active BOOLEAN DEFAULT TRUE,

    reason TEXT,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_url_redirect

    UNIQUE(
        site_id,
        source_path
    )

);



CREATE INDEX IF NOT EXISTS
idx_url_redirect_source

ON website.url_redirects(source_path);



-- ============================================================================
-- SEARCH INDEXING EVENTS
-- ============================================================================
-- Tracks indexing lifecycle.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.search_index_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    page_id UUID,

    event_type TEXT NOT NULL,

    indexing_status TEXT DEFAULT 'PENDING',

    search_engine TEXT,

    response_details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_search_index_page

ON website.search_index_events(page_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'seo_profiles',

        'page_seo',

        'sitemaps'

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
-- WEBSITE SEO FOUNDATION
-- Migration : 022
-- Part 2
-- ============================================================================
-- Purpose
-- Complete SEO intelligence and governance layer.
--
-- Adds:
-- SEO audit engine
-- Keyword tracking
-- Search performance metrics
-- Content SEO scoring
-- SEO dashboard views
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- SEO AUDITS
-- ============================================================================
-- Automated website SEO quality checks.
--
-- Examples:
-- Missing metadata
-- Broken links
-- Duplicate titles
-- Performance issues
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.seo_audits (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    audit_type TEXT DEFAULT 'FULL',

    audit_status TEXT DEFAULT 'PENDING',

    total_pages INTEGER DEFAULT 0,

    issues_found INTEGER DEFAULT 0,

    audit_summary JSONB DEFAULT '{}'::jsonb,

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_seo_audit_site

ON website.seo_audits(site_id);



CREATE INDEX IF NOT EXISTS
idx_seo_audit_status

ON website.seo_audits(audit_status);



-- ============================================================================
-- SEO AUDIT ISSUES
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.seo_audit_issues (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    audit_id UUID NOT NULL,

    page_id UUID,

    issue_type TEXT NOT NULL,

    severity TEXT DEFAULT 'MEDIUM',

    issue_description TEXT,

    recommended_action TEXT,

    resolved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_seo_audit_issue

    FOREIGN KEY(audit_id)

    REFERENCES website.seo_audits(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_seo_issue_audit

ON website.seo_audit_issues(audit_id);



CREATE INDEX IF NOT EXISTS
idx_seo_issue_status

ON website.seo_audit_issues(resolved);



-- ============================================================================
-- KEYWORD TRACKING
-- ============================================================================
-- Search visibility foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.seo_keywords (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    keyword TEXT NOT NULL,

    keyword_type TEXT DEFAULT 'PRIMARY',

    target_page_id UUID,

    current_position INTEGER,

    previous_position INTEGER,

    search_volume INTEGER,

    competition_level TEXT,

    tracking_status TEXT DEFAULT 'ACTIVE',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_seo_keyword_site

ON website.seo_keywords(site_id);



CREATE INDEX IF NOT EXISTS
idx_seo_keyword_value

ON website.seo_keywords(keyword);



-- ============================================================================
-- SEARCH PERFORMANCE METRICS
-- ============================================================================
-- Search engine analytics storage.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.search_metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    metric_date DATE NOT NULL,

    search_engine TEXT DEFAULT 'GOOGLE',

    impressions INTEGER DEFAULT 0,

    clicks INTEGER DEFAULT 0,

    average_position NUMERIC(8,2),

    click_through_rate NUMERIC(8,2),

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_search_metric

    UNIQUE(
        site_id,
        metric_date,
        search_engine
    )

);



CREATE INDEX IF NOT EXISTS
idx_search_metrics_date

ON website.search_metrics(metric_date);



-- ============================================================================
-- CONTENT SEO SCORES
-- ============================================================================
-- Measures page optimization quality.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.content_seo_scores (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL,

    seo_score INTEGER DEFAULT 0,

    readability_score INTEGER DEFAULT 0,

    keyword_score INTEGER DEFAULT 0,

    technical_score INTEGER DEFAULT 0,

    recommendation JSONB DEFAULT '{}'::jsonb,

    calculated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_content_seo_score

    UNIQUE(page_id)

);



CREATE INDEX IF NOT EXISTS
idx_content_seo_score

ON website.content_seo_scores(seo_score);



-- ============================================================================
-- SEO PERFORMANCE DASHBOARD VIEW
-- ============================================================================


CREATE OR REPLACE VIEW website.v_seo_performance AS


SELECT

    s.site_id,

    COUNT(DISTINCT sk.id)

    AS tracked_keywords,


    AVG(

        sk.current_position

    )

    AS average_keyword_position,


    COUNT(DISTINCT sa.id)

    AS total_audits,


    SUM(

        sa.issues_found

    )

    AS total_issues


FROM website.sites s


LEFT JOIN website.seo_keywords sk

ON sk.site_id = s.id


LEFT JOIN website.seo_audits sa

ON sa.site_id = s.id


GROUP BY

s.site_id;



-- ============================================================================
-- SEO HEALTH VIEW
-- ============================================================================


CREATE OR REPLACE VIEW website.v_seo_health AS


SELECT

'SEO_PROFILES' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM website.seo_profiles



UNION ALL



SELECT

'SEO_AUDITS',

COUNT(*),

'PASS'

FROM website.seo_audits



UNION ALL



SELECT

'SEO_KEYWORDS',

COUNT(*),

'PASS'

FROM website.seo_keywords;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_seo_keywords_updated

    ON website.seo_keywords;


    CREATE TRIGGER trg_seo_keywords_updated

    BEFORE UPDATE

    ON website.seo_keywords

    FOR EACH ROW

    EXECUTE FUNCTION public.set_updated_at();


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
    22,
    '022_website_seo.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

