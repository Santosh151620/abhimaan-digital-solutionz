BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ADMIN AUDIT FOUNDATION
-- Migration : 013
-- ============================================================================
-- Purpose
-- Enterprise audit framework.
--
-- Supports:
-- Administrative auditing
-- Security monitoring
-- Compliance reporting
-- User activity tracking
-- CRM/Admin/Workflow audit integration
--
-- Principles:
-- Immutable history
-- Entity driven
-- Organization aware
-- Compliance ready
-- Enterprise retention capable
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS audit;



-- ============================================================================
-- AUDIT EVENT STORE
-- ============================================================================
-- Central immutable audit event repository.
--
-- Captures:
-- Who
-- What
-- When
-- Where
-- Which entity
-- Before/After state
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.audit_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    actor_id UUID,

    actor_type TEXT DEFAULT 'USER',

    event_type TEXT NOT NULL,

    event_category TEXT NOT NULL,

    entity_type TEXT,

    entity_id UUID,

    action TEXT NOT NULL,

    description TEXT,

    old_values JSONB DEFAULT '{}'::jsonb,

    new_values JSONB DEFAULT '{}'::jsonb,

    ip_address INET,

    user_agent TEXT,

    source_module TEXT,

    severity TEXT DEFAULT 'INFO',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_audit_events_org
ON audit.audit_events(organization_id);



CREATE INDEX IF NOT EXISTS
idx_audit_events_actor
ON audit.audit_events(actor_id);



CREATE INDEX IF NOT EXISTS
idx_audit_events_entity
ON audit.audit_events(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_audit_events_category
ON audit.audit_events(event_category);



CREATE INDEX IF NOT EXISTS
idx_audit_events_created
ON audit.audit_events(created_at);



-- ============================================================================
-- SECURITY AUDIT EVENTS
-- ============================================================================
-- Dedicated security tracking.
--
-- Examples:
-- Login
-- Logout
-- Failed authentication
-- Permission denied
-- Role changes
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.security_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    user_id UUID,

    event_code TEXT NOT NULL,

    event_status TEXT DEFAULT 'SUCCESS',

    risk_level TEXT DEFAULT 'LOW',

    ip_address INET,

    device_information JSONB DEFAULT '{}'::jsonb,

    details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_security_events_user
ON audit.security_events(user_id);



CREATE INDEX IF NOT EXISTS
idx_security_events_risk
ON audit.security_events(risk_level);



CREATE INDEX IF NOT EXISTS
idx_security_events_date
ON audit.security_events(created_at);



-- ============================================================================
-- DATA CHANGE HISTORY
-- ============================================================================
-- Tracks business data modifications.
--
-- Used by:
-- CRM entities
-- Admin settings
-- Enterprise modules
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.data_change_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    operation TEXT NOT NULL,

    changed_by UUID,

    previous_data JSONB DEFAULT '{}'::jsonb,

    changed_data JSONB DEFAULT '{}'::jsonb,

    change_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_data_change_entity
ON audit.data_change_history(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_data_change_user
ON audit.data_change_history(changed_by);



-- ============================================================================
-- AUDIT RETENTION POLICIES
-- ============================================================================
-- Enterprise compliance foundation.
--
-- Examples:
-- Keep security logs 365 days
-- Keep business audit 7 years
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.retention_policies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_code TEXT NOT NULL UNIQUE,

    policy_name TEXT NOT NULL,

    event_category TEXT NOT NULL,

    retention_days INTEGER NOT NULL,

    archive_enabled BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_retention_policy_category
ON audit.retention_policies(event_category);



-- ============================================================================
-- AUDIT REVIEW QUEUE
-- ============================================================================
-- Enables compliance/security review workflows.
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.audit_review_queue (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    audit_event_id UUID NOT NULL,

    review_status TEXT DEFAULT 'PENDING',

    assigned_to UUID,

    review_notes TEXT,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_audit_review_event

    FOREIGN KEY(audit_event_id)

    REFERENCES audit.audit_events(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_audit_review_status
ON audit.audit_review_queue(review_status);



-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================


DO
$$
BEGIN

    DROP TRIGGER IF EXISTS trg_retention_policies_updated
    ON audit.retention_policies;


    CREATE TRIGGER trg_retention_policies_updated

    BEFORE UPDATE

    ON audit.retention_policies

    FOR EACH ROW

    EXECUTE FUNCTION public.set_updated_at();

END;
$$;

BEGIN;

-- ============================================================================
-- DEFAULT AUDIT RETENTION POLICIES
-- ============================================================================
-- Enterprise default retention configuration.
--
-- Categories:
-- Security
-- Administration
-- Business Data
-- Compliance
-- ============================================================================


INSERT INTO audit.retention_policies
(
    policy_code,
    policy_name,
    event_category,
    retention_days,
    archive_enabled
)

VALUES


(
    'SECURITY_RETENTION',
    'Security Event Retention',
    'SECURITY',
    365,
    TRUE
),


(
    'ADMIN_RETENTION',
    'Administrative Activity Retention',
    'ADMIN',
    730,
    TRUE
),


(
    'BUSINESS_RETENTION',
    'Business Data Change Retention',
    'BUSINESS',
    2555,
    TRUE
),


(
    'SYSTEM_RETENTION',
    'System Activity Retention',
    'SYSTEM',
    180,
    FALSE
)


ON CONFLICT(policy_code)
DO NOTHING;



-- ============================================================================
-- AUDIT EVENT CATEGORIES
-- ============================================================================
-- Standard audit classification registry.
-- ============================================================================


CREATE TABLE IF NOT EXISTS audit.event_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT NOT NULL UNIQUE,

    category_name TEXT NOT NULL,

    description TEXT,

    severity_default TEXT DEFAULT 'INFO',

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_event_categories_status
ON audit.event_categories(active);



INSERT INTO audit.event_categories
(
    category_code,
    category_name,
    description,
    severity_default
)

VALUES


(
    'AUTHENTICATION',
    'Authentication Events',
    'Login and identity events',
    'INFO'
),


(
    'AUTHORIZATION',
    'Authorization Events',
    'Permission and access events',
    'WARNING'
),


(
    'ADMINISTRATION',
    'Administration Events',
    'Administrative changes',
    'INFO'
),


(
    'BUSINESS',
    'Business Data Events',
    'Business entity changes',
    'INFO'
),


(
    'SECURITY',
    'Security Events',
    'Security monitoring events',
    'HIGH'
)


ON CONFLICT(category_code)
DO NOTHING;



-- ============================================================================
-- COMPLIANCE REPORT FOUNDATION
-- ============================================================================
-- Ready for:
-- Admin dashboards
-- Security reports
-- Compliance exports
-- ============================================================================


CREATE OR REPLACE VIEW audit.v_audit_summary AS

SELECT

    event_category,

    severity,

    COUNT(*) AS total_events,

    MIN(created_at) AS first_event,

    MAX(created_at) AS latest_event

FROM audit.audit_events

GROUP BY

    event_category,

    severity;



-- ============================================================================
-- SECURITY ACTIVITY SUMMARY
-- ============================================================================


CREATE OR REPLACE VIEW audit.v_security_summary AS

SELECT

    event_code,

    event_status,

    risk_level,

    COUNT(*) AS event_count,

    MAX(created_at) AS last_occurrence

FROM audit.security_events

GROUP BY

    event_code,

    event_status,

    risk_level;



-- ============================================================================
-- ENTITY CHANGE HISTORY SUMMARY
-- ============================================================================


CREATE OR REPLACE VIEW audit.v_entity_change_summary AS

SELECT

    entity_type,

    operation,

    COUNT(*) AS change_count,

    MAX(created_at) AS last_change

FROM audit.data_change_history

GROUP BY

    entity_type,

    operation;



-- ============================================================================
-- AUDIT VALIDATION CHECKS
-- ============================================================================


CREATE OR REPLACE VIEW audit.v_audit_health AS


SELECT

'AUDIT_EVENTS' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM audit.audit_events



UNION ALL



SELECT

'SECURITY_EVENTS',

COUNT(*),

'PASS'

FROM audit.security_events



UNION ALL



SELECT

'RETENTION_POLICIES',

COUNT(*),

CASE

WHEN COUNT(*) >= 4

THEN 'PASS'

ELSE 'FAIL'

END

FROM audit.retention_policies;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'event_categories'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON audit.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON audit.%1$s
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
    13,
    '013_admin_audit.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;