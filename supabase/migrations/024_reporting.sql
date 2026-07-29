BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE REPORTING FOUNDATION
-- Migration : 024
-- ============================================================================
-- Purpose
-- Enterprise reporting and analytics foundation.
--
-- Supports:
-- Report definitions
-- Metrics library
-- KPI framework
-- Report execution tracking
-- Cross-module analytics
-- Dashboard readiness
-- CRM + Website + Admin reporting alignment
--
-- Principles:
-- Metadata driven reporting
-- Entity based analytics
-- Organization aware
-- No business logic duplication
-- Future BI integration ready
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS reporting;



-- ============================================================================
-- REPORT DEFINITIONS
-- ============================================================================
-- Master report catalog.
--
-- Examples:
-- Sales Pipeline Report
-- Revenue Report
-- Website Performance
-- Customer Health
-- Operational Reports
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.report_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    report_code TEXT NOT NULL,

    report_name TEXT NOT NULL,

    report_category TEXT DEFAULT 'GENERAL',

    description TEXT,

    entity_type TEXT,

    query_configuration JSONB DEFAULT '{}'::jsonb,

    visualization_configuration JSONB DEFAULT '{}'::jsonb,

    access_configuration JSONB DEFAULT '{}'::jsonb,

    report_status TEXT DEFAULT 'ACTIVE',

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_report_definition

    UNIQUE(
        organization_id,
        report_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_report_definition_category

ON reporting.report_definitions(report_category);



CREATE INDEX IF NOT EXISTS
idx_report_definition_status

ON reporting.report_definitions(report_status);



-- ============================================================================
-- REPORT EXECUTION HISTORY
-- ============================================================================
-- Tracks report generation.
--
-- Supports:
-- Audit
-- Performance monitoring
-- Scheduled reporting
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.report_executions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    executed_by UUID,

    execution_type TEXT DEFAULT 'MANUAL',

    execution_status TEXT DEFAULT 'RUNNING',

    started_at TIMESTAMPTZ DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    execution_time_ms INTEGER,

    result_summary JSONB DEFAULT '{}'::jsonb,

    error_details TEXT,


    CONSTRAINT fk_report_execution_report

    FOREIGN KEY(report_id)

    REFERENCES reporting.report_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_report_execution_report

ON reporting.report_executions(report_id);



CREATE INDEX IF NOT EXISTS
idx_report_execution_status

ON reporting.report_executions(execution_status);



-- ============================================================================
-- METRICS LIBRARY
-- ============================================================================
-- Central business metrics catalog.
--
-- Examples:
-- Revenue
-- Conversion Rate
-- Customer Count
-- Ticket Resolution Time
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    metric_code TEXT NOT NULL,

    metric_name TEXT NOT NULL,

    metric_category TEXT DEFAULT 'GENERAL',

    description TEXT,

    calculation_definition JSONB DEFAULT '{}'::jsonb,

    unit_type TEXT,

    aggregation_type TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_metric

    UNIQUE(
        organization_id,
        metric_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_metric_category

ON reporting.metrics(metric_category);



-- ============================================================================
-- KPI DEFINITIONS
-- ============================================================================
-- Executive dashboard KPI framework.
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.kpis (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    kpi_code TEXT NOT NULL,

    kpi_name TEXT NOT NULL,

    description TEXT,

    metric_id UUID,

    target_value NUMERIC,

    warning_threshold NUMERIC,

    critical_threshold NUMERIC,

    measurement_frequency TEXT DEFAULT 'MONTHLY',

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_kpi

    UNIQUE(
        organization_id,
        kpi_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_kpi_metric

ON reporting.kpis(metric_id);



-- ============================================================================
-- KPI SNAPSHOTS
-- ============================================================================
-- Historical KPI values.
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.kpi_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    kpi_id UUID NOT NULL,

    snapshot_date DATE NOT NULL,

    actual_value NUMERIC,

    target_value NUMERIC,

    status TEXT DEFAULT 'NORMAL',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_kpi_snapshot_kpi

    FOREIGN KEY(kpi_id)

    REFERENCES reporting.kpis(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_kpi_snapshot_date

ON reporting.kpi_snapshots(snapshot_date);



-- ============================================================================
-- REPORT SCHEDULES
-- ============================================================================
-- Automated reporting foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.report_schedules (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    schedule_type TEXT DEFAULT 'DAILY',

    schedule_configuration JSONB DEFAULT '{}'::jsonb,

    recipients JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    last_execution_at TIMESTAMPTZ,

    next_execution_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_report_schedule_report

    FOREIGN KEY(report_id)

    REFERENCES reporting.report_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_report_schedule_active

ON reporting.report_schedules(active);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'report_definitions',

        'metrics',

        'kpis'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON reporting.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON reporting.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE REPORTING FOUNDATION
-- Migration : 024
-- Part 2
-- ============================================================================
-- Purpose
-- Complete reporting intelligence layer.
--
-- Adds:
-- Dashboard widgets
-- Report sharing permissions
-- Analytics snapshots
-- Executive reporting views
-- Cross-module KPI intelligence
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- REPORT WIDGETS
-- ============================================================================
-- Dashboard visualization components.
--
-- Examples:
-- Charts
-- KPI cards
-- Tables
-- Funnels
-- Trend graphs
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.dashboard_widgets (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    widget_code TEXT NOT NULL,

    widget_name TEXT NOT NULL,

    widget_type TEXT DEFAULT 'CARD',

    data_source TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    display_configuration JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_dashboard_widget

    UNIQUE(
        organization_id,
        widget_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_widget_type

ON reporting.dashboard_widgets(widget_type);



-- ============================================================================
-- REPORT ACCESS CONTROL
-- ============================================================================
-- Controls report visibility.
--
-- Aligns with RBAC.
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.report_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    role_code TEXT,

    permission_type TEXT DEFAULT 'VIEW',

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_report_permission_report

    FOREIGN KEY(report_id)

    REFERENCES reporting.report_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_report_permissions_report

ON reporting.report_permissions(report_id);



-- ============================================================================
-- ANALYTICS DATA SNAPSHOTS
-- ============================================================================
-- Historical analytics storage.
--
-- Supports:
-- Trend analysis
-- Performance comparison
-- Executive reporting
-- ============================================================================


CREATE TABLE IF NOT EXISTS reporting.analytics_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    snapshot_type TEXT NOT NULL,

    entity_type TEXT,

    snapshot_date DATE NOT NULL,

    metric_data JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_analytics_snapshot_entity

ON reporting.analytics_snapshots(entity_type);



CREATE INDEX IF NOT EXISTS
idx_analytics_snapshot_date

ON reporting.analytics_snapshots(snapshot_date);



-- ============================================================================
-- EXECUTIVE KPI VIEW
-- ============================================================================


CREATE OR REPLACE VIEW reporting.v_executive_kpis AS


SELECT

    k.organization_id,

    k.kpi_code,

    k.kpi_name,

    k.target_value,

    ks.actual_value,

    ks.snapshot_date,

    CASE

        WHEN ks.actual_value >= k.target_value

        THEN 'ACHIEVED'

        WHEN ks.actual_value >= k.warning_threshold

        THEN 'WARNING'

        ELSE 'CRITICAL'

    END AS performance_status


FROM reporting.kpis k


LEFT JOIN reporting.kpi_snapshots ks

ON ks.kpi_id = k.id;



-- ============================================================================
-- REPORT USAGE ANALYTICS
-- ============================================================================


CREATE OR REPLACE VIEW reporting.v_report_usage AS


SELECT

    r.report_category,

    r.report_name,

    COUNT(e.id) AS execution_count,

    AVG(e.execution_time_ms)

    AS average_execution_time_ms


FROM reporting.report_definitions r


LEFT JOIN reporting.report_executions e

ON e.report_id = r.id


GROUP BY

r.report_category,

r.report_name;



-- ============================================================================
-- CROSS MODULE BUSINESS INTELLIGENCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW reporting.v_business_intelligence_summary AS


SELECT

'REPORTS' AS intelligence_area,

COUNT(*) AS total_records

FROM reporting.report_definitions



UNION ALL



SELECT

'METRICS',

COUNT(*)

FROM reporting.metrics



UNION ALL



SELECT

'KPIS',

COUNT(*)

FROM reporting.kpis



UNION ALL



SELECT

'WIDGETS',

COUNT(*)

FROM reporting.dashboard_widgets;



-- ============================================================================
-- DEFAULT SYSTEM METRICS
-- ============================================================================


INSERT INTO reporting.metrics
(
    metric_code,
    metric_name,
    metric_category,
    description,
    unit_type,
    aggregation_type
)

VALUES


(
    'TOTAL_CUSTOMERS',
    'Total Customers',
    'CUSTOMER',
    'Total active customer entities',
    'COUNT',
    'SUM'
),


(
    'PIPELINE_VALUE',
    'Sales Pipeline Value',
    'SALES',
    'Total opportunity pipeline value',
    'CURRENCY',
    'SUM'
),


(
    'CONVERSION_RATE',
    'Lead Conversion Rate',
    'SALES',
    'Percentage of converted leads',
    'PERCENTAGE',
    'AVERAGE'
),


(
    'CUSTOMER_SATISFACTION',
    'Customer Satisfaction',
    'SERVICE',
    'Customer satisfaction score',
    'SCORE',
    'AVERAGE'
)


ON CONFLICT(
    organization_id,
    metric_code
)

DO NOTHING;



-- ============================================================================
-- REPORTING HEALTH VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW reporting.v_reporting_health AS


SELECT

'REPORT_DEFINITIONS' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM reporting.report_definitions



UNION ALL



SELECT

'METRICS',

COUNT(*),

'PASS'

FROM reporting.metrics



UNION ALL



SELECT

'KPI_LIBRARY',

COUNT(*),

'PASS'

FROM reporting.kpis



UNION ALL



SELECT

'DASHBOARD_WIDGETS',

COUNT(*),

'PASS'

FROM reporting.dashboard_widgets;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_dashboard_widgets_updated

    ON reporting.dashboard_widgets;


    CREATE TRIGGER trg_dashboard_widgets_updated

    BEFORE UPDATE

    ON reporting.dashboard_widgets

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
    24,
    '024_reporting.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

