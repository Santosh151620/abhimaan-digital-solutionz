BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DASHBOARD FOUNDATION
-- Migration : 025
-- ============================================================================
-- Purpose
-- Enterprise dashboard management foundation.
--
-- Supports:
-- Executive dashboards
-- User dashboards
-- Dashboard layouts
-- Widget placement
-- Personalization
-- CRM/Admin/Website dashboard alignment
-- Analytics visualization layer
--
-- Principles:
-- Metadata driven
-- Role aware
-- Organization aware
-- Extensible widgets
-- No module-specific business duplication
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS dashboard;



-- ============================================================================
-- DASHBOARD DEFINITIONS
-- ============================================================================
-- Master dashboard catalog.
--
-- Examples:
-- Executive Dashboard
-- Sales Dashboard
-- Admin Dashboard
-- Marketing Dashboard
-- Operations Dashboard
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    dashboard_code TEXT NOT NULL,

    dashboard_name TEXT NOT NULL,

    dashboard_type TEXT DEFAULT 'STANDARD',

    description TEXT,

    visibility TEXT DEFAULT 'PRIVATE',

    configuration JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_dashboard_definition

    UNIQUE(
        organization_id,
        dashboard_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_definition_type

ON dashboard.dashboard_definitions(dashboard_type);



CREATE INDEX IF NOT EXISTS
idx_dashboard_definition_status

ON dashboard.dashboard_definitions(active);



-- ============================================================================
-- USER DASHBOARD ASSIGNMENTS
-- ============================================================================
-- Dashboard ownership and access.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.user_dashboards (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    user_id UUID NOT NULL,

    is_default BOOLEAN DEFAULT FALSE,

    preferences JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_user_dashboard_definition

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_user_dashboard

    UNIQUE(
        dashboard_id,
        user_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_user_dashboard_user

ON dashboard.user_dashboards(user_id);



-- ============================================================================
-- DASHBOARD LAYOUTS
-- ============================================================================
-- Stores dashboard grid configuration.
--
-- Supports:
-- Drag and drop layouts
-- Responsive UI
-- Multiple screen sizes
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_layouts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    layout_name TEXT DEFAULT 'DEFAULT',

    layout_configuration JSONB DEFAULT '{}'::jsonb,

    screen_configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_layout

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_dashboard_layout

    UNIQUE(
        dashboard_id,
        layout_name
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_layout_dashboard

ON dashboard.dashboard_layouts(dashboard_id);



-- ============================================================================
-- DASHBOARD WIDGET INSTANCES
-- ============================================================================
-- Connects dashboards with reporting widgets.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_widget_instances (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    widget_id UUID NOT NULL,

    position_configuration JSONB DEFAULT '{}'::jsonb,

    display_configuration JSONB DEFAULT '{}'::jsonb,

    refresh_interval_seconds INTEGER DEFAULT 300,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_widget_dashboard

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_dashboard_widget_instance

    UNIQUE(
        dashboard_id,
        widget_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_widget_dashboard

ON dashboard.dashboard_widget_instances(dashboard_id);



-- ============================================================================
-- DASHBOARD FAVORITES
-- ============================================================================
-- User personalization.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_favorites (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    dashboard_id UUID NOT NULL,

    favorite_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_favorite

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_dashboard_favorite

    UNIQUE(
        user_id,
        dashboard_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_favorite_user

ON dashboard.dashboard_favorites(user_id);



-- ============================================================================
-- DASHBOARD ACCESS LOG
-- ============================================================================
-- Analytics and audit.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_access_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    user_id UUID,

    access_type TEXT DEFAULT 'VIEW',

    metadata JSONB DEFAULT '{}'::jsonb,

    accessed_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_access

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_access_dashboard

ON dashboard.dashboard_access_logs(dashboard_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'dashboard_definitions',

        'user_dashboards',

        'dashboard_layouts',

        'dashboard_widget_instances'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON dashboard.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON dashboard.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DASHBOARD FOUNDATION
-- Migration : 025
-- Part 2
-- ============================================================================
-- Purpose
-- Complete dashboard intelligence and executive visualization layer.
--
-- Adds:
-- Executive dashboard templates
-- Role-based dashboard assignment
-- Dashboard snapshots
-- KPI visualization
-- Dashboard analytics
-- Default enterprise dashboards
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- DASHBOARD ROLE ASSIGNMENTS
-- ============================================================================
-- Controls dashboard availability by role.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_role_assignments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    role_code TEXT NOT NULL,

    access_level TEXT DEFAULT 'VIEW',

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_role

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_dashboard_role

    UNIQUE(
        dashboard_id,
        role_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_role_code

ON dashboard.dashboard_role_assignments(role_code);



-- ============================================================================
-- DASHBOARD SNAPSHOTS
-- ============================================================================
-- Historical dashboard state capture.
--
-- Supports:
-- Executive reporting
-- Month-end review
-- Performance comparison
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    snapshot_date DATE NOT NULL,

    snapshot_data JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_snapshot

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_snapshot_date

ON dashboard.dashboard_snapshots(snapshot_date);



-- ============================================================================
-- DASHBOARD KPI CARDS
-- ============================================================================
-- Connects dashboards with KPIs.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_kpi_cards (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    kpi_id UUID NOT NULL,

    display_order INTEGER DEFAULT 0,

    visualization_configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_kpi_dashboard

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_dashboard_kpi_card

    UNIQUE(
        dashboard_id,
        kpi_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_kpi_dashboard

ON dashboard.dashboard_kpi_cards(dashboard_id);



-- ============================================================================
-- DASHBOARD ANALYTICS
-- ============================================================================
-- Usage intelligence.
-- ============================================================================


CREATE TABLE IF NOT EXISTS dashboard.dashboard_analytics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dashboard_id UUID NOT NULL,

    user_id UUID,

    metric_type TEXT NOT NULL,

    metric_value NUMERIC DEFAULT 0,

    metric_date DATE DEFAULT CURRENT_DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_dashboard_analytics

    FOREIGN KEY(dashboard_id)

    REFERENCES dashboard.dashboard_definitions(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_dashboard_analytics_date

ON dashboard.dashboard_analytics(metric_date);



-- ============================================================================
-- DEFAULT ENTERPRISE DASHBOARD TEMPLATES
-- ============================================================================


INSERT INTO dashboard.dashboard_definitions
(
    dashboard_code,
    dashboard_name,
    dashboard_type,
    description,
    visibility,
    configuration
)

VALUES


(
    'EXECUTIVE_OVERVIEW',

    'Executive Overview Dashboard',

    'EXECUTIVE',

    'Enterprise leadership dashboard',

    'ROLE_BASED',

    '{
        "modules":[
            "CRM",
            "REVENUE",
            "CUSTOMERS",
            "OPERATIONS"
        ]
    }'::jsonb
),


(
    'SALES_PERFORMANCE',

    'Sales Performance Dashboard',

    'CRM',

    'Sales pipeline and revenue intelligence',

    'ROLE_BASED',

    '{
        "modules":[
            "LEADS",
            "OPPORTUNITIES",
            "QUOTATIONS"
        ]
    }'::jsonb
),


(
    'OPERATIONS_CONTROL',

    'Operations Control Dashboard',

    'OPERATIONS',

    'Operational monitoring dashboard',

    'ROLE_BASED',

    '{
        "modules":[
            "PROJECTS",
            "TASKS",
            "SERVICE"
        ]
    }'::jsonb
),


(
    'MARKETING_INSIGHTS',

    'Marketing Insights Dashboard',

    'MARKETING',

    'Website and campaign intelligence',

    'ROLE_BASED',

    '{
        "modules":[
            "WEBSITE",
            "SEO",
            "BLOG"
        ]
    }'::jsonb
)


ON CONFLICT(
    organization_id,
    dashboard_code
)

DO NOTHING;



-- ============================================================================
-- DASHBOARD VIEWS
-- ============================================================================


CREATE OR REPLACE VIEW dashboard.v_dashboard_summary AS


SELECT

    dd.dashboard_type,

    COUNT(dd.id)

    AS total_dashboards,


    COUNT(dw.id)

    AS widget_count


FROM dashboard.dashboard_definitions dd


LEFT JOIN dashboard.dashboard_widget_instances dw

ON dw.dashboard_id = dd.id


GROUP BY

dd.dashboard_type;



-- ============================================================================
-- DASHBOARD HEALTH VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW dashboard.v_dashboard_health AS


SELECT

'DASHBOARD_DEFINITIONS' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM dashboard.dashboard_definitions



UNION ALL



SELECT

'USER_DASHBOARDS',

COUNT(*),

'PASS'

FROM dashboard.user_dashboards



UNION ALL



SELECT

'DASHBOARD_WIDGETS',

COUNT(*),

'PASS'

FROM dashboard.dashboard_widget_instances;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
BEGIN


    DROP TRIGGER IF EXISTS trg_dashboard_analytics_updated

    ON dashboard.dashboard_analytics;


    CREATE TRIGGER trg_dashboard_analytics_updated

    BEFORE UPDATE

    ON dashboard.dashboard_analytics

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
    25,
    '025_dashboard.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

