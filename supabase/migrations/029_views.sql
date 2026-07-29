BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE VIEW FOUNDATION
-- Migration : 029
-- ============================================================================
-- Purpose
-- Production read optimization layer.
--
-- Supports:
-- CRM intelligence
-- Customer 360
-- Sales analytics
-- Revenue intelligence
-- Pipeline visibility
-- Executive reporting
--
-- Principles:
-- Read optimized
-- No data duplication
-- Reusable across CRM/Admin/Dashboard
-- Tenant aware
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS analytics;



-- ============================================================================
-- CUSTOMER 360 VIEW
-- ============================================================================
-- Unified customer intelligence layer.
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_customer_360 AS


SELECT

    c.id AS customer_id,

    c.organization_id,

    c.name AS customer_name,

    c.status AS customer_status,

    COUNT(DISTINCT p.id)

    AS project_count,

    COUNT(DISTINCT t.id)

    AS task_count,

    MAX(a.created_at)

    AS last_activity_date


FROM public.clients c


LEFT JOIN public.projects p

ON p.client_id = c.id


LEFT JOIN public.tasks t

ON t.client_id = c.id


LEFT JOIN public.activities a

ON a.entity_id = c.id

AND a.entity_type = 'clients'


GROUP BY

c.id,

c.organization_id,

c.name,

c.status;



-- ============================================================================
-- LEAD INTELLIGENCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_lead_intelligence AS


SELECT


    l.organization_id,

    l.id AS lead_id,

    l.name AS lead_name,

    l.status,

    l.source,

    l.owner_id,

    l.created_at,


    CASE

        WHEN l.status IN

        (

            'CONVERTED',

            'WON'

        )

        THEN TRUE

        ELSE FALSE

    END AS converted,


    COUNT(a.id)

    AS activity_count


FROM public.leads l


LEFT JOIN public.activities a

ON a.entity_id = l.id

AND a.entity_type = 'leads'


GROUP BY

l.organization_id,

l.id,

l.name,

l.status,

l.source,

l.owner_id,

l.created_at;



-- ============================================================================
-- SALES PIPELINE VIEW
-- ============================================================================
-- Opportunity funnel intelligence.
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_sales_pipeline AS


SELECT


    o.organization_id,

    o.id AS opportunity_id,

    o.name AS opportunity_name,

    o.stage,

    o.amount,

    o.owner_id,

    o.created_at,


    CASE

        WHEN o.stage IN

        (

            'WON',

            'CLOSED_WON'

        )

        THEN 'WON'


        WHEN o.stage IN

        (

            'LOST',

            'CLOSED_LOST'

        )

        THEN 'LOST'


        ELSE 'OPEN'


    END AS pipeline_status



FROM public.opportunities o;



-- ============================================================================
-- REVENUE INTELLIGENCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_revenue_intelligence AS


SELECT


    organization_id,


    DATE_TRUNC(

        'month',

        created_at

    )::DATE AS revenue_month,


    SUM(amount)

    AS total_pipeline_value,


    COUNT(id)

    AS opportunity_count



FROM public.opportunities



GROUP BY

organization_id,

DATE_TRUNC(

    'month',

    created_at

);



-- ============================================================================
-- QUOTATION PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_quotation_performance AS


SELECT


    q.organization_id,

    q.status,

    COUNT(q.id)

    AS quotation_count,


    SUM(q.total_amount)

    AS quotation_value,


    AVG(q.total_amount)

    AS average_quote_value



FROM public.quotations q



GROUP BY

q.organization_id,

q.status;



-- ============================================================================
-- PROJECT DELIVERY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_project_delivery AS


SELECT


    p.organization_id,

    p.id AS project_id,

    p.name AS project_name,

    p.status,

    p.start_date,

    p.end_date,


    COUNT(t.id)

    AS total_tasks,


    COUNT(t.id)

        FILTER

        (

            WHERE t.status = 'COMPLETED'

        )

    AS completed_tasks



FROM public.projects p


LEFT JOIN public.tasks t

ON t.project_id = p.id



GROUP BY


p.organization_id,

p.id,

p.name,

p.status,

p.start_date,

p.end_date;



-- ============================================================================
-- ACTIVITY ENGAGEMENT VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_entity_engagement AS


SELECT


    entity_type,

    entity_id,


    COUNT(id)

    AS total_activities,


    MAX(created_at)

    AS latest_activity



FROM public.activities



GROUP BY

entity_type,

entity_id;

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE VIEW FOUNDATION
-- Migration : 029
-- Part 2
-- ============================================================================
-- Purpose
-- Complete enterprise reporting and operational read layer.
--
-- Adds:
-- Executive intelligence views
-- Admin operational views
-- User productivity analytics
-- Notification monitoring
-- Workflow monitoring
-- Website analytics
-- Security monitoring
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- EXECUTIVE BUSINESS SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_executive_summary AS


SELECT


    o.organization_id,


    COUNT(DISTINCT l.id)

    AS total_leads,


    COUNT(DISTINCT c.id)

    AS total_customers,


    COUNT(DISTINCT opp.id)

    AS total_opportunities,


    COALESCE(

        SUM(opp.amount),

        0

    )

    AS total_pipeline_value



FROM public.organizations o


LEFT JOIN public.leads l

ON l.organization_id = o.id


LEFT JOIN public.clients c

ON c.organization_id = o.id


LEFT JOIN public.opportunities opp

ON opp.organization_id = o.id



GROUP BY

o.organization_id;



-- ============================================================================
-- USER PRODUCTIVITY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_user_productivity AS


SELECT


    a.created_by AS user_id,


    COUNT(a.id)

    AS activity_count,


    COUNT(DISTINCT a.entity_id)

    AS entities_touched,


    MAX(a.created_at)

    AS last_activity



FROM public.activities a



GROUP BY

a.created_by;



-- ============================================================================
-- TASK PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_task_performance AS


SELECT


    t.organization_id,


    t.assigned_to AS user_id,


    COUNT(t.id)

    AS total_tasks,


    COUNT(t.id)

        FILTER

        (

            WHERE t.status='COMPLETED'

        )

    AS completed_tasks,


    COUNT(t.id)

        FILTER

        (

            WHERE t.status<>'COMPLETED'

        )

    AS pending_tasks



FROM public.tasks t



GROUP BY

t.organization_id,

t.assigned_to;



-- ============================================================================
-- NOTIFICATION INTELLIGENCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_notification_health AS


SELECT


    user_id,


    COUNT(id)

    AS total_notifications,


    COUNT(id)

        FILTER

        (

            WHERE read_at IS NULL

        )

    AS unread_notifications,


    MAX(created_at)

    AS latest_notification



FROM public.notifications



GROUP BY

user_id;



-- ============================================================================
-- WORKFLOW MONITORING VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_workflow_monitoring AS


SELECT


    workflow_id,


    execution_status,


    COUNT(id)

    AS execution_count,


    MAX(started_at)

    AS latest_execution



FROM workflow.workflow_executions



GROUP BY

workflow_id,

execution_status;



-- ============================================================================
-- WEBSITE PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_website_performance AS


SELECT


    site_id,


    COUNT(id)

    AS total_pages,


    COUNT(id)

        FILTER

        (

            WHERE status='PUBLISHED'

        )

    AS published_pages



FROM website.pages



GROUP BY

site_id;



-- ============================================================================
-- SEO PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_seo_performance AS


SELECT


    site_id,


    COUNT(id)

    AS tracked_keywords,


    COUNT(id)

        FILTER

        (

            WHERE tracking_status='ACTIVE'

        )

    AS active_keywords



FROM website.seo_keywords



GROUP BY

site_id;



-- ============================================================================
-- SECURITY AUDIT VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_security_audit_summary AS


SELECT


    entity_type,


    action_type,


    COUNT(id)

    AS event_count,


    MAX(changed_at)

    AS latest_change



FROM admin.entity_audit_events



GROUP BY

entity_type,

action_type;



-- ============================================================================
-- DATA QUALITY MONITORING VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_data_quality AS


SELECT


    'LEADS_WITHOUT_OWNER'

    AS validation_check,


    COUNT(*)

    AS issue_count



FROM public.leads


WHERE owner_id IS NULL



UNION ALL



SELECT


    'CUSTOMERS_WITHOUT_STATUS',


    COUNT(*)



FROM public.clients


WHERE status IS NULL



UNION ALL



SELECT


    'TASKS_WITHOUT_ASSIGNEE',


    COUNT(*)



FROM public.tasks


WHERE assigned_to IS NULL;



-- ============================================================================
-- VIEW INVENTORY
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_system_views AS


SELECT


    schemaname,


    viewname



FROM pg_views



WHERE schemaname IN

(

    'analytics',

    'reporting',

    'dashboard',

    'validation'

);



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
    29,
    '029_views.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;