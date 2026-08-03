BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- POST DEPLOYMENT FOUNDATION
-- Migration : 040
-- ============================================================================
-- Purpose
-- Final production deployment lifecycle foundation.
--
-- Supports:
-- Deployment tracking
-- Environment registration
-- Runtime health monitoring
-- System baseline
-- Release governance
-- Operational readiness
--
-- Principles:
-- Production observable
-- Audit ready
-- Deployment traceable
-- Enterprise operations ready
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS deployment;



-- ============================================================================
-- ENVIRONMENT REGISTRY
-- ============================================================================
-- Registered deployment environments.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.environments

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_code TEXT UNIQUE NOT NULL,

    environment_name TEXT NOT NULL,

    environment_type TEXT NOT NULL,

    application_version TEXT,

    database_version TEXT,

    status TEXT DEFAULT 'ACTIVE',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_deployment_environment_status

ON deployment.environments(status);



-- ============================================================================
-- RELEASE REGISTRY
-- ============================================================================
-- Tracks application releases.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.releases

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_id UUID NOT NULL,

    release_version TEXT NOT NULL,

    release_name TEXT,

    release_status TEXT DEFAULT 'DEPLOYED',

    deployed_by TEXT,

    deployed_at TIMESTAMPTZ DEFAULT NOW(),

    release_notes TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,


    CONSTRAINT fk_release_environment

    FOREIGN KEY(environment_id)

    REFERENCES deployment.environments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_release_environment

ON deployment.releases(environment_id);



CREATE INDEX IF NOT EXISTS

idx_release_version

ON deployment.releases(release_version);



-- ============================================================================
-- DEPLOYMENT EVENTS
-- ============================================================================
-- Operational deployment history.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.events

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    release_id UUID,

    event_type TEXT NOT NULL,

    event_status TEXT DEFAULT 'SUCCESS',

    event_message TEXT,

    executed_by TEXT,

    execution_time_ms INTEGER,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_deployment_event_release

    FOREIGN KEY(release_id)

    REFERENCES deployment.releases(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_deployment_events_release

ON deployment.events(release_id);



CREATE INDEX IF NOT EXISTS

idx_deployment_events_type

ON deployment.events(event_type);



-- ============================================================================
-- SYSTEM HEALTH BASELINE
-- ============================================================================
-- Runtime health checkpoints.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.health_checks

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_id UUID,

    check_code TEXT NOT NULL,

    check_name TEXT NOT NULL,

    status TEXT DEFAULT 'UNKNOWN',

    response_time_ms INTEGER,

    details JSONB DEFAULT '{}'::jsonb,

    checked_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_health_environment

    FOREIGN KEY(environment_id)

    REFERENCES deployment.environments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_health_environment

ON deployment.health_checks(environment_id);



CREATE INDEX IF NOT EXISTS

idx_health_status

ON deployment.health_checks(status);



-- ============================================================================
-- SYSTEM CONFIGURATION SNAPSHOT
-- ============================================================================
-- Stores production configuration references.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.configuration_snapshots

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_id UUID NOT NULL,

    configuration_version TEXT NOT NULL,

    configuration_hash TEXT,

    snapshot_data JSONB DEFAULT '{}'::jsonb,

    created_by TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_config_environment

    FOREIGN KEY(environment_id)

    REFERENCES deployment.environments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_configuration_snapshot_environment

ON deployment.configuration_snapshots(environment_id);



-- ============================================================================
-- DEFAULT ENVIRONMENT REGISTRATION
-- ============================================================================


INSERT INTO deployment.environments

(

    environment_code,

    environment_name,

    environment_type,

    application_version,

    status

)

VALUES


(

    'PRODUCTION',

    'Production Environment',

    'PRODUCTION',

    '1.0.0',

    'ACTIVE'

),


(

    'STAGING',

    'Staging Environment',

    'STAGING',

    '1.0.0',

    'ACTIVE'

)



ON CONFLICT(environment_code)

DO UPDATE SET

environment_name = EXCLUDED.environment_name,

status = EXCLUDED.status;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- POST DEPLOYMENT FOUNDATION
-- Migration : 040
-- Part 2 Final
-- ============================================================================
-- Purpose
-- Complete production operations readiness.
--
-- Adds:
-- Health monitoring
-- Deployment verification
-- Backup tracking
-- Operational metadata
-- Release closure
-- Migration completion
-- ============================================================================



-- ============================================================================
-- SYSTEM METRICS BASELINE
-- ============================================================================
-- Captures operational measurements.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.system_metrics

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_id UUID,

    metric_code TEXT NOT NULL,

    metric_value NUMERIC,

    metric_unit TEXT,

    recorded_at TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb,


    CONSTRAINT fk_metrics_environment

    FOREIGN KEY(environment_id)

    REFERENCES deployment.environments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_system_metrics_environment

ON deployment.system_metrics(environment_id);



CREATE INDEX IF NOT EXISTS

idx_system_metrics_code

ON deployment.system_metrics(metric_code);



-- ============================================================================
-- BACKUP VERIFICATION TRACKING
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.backup_verifications

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_id UUID,

    backup_type TEXT NOT NULL,

    backup_reference TEXT,

    verification_status TEXT DEFAULT 'PENDING',

    verified_by TEXT,

    verified_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_backup_environment

    FOREIGN KEY(environment_id)

    REFERENCES deployment.environments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_backup_verification_environment

ON deployment.backup_verifications(environment_id);



-- ============================================================================
-- DEPLOYMENT CHECKLIST
-- ============================================================================
-- Final production acceptance checklist.
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.release_checklist

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    release_id UUID,

    checklist_code TEXT UNIQUE NOT NULL,

    checklist_name TEXT NOT NULL,

    status TEXT DEFAULT 'PENDING',

    completed_by TEXT,

    completed_at TIMESTAMPTZ,

    notes TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,


    CONSTRAINT fk_checklist_release

    FOREIGN KEY(release_id)

    REFERENCES deployment.releases(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_release_checklist_status

ON deployment.release_checklist(status);



-- ============================================================================
-- OPERATIONAL RUNBOOK REGISTRY
-- ============================================================================


CREATE TABLE IF NOT EXISTS deployment.runbooks

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    runbook_code TEXT UNIQUE NOT NULL,

    runbook_name TEXT NOT NULL,

    category TEXT,

    document_reference TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_runbook_category

ON deployment.runbooks(category);



-- ============================================================================
-- STANDARD PRODUCTION CHECKLIST
-- ============================================================================


INSERT INTO deployment.release_checklist

(

    checklist_code,

    checklist_name,

    status

)

VALUES


(

    'DATABASE_VALIDATION',

    'Database Migration Validation',

    'COMPLETED'

),


(

    'SECURITY_VALIDATION',

    'Security Controls Validation',

    'COMPLETED'

),


(

    'APPLICATION_BUILD',

    'Application Build Verification',

    'COMPLETED'

),


(

    'SMOKE_TEST',

    'Production Smoke Testing',

    'PENDING'

),


(

    'UAT_READY',

    'User Acceptance Testing Ready',

    'PENDING'

)



ON CONFLICT(checklist_code)

DO UPDATE SET

status = EXCLUDED.status;



-- ============================================================================
-- OPERATIONAL RUNBOOK SEEDS
-- ============================================================================


INSERT INTO deployment.runbooks

(

    runbook_code,

    runbook_name,

    category

)

VALUES


(

    'DEPLOYMENT',

    'Production Deployment Procedure',

    'OPERATIONS'

),


(

    'BACKUP_RECOVERY',

    'Backup Recovery Procedure',

    'OPERATIONS'

),


(

    'SECURITY_RESPONSE',

    'Security Incident Response',

    'SECURITY'

),


(

    'DATABASE_MAINTENANCE',

    'Database Maintenance Procedure',

    'DATABASE'

)



ON CONFLICT(runbook_code)

DO NOTHING;



-- ============================================================================
-- DEPLOYMENT HEALTH VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_deployment_health AS


SELECT


    e.environment_code,


    e.environment_name,


    COUNT(h.id) AS total_checks,


    COUNT(h.id)

    FILTER

    (

        WHERE h.status='PASS'

    )

    AS passed_checks,


    COUNT(h.id)

    FILTER

    (

        WHERE h.status='FAIL'

    )

    AS failed_checks



FROM deployment.environments e



LEFT JOIN deployment.health_checks h

ON h.environment_id=e.id



GROUP BY


e.environment_code,

e.environment_name;



-- ============================================================================
-- UPDATED TIMESTAMP TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'environments',

        'runbooks'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON deployment.%I;',

            tbl,

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON deployment.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- SECURITY GRANTS
-- ============================================================================


GRANT USAGE

ON SCHEMA deployment

TO authenticated;



GRANT SELECT, INSERT, UPDATE

ON ALL TABLES IN SCHEMA deployment

TO authenticated;



-- ============================================================================
-- FINAL MIGRATION REGISTRY ENTRY
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

    40,

    '040_post_deployment.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;

