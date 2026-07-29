BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ROLLBACK FOUNDATION
-- Migration : 007
-- ============================================================================
-- Purpose
-- Emergency Rollback
-- Safe Recovery
-- Deployment Recovery
-- Enterprise Change Control
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS rollback;

-- ============================================================================
-- DEPLOYMENT HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.deployment_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    migration_number INTEGER NOT NULL,

    migration_name TEXT NOT NULL,

    deployment_version TEXT,

    executed_by TEXT,

    executed_at TIMESTAMPTZ DEFAULT NOW(),

    execution_status TEXT,

    execution_time_ms INTEGER,

    rollback_available BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb

);

CREATE INDEX IF NOT EXISTS
idx_deployment_history_number
ON rollback.deployment_history(migration_number);

CREATE INDEX IF NOT EXISTS
idx_deployment_history_date
ON rollback.deployment_history(executed_at);

-- ============================================================================
-- ROLLBACK LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.rollback_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    deployment_history_id UUID,

    rollback_version TEXT,

    rollback_reason TEXT,

    rollback_by TEXT,

    rollback_started_at TIMESTAMPTZ DEFAULT NOW(),

    rollback_completed_at TIMESTAMPTZ,

    rollback_status TEXT DEFAULT 'Pending',

    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT fk_rollback_deployment
    FOREIGN KEY(deployment_history_id)
    REFERENCES rollback.deployment_history(id)

);

CREATE INDEX IF NOT EXISTS
idx_rollback_history
ON rollback.rollback_history(rollback_started_at);

-- ============================================================================
-- BACKUP SNAPSHOT
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.backup_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    snapshot_name TEXT NOT NULL,

    snapshot_type TEXT,

    migration_number INTEGER,

    storage_location TEXT,

    checksum TEXT,

    created_by TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb

);

CREATE INDEX IF NOT EXISTS
idx_backup_snapshot
ON rollback.backup_snapshots(migration_number);

-- ============================================================================
-- CHANGE LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.change_log (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    migration_number INTEGER,

    object_type TEXT,

    object_name TEXT,

    action_type TEXT,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb

);

CREATE INDEX IF NOT EXISTS
idx_change_log
ON rollback.change_log(migration_number);
-- ============================================================================
-- ROLLBACK OPERATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.rollback_operations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rollback_code TEXT NOT NULL UNIQUE,

    rollback_name TEXT NOT NULL,

    migration_from INTEGER,

    migration_to INTEGER,

    operation_type TEXT NOT NULL,

    execution_order INTEGER DEFAULT 0,

    rollback_sql TEXT,

    validation_sql TEXT,

    status TEXT DEFAULT 'Pending',

    created_by TEXT,

    executed_by TEXT,

    executed_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb

);


CREATE INDEX IF NOT EXISTS
idx_rollback_operations_code
ON rollback.rollback_operations(rollback_code);


CREATE INDEX IF NOT EXISTS
idx_rollback_operations_status
ON rollback.rollback_operations(status);



-- ============================================================================
-- ROLLBACK EXECUTION LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.rollback_execution_log (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rollback_operation_id UUID,

    execution_step INTEGER,

    step_name TEXT,

    execution_status TEXT DEFAULT 'Pending',

    execution_message TEXT,

    started_at TIMESTAMPTZ DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    execution_time_ms INTEGER,

    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT fk_rollback_execution_operation

        FOREIGN KEY(rollback_operation_id)

        REFERENCES rollback.rollback_operations(id)

);


CREATE INDEX IF NOT EXISTS
idx_rollback_execution_operation
ON rollback.rollback_execution_log(rollback_operation_id);



-- ============================================================================
-- SAFE ROLLBACK PROCEDURE REGISTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS rollback.rollback_registry (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    object_schema TEXT NOT NULL,

    object_name TEXT NOT NULL,

    object_type TEXT NOT NULL,

    rollback_supported BOOLEAN DEFAULT TRUE,

    backup_required BOOLEAN DEFAULT TRUE,

    dependency_level INTEGER DEFAULT 0,

    rollback_order INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    UNIQUE(object_schema, object_name, object_type)

);



CREATE INDEX IF NOT EXISTS
idx_rollback_registry_object
ON rollback.rollback_registry(object_schema, object_name);



-- ============================================================================
-- DEFAULT RECOVERY CHECKPOINTS
-- ============================================================================

INSERT INTO rollback.recovery_checkpoints
(
    checkpoint_code,
    checkpoint_name,
    migration_number,
    execution_order,
    verification_required,
    rollback_supported
)
VALUES

(
    'CHECKPOINT_001',
    'Platform Core Completed',
    1,
    1,
    TRUE,
    TRUE
),

(
    'CHECKPOINT_002',
    'Business Foundation Completed',
    2,
    2,
    TRUE,
    TRUE
),

(
    'CHECKPOINT_003',
    'Workflow AI Reporting Completed',
    3,
    3,
    TRUE,
    TRUE
),

(
    'CHECKPOINT_004',
    'Security Foundation Completed',
    4,
    4,
    TRUE,
    TRUE
),

(
    'CHECKPOINT_005',
    'Data Migration Completed',
    5,
    5,
    TRUE,
    TRUE
),

(
    'CHECKPOINT_006',
    'Validation Completed',
    6,
    6,
    TRUE,
    TRUE

)

ON CONFLICT(checkpoint_code)
DO NOTHING;



-- ============================================================================
-- ROLLBACK COMPLETE VALIDATION VIEW
-- ============================================================================

CREATE OR REPLACE VIEW rollback.v_deployment_status AS

SELECT

    dh.migration_number,

    dh.migration_name,

    dh.execution_status,

    dh.rollback_available,

    dh.executed_at,

    COUNT(rv.id) AS validation_count

FROM rollback.deployment_history dh

LEFT JOIN rollback.deployment_validation rv

ON rv.deployment_id = dh.id

GROUP BY

    dh.id;



-- ============================================================================
-- ROLLBACK MIGRATION COMPLETE
-- ============================================================================

COMMIT;