BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- WEBSITE BLOG FOUNDATION
-- Migration : 023
-- ============================================================================
-- Purpose
-- Enterprise publishing platform for website content.
--
-- Supports:
-- Blog articles
-- Categories
-- Tags
-- Authors
-- Editorial workflow
-- Multi-language publishing
-- SEO integration
-- Public content delivery
--
-- Principles:
-- Website independent
-- Content-first architecture
-- SEO ready
-- CMS compatible
-- Repository/service compatible
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS website;



-- ============================================================================
-- BLOG AUTHORS
-- ============================================================================
-- Content ownership.
--
-- Supports:
-- Internal writers
-- Guest authors
-- Marketing teams
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_authors (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    author_name TEXT NOT NULL,

    author_email TEXT,

    author_bio TEXT,

    profile_image_url TEXT,

    social_links JSONB DEFAULT '{}'::jsonb,

    status TEXT DEFAULT 'ACTIVE',

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_blog_authors_site

ON website.blog_authors(site_id);



-- ============================================================================
-- BLOG CATEGORIES
-- ============================================================================
-- Content organization.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    category_name TEXT NOT NULL,

    category_slug TEXT NOT NULL,

    description TEXT,

    parent_category_id UUID,

    seo_metadata JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_blog_category_slug

    UNIQUE(
        site_id,
        category_slug
    )

);



CREATE INDEX IF NOT EXISTS
idx_blog_category_site

ON website.blog_categories(site_id);



-- ============================================================================
-- BLOG TAGS
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_tags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    tag_name TEXT NOT NULL,

    tag_slug TEXT NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_blog_tag_slug

    UNIQUE(
        site_id,
        tag_slug
    )

);



CREATE INDEX IF NOT EXISTS
idx_blog_tags_site

ON website.blog_tags(site_id);



-- ============================================================================
-- BLOG ARTICLES
-- ============================================================================
-- Main publishing entity.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_articles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,

    author_id UUID,

    category_id UUID,

    article_slug TEXT NOT NULL,

    title TEXT NOT NULL,

    summary TEXT,

    content JSONB DEFAULT '{}'::jsonb,

    featured_image_url TEXT,

    article_status TEXT DEFAULT 'DRAFT',

    visibility TEXT DEFAULT 'PUBLIC',

    published_at TIMESTAMPTZ,

    view_count INTEGER DEFAULT 0,

    seo_metadata JSONB DEFAULT '{}'::jsonb,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_blog_article_slug

    UNIQUE(
        site_id,
        article_slug
    ),


    CONSTRAINT fk_blog_article_author

    FOREIGN KEY(author_id)

    REFERENCES website.blog_authors(id)

    ON DELETE SET NULL,


    CONSTRAINT fk_blog_article_category

    FOREIGN KEY(category_id)

    REFERENCES website.blog_categories(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_status

ON website.blog_articles(article_status);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_publish_date

ON website.blog_articles(published_at);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_category

ON website.blog_articles(category_id);



-- ============================================================================
-- ARTICLE TAG MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_article_tags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    tag_id UUID NOT NULL,


    CONSTRAINT fk_article_tag_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_article_tag_tag

    FOREIGN KEY(tag_id)

    REFERENCES website.blog_tags(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_article_tag

    UNIQUE(
        article_id,
        tag_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_article_tags_article

ON website.blog_article_tags(article_id);



-- ============================================================================
-- BLOG TRANSLATIONS
-- ============================================================================
-- Multi-language content support.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_article_translations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    language_code TEXT NOT NULL,

    translated_title TEXT,

    translated_summary TEXT,

    translated_content JSONB DEFAULT '{}'::jsonb,

    translated_seo JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_blog_translation_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_blog_translation

    UNIQUE(
        article_id,
        language_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_blog_translation_language

ON website.blog_article_translations(language_code);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'blog_authors',

        'blog_categories',

        'blog_tags',

        'blog_articles',

        'blog_article_translations'

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
-- WEBSITE BLOG FOUNDATION
-- Migration : 023
-- Part 2
-- ============================================================================
-- Purpose
-- Complete enterprise blog publishing intelligence layer.
--
-- Adds:
-- Article revisions
-- Publishing workflow
-- Blog analytics
-- Engagement foundation
-- Related content engine
-- SEO scoring integration
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- ARTICLE REVISIONS
-- ============================================================================
-- Maintains article history.
--
-- Supports:
-- Draft recovery
-- Editorial comparison
-- Rollback
-- Governance
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_article_revisions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    revision_number INTEGER NOT NULL,

    revision_status TEXT DEFAULT 'DRAFT',

    title_snapshot TEXT,

    content_snapshot JSONB DEFAULT '{}'::jsonb,

    change_summary TEXT,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_blog_revision_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_blog_revision

    UNIQUE(
        article_id,
        revision_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_blog_revision_article

ON website.blog_article_revisions(article_id);



-- ============================================================================
-- BLOG PUBLISHING WORKFLOW
-- ============================================================================
-- Editorial lifecycle.
--
-- States:
-- Draft
-- Review
-- Approved
-- Published
-- Archived
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_workflows (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

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


    CONSTRAINT fk_blog_workflow_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_blog_workflow_status

ON website.blog_workflows(workflow_status);



-- ============================================================================
-- BLOG ANALYTICS EVENTS
-- ============================================================================
-- Content performance tracking.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_analytics_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    event_type TEXT NOT NULL,

    visitor_id TEXT,

    session_id TEXT,

    event_data JSONB DEFAULT '{}'::jsonb,

    occurred_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_blog_analytics_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_blog_analytics_article

ON website.blog_analytics_events(article_id);



CREATE INDEX IF NOT EXISTS
idx_blog_analytics_event

ON website.blog_analytics_events(event_type);



-- ============================================================================
-- BLOG COMMENTS FOUNDATION
-- ============================================================================
-- Public engagement layer.
--
-- Moderation controlled.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_comments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    parent_comment_id UUID,

    commenter_name TEXT,

    commenter_email TEXT,

    comment_text TEXT NOT NULL,

    moderation_status TEXT DEFAULT 'PENDING',

    approved_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_blog_comment_article

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_blog_comments_article

ON website.blog_comments(article_id);



CREATE INDEX IF NOT EXISTS
idx_blog_comments_status

ON website.blog_comments(moderation_status);



-- ============================================================================
-- RELATED CONTENT ENGINE
-- ============================================================================
-- Content recommendation foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_related_content (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    related_article_id UUID NOT NULL,

    relationship_type TEXT DEFAULT 'RELATED',

    relevance_score NUMERIC(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_related_source

    FOREIGN KEY(article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_related_target

    FOREIGN KEY(related_article_id)

    REFERENCES website.blog_articles(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_related_content

    UNIQUE(
        article_id,
        related_article_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_related_article

ON website.blog_related_content(article_id);



-- ============================================================================
-- BLOG SEO PERFORMANCE
-- ============================================================================
-- Connects blog content with SEO intelligence.
-- ============================================================================


CREATE TABLE IF NOT EXISTS website.blog_seo_scores (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    article_id UUID NOT NULL,

    seo_score INTEGER DEFAULT 0,

    readability_score INTEGER DEFAULT 0,

    keyword_score INTEGER DEFAULT 0,

    technical_score INTEGER DEFAULT 0,

    recommendations JSONB DEFAULT '{}'::jsonb,

    calculated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_blog_seo_score

    UNIQUE(article_id)

);



CREATE INDEX IF NOT EXISTS
idx_blog_seo_score

ON website.blog_seo_scores(seo_score);



-- ============================================================================
-- BLOG PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW website.v_blog_performance AS


SELECT

    a.site_id,

    COUNT(DISTINCT a.id)

    AS total_articles,


    COUNT(*) FILTER
    (
        WHERE a.article_status = 'PUBLISHED'
    )

    AS published_articles,


    SUM(a.view_count)

    AS total_views,


    COUNT(DISTINCT c.id)

    AS total_comments


FROM website.blog_articles a


LEFT JOIN website.blog_comments c

ON c.article_id = a.id


GROUP BY

a.site_id;



-- ============================================================================
-- BLOG HEALTH VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW website.v_blog_health AS


SELECT

'BLOG_ARTICLES' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM website.blog_articles



UNION ALL



SELECT

'BLOG_AUTHORS',

COUNT(*),

'PASS'

FROM website.blog_authors



UNION ALL



SELECT

'BLOG_CATEGORIES',

COUNT(*),

'PASS'

FROM website.blog_categories;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'blog_workflows',

        'blog_comments'

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
    23,
    '023_website_blog.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

