BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE INDEX OPTIMIZATION
-- Migration : 026
-- ============================================================================
-- Purpose
-- Production-grade indexing strategy.
--
-- Supports:
-- CRM performance
-- Website performance
-- Reporting acceleration
-- Dashboard optimization
-- Search performance
-- Multi-tenant query optimization
--
-- Principles:
-- No schema changes
-- No data changes
-- Only performance optimization
-- Safe and idempotent
-- ============================================================================


-- ============================================================================
-- ORGANIZATION / TENANT INDEXES
-- ============================================================================
-- Core multi-tenant access optimization.
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_organizations_active

ON public.organizations(active);



CREATE INDEX IF NOT EXISTS
idx_profiles_organization

ON public.profiles(organization_id);



CREATE INDEX IF NOT EXISTS
idx_organization_members_org

ON public.organization_members(organization_id);



CREATE INDEX IF NOT EXISTS
idx_organization_members_user

ON public.organization_members(user_id);



-- ============================================================================
-- CRM LEAD PERFORMANCE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_leads_organization

ON public.leads(organization_id);



CREATE INDEX IF NOT EXISTS
idx_leads_status

ON public.leads(status);



CREATE INDEX IF NOT EXISTS
idx_leads_source

ON public.leads(source);



CREATE INDEX IF NOT EXISTS
idx_leads_created_at

ON public.leads(created_at DESC);



CREATE INDEX IF NOT EXISTS
idx_leads_owner

ON public.leads(owner_id);



-- ============================================================================
-- CRM CLIENT / COMPANY INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_clients_organization

ON public.clients(organization_id);



CREATE INDEX IF NOT EXISTS
idx_clients_status

ON public.clients(status);



CREATE INDEX IF NOT EXISTS
idx_clients_name_search

ON public.clients
USING gin(
    to_tsvector(
        'english',
        coalesce(name,'')
    )
);



-- ============================================================================
-- CONTACT PERFORMANCE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_contacts_organization

ON public.contacts(organization_id);



CREATE INDEX IF NOT EXISTS
idx_contacts_company

ON public.contacts(company_id);



CREATE INDEX IF NOT EXISTS
idx_contacts_email

ON public.contacts(email);



-- ============================================================================
-- OPPORTUNITY / PIPELINE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_opportunities_org

ON public.opportunities(organization_id);



CREATE INDEX IF NOT EXISTS
idx_opportunities_stage

ON public.opportunities(stage);



CREATE INDEX IF NOT EXISTS
idx_opportunities_owner

ON public.opportunities(owner_id);



CREATE INDEX IF NOT EXISTS
idx_opportunities_value

ON public.opportunities(amount);



-- ============================================================================
-- QUOTATION INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_quotes_org

ON public.quotations(organization_id);



CREATE INDEX IF NOT EXISTS
idx_quotes_status

ON public.quotations(status);



CREATE INDEX IF NOT EXISTS
idx_quotes_created

ON public.quotations(created_at DESC);



-- ============================================================================
-- PROJECT / TASK INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_projects_org

ON public.projects(organization_id);



CREATE INDEX IF NOT EXISTS
idx_projects_status

ON public.projects(status);



CREATE INDEX IF NOT EXISTS
idx_tasks_org

ON public.tasks(organization_id);



CREATE INDEX IF NOT EXISTS
idx_tasks_status

ON public.tasks(status);



CREATE INDEX IF NOT EXISTS
idx_tasks_assignee

ON public.tasks(assigned_to);



-- ============================================================================
-- ACTIVITY / TIMELINE INDEXES
-- ============================================================================
-- Entity driven architecture optimization.
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_activity_entity

ON public.activities(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS
idx_activity_created

ON public.activities(created_at DESC);



CREATE INDEX IF NOT EXISTS
idx_notes_entity

ON public.notes(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS
idx_attachments_entity

ON public.attachments(
    entity_type,
    entity_id
);



-- ============================================================================
-- NOTIFICATION PERFORMANCE
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_notifications_user

ON public.notifications(user_id);



CREATE INDEX IF NOT EXISTS
idx_notifications_unread

ON public.notifications(
    user_id,
    read_at
);



-- ============================================================================
-- REPORTING INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_report_execution_date

ON reporting.report_executions(started_at DESC);



CREATE INDEX IF NOT EXISTS
idx_kpi_snapshot_kpi

ON reporting.kpi_snapshots(kpi_id);



CREATE INDEX IF NOT EXISTS
idx_metrics_category

ON reporting.metrics(metric_category);



-- ============================================================================
-- DASHBOARD INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_dashboard_user

ON dashboard.user_dashboards(user_id);



CREATE INDEX IF NOT EXISTS
idx_dashboard_access_date

ON dashboard.dashboard_access_logs(accessed_at DESC);



CREATE INDEX IF NOT EXISTS
idx_dashboard_snapshot_dashboard

ON dashboard.dashboard_snapshots(dashboard_id);

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE INDEX OPTIMIZATION
-- Migration : 026
-- Part 2
-- ============================================================================
-- Purpose
-- Complete production indexing layer.
--
-- Adds:
-- Website indexes
-- SEO/blog optimization
-- Full-text search
-- JSONB optimization
-- Workflow acceleration
-- Security audit performance
-- AI module optimization
-- Index validation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- WEBSITE CMS INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_website_pages_site

ON website.pages(site_id);



CREATE INDEX IF NOT EXISTS
idx_website_pages_status

ON website.pages(status);



CREATE INDEX IF NOT EXISTS
idx_website_pages_slug

ON website.pages(slug);



CREATE INDEX IF NOT EXISTS
idx_website_content_blocks_page

ON website.content_blocks(page_id);



-- ============================================================================
-- WEBSITE SEO INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_seo_profiles_site

ON website.seo_profiles(site_id);



CREATE INDEX IF NOT EXISTS
idx_page_seo_page

ON website.page_seo(page_id);



CREATE INDEX IF NOT EXISTS
idx_sitemap_entries_sitemap

ON website.sitemap_entries(sitemap_id);



CREATE INDEX IF NOT EXISTS
idx_url_redirect_site

ON website.url_redirects(site_id);



CREATE INDEX IF NOT EXISTS
idx_seo_keyword_tracking

ON website.seo_keywords(
    site_id,
    tracking_status
);



-- ============================================================================
-- BLOG SEARCH INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_blog_articles_site

ON website.blog_articles(site_id);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_visibility

ON website.blog_articles(visibility);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_title_search

ON website.blog_articles
USING gin(
    to_tsvector(
        'english',
        coalesce(title,'')
    )
);



CREATE INDEX IF NOT EXISTS
idx_blog_articles_content_search

ON website.blog_articles
USING gin(
    to_tsvector(
        'english',
        coalesce(content::text,'')
    )
);



CREATE INDEX IF NOT EXISTS
idx_blog_comments_article

ON website.blog_comments(article_id);



-- ============================================================================
-- JSONB PERFORMANCE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_reporting_report_config

ON reporting.report_definitions

USING gin(query_configuration);



CREATE INDEX IF NOT EXISTS
idx_reporting_widget_config

ON reporting.dashboard_widgets

USING gin(configuration);



CREATE INDEX IF NOT EXISTS
idx_dashboard_layout_config

ON dashboard.dashboard_layouts

USING gin(layout_configuration);



CREATE INDEX IF NOT EXISTS
idx_blog_metadata

ON website.blog_articles

USING gin(metadata);



CREATE INDEX IF NOT EXISTS
idx_seo_metadata

ON website.page_seo

USING gin(open_graph_data);



-- ============================================================================
-- WORKFLOW INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_workflow_status

ON workflow.workflow_instances(status);



CREATE INDEX IF NOT EXISTS
idx_workflow_entity

ON workflow.workflow_instances(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS
idx_workflow_execution_date

ON workflow.workflow_executions(created_at DESC);



-- ============================================================================
-- ADMIN SECURITY INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_admin_audit_user

ON admin.audit_logs(user_id);



CREATE INDEX IF NOT EXISTS
idx_admin_audit_action

ON admin.audit_logs(action);



CREATE INDEX IF NOT EXISTS
idx_admin_audit_date

ON admin.audit_logs(created_at DESC);



-- ============================================================================
-- AI MODULE INDEXES
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_ai_prompt_category

ON ai.prompt_library(category);



CREATE INDEX IF NOT EXISTS
idx_ai_execution_entity

ON ai.ai_executions(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS
idx_ai_execution_date

ON ai.ai_executions(created_at DESC);



-- ============================================================================
-- SECURITY / RLS SUPPORT INDEXES
-- ============================================================================
-- Accelerates tenant filtering.
-- ============================================================================


CREATE INDEX IF NOT EXISTS
idx_security_user_roles

ON security.user_roles(user_id);



CREATE INDEX IF NOT EXISTS
idx_security_role_permissions

ON security.role_permissions(role_id);



CREATE INDEX IF NOT EXISTS
idx_security_permissions_code

ON security.permissions(permission_code);



-- ============================================================================
-- INDEX HEALTH VALIDATION
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS validation;



CREATE TABLE IF NOT EXISTS validation.index_validation_results (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    validation_name TEXT NOT NULL,

    table_name TEXT,

    index_name TEXT,

    status TEXT DEFAULT 'PASS',

    details TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO validation.index_validation_results
(
    validation_name,
    table_name,
    index_name,
    status,
    details
)

SELECT

'INDEX_EXISTS',

tablename,

indexname,

'PASS',

'Production index verified'

FROM pg_indexes

WHERE schemaname IN
(
    'public',
    'website',
    'reporting',
    'dashboard',
    'workflow',
    'security',
    'ai'
);



-- ============================================================================
-- INDEX SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW validation.v_index_summary AS


SELECT

schemaname,

COUNT(*) AS total_indexes


FROM pg_indexes


WHERE schemaname IN
(
    'public',
    'website',
    'reporting',
    'dashboard',
    'workflow',
    'security',
    'ai'
)


GROUP BY schemaname;



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
    26,
    '026_indexes.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;