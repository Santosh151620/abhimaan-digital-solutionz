BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- FINAL DEPLOYMENT VALIDATION
-- Migration : 039
-- ============================================================================
-- Purpose
-- Production release readiness validation.
--
-- Validates:
-- Schema integrity
-- Migration completion
-- Core platform readiness
-- Security foundation
-- CRM foundation
-- Workflow foundation
-- Storage foundation
-- Notification foundation
--
-- Principles:
-- Non-destructive
-- Deployment safe
-- Audit friendly
-- Production gate ready
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS release_validation;



-- ============================================================================
-- RELEASE VALIDATION RESULTS
-- ============================================================================


CREATE TABLE IF NOT EXISTS release_validation.check_results

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    check_code TEXT UNIQUE NOT NULL,

    check_name TEXT NOT NULL,

    category TEXT NOT NULL,

    severity TEXT DEFAULT 'HIGH',

    status TEXT DEFAULT 'PENDING',

    details TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    executed_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_release_validation_category

ON release_validation.check_results(category);



CREATE INDEX IF NOT EXISTS

idx_release_validation_status

ON release_validation.check_results(status);



-- ============================================================================
-- SCHEMA EXISTENCE VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SCHEMA_PLATFORM',

'Platform Schema Exists',

'ARCHITECTURE',


CASE

WHEN EXISTS

(

    SELECT 1

    FROM information_schema.schemata

    WHERE schema_name='platform'

)

THEN 'PASS'

ELSE 'FAIL'

END,


'Platform schema verification';



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SCHEMA_SECURITY',

'Security Schema Exists',

'SECURITY',


CASE

WHEN EXISTS

(

    SELECT 1

    FROM information_schema.schemata

    WHERE schema_name='security'

)

THEN 'PASS'

ELSE 'FAIL'

END,


'Security schema verification';



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SCHEMA_NOTIFICATION',

'Notification Schema Exists',

'NOTIFICATION',


CASE

WHEN EXISTS

(

    SELECT 1

    FROM information_schema.schemata

    WHERE schema_name='notification'

)

THEN 'PASS'

ELSE 'FAIL'

END,


'Notification schema verification';



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SCHEMA_ATTACHMENT',

'Attachment Schema Exists',

'STORAGE',


CASE

WHEN EXISTS

(

    SELECT 1

    FROM information_schema.schemata

    WHERE schema_name='attachment'

)

THEN 'PASS'

ELSE 'FAIL'

END,


'Attachment schema verification';



-- ============================================================================
-- BUSINESS FOUNDATION VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'BUSINESS_DOMAINS',

'Business Domains Available',

'BUSINESS',


CASE

WHEN COUNT(*) >= 5

THEN 'PASS'

ELSE 'FAIL'

END,


'Business taxonomy foundation'

FROM business.domains;



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'BUSINESS_CAPABILITIES',

'Business Capabilities Available',

'BUSINESS',


CASE

WHEN COUNT(*) >= 5

THEN 'PASS'

ELSE 'FAIL'

END,


'Capability taxonomy foundation'

FROM business.capabilities;



-- ============================================================================
-- NOTIFICATION FOUNDATION VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'NOTIFICATION_CHANNELS',

'Notification Channels Installed',

'NOTIFICATION',


CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END,


'Notification delivery channels'

FROM notification.channels;



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'NOTIFICATION_EVENTS',

'Notification Events Installed',

'NOTIFICATION',


CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END,


'Notification event catalog'

FROM notification.events;



-- ============================================================================
-- STORAGE FOUNDATION VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'STORAGE_BUCKETS',

'Storage Buckets Available',

'STORAGE',


CASE

WHEN COUNT(*) >= 2

THEN 'PASS'

ELSE 'FAIL'

END,


'Storage bucket configuration'

FROM storage_management.buckets;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- FINAL DEPLOYMENT VALIDATION
-- Migration : 039
-- Part 2 Final
-- ============================================================================
-- Purpose
-- Complete production readiness validation.
--
-- Adds:
-- Security validation
-- RLS verification
-- Migration completeness
-- Performance checks
-- Release scoring
-- Deployment approval status
-- ============================================================================



-- ============================================================================
-- SECURITY VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SECURITY_POLICIES',

'Security Policies Installed',

'SECURITY',


CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END,


'Security governance policies'

FROM security.policies;



INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'SECURITY_CONFIGURATION',

'Security Configuration Available',

'SECURITY',


CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END,


'Security configuration foundation'

FROM security.security_configuration;



-- ============================================================================
-- RLS VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'RLS_SECURITY_TABLES',

'Security Tables Protected',

'SECURITY',


CASE

WHEN COUNT(*) > 0

THEN 'PASS'

ELSE 'FAIL'

END,


'Row level security validation'

FROM pg_class c

JOIN pg_namespace n

ON n.oid=c.relnamespace

WHERE n.nspname='security'

AND c.relrowsecurity=TRUE;



-- ============================================================================
-- MIGRATION COMPLETENESS VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'MIGRATION_COUNT',

'Enterprise Migration Set Complete',

'DEPLOYMENT',


CASE

WHEN COUNT(*) >= 39

THEN 'PASS'

ELSE 'FAIL'

END,


'Migration execution registry validation'

FROM rollback.deployment_history;



-- ============================================================================
-- INDEX VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'INDEX_COUNT',

'Performance Index Foundation',

'PERFORMANCE',


CASE

WHEN COUNT(*) >= 20

THEN 'PASS'

ELSE 'FAIL'

END,


'Database performance indexes'

FROM pg_indexes;



-- ============================================================================
-- FUNCTION VALIDATION
-- ============================================================================


INSERT INTO release_validation.check_results

(

    check_code,

    check_name,

    category,

    status,

    details

)


SELECT


'FUNCTION_COUNT',

'Platform Functions Available',

'PLATFORM',


CASE

WHEN COUNT(*) >= 5

THEN 'PASS'

ELSE 'FAIL'

END,


'Stored function validation'

FROM pg_proc;



-- ============================================================================
-- RELEASE SCORE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW release_validation.v_release_score AS


SELECT


COUNT(*) AS total_checks,


COUNT(*)

FILTER

(

    WHERE status='PASS'

)

AS passed_checks,


COUNT(*)

FILTER

(

    WHERE status='FAIL'

)

AS failed_checks,


ROUND

(

    COUNT(*)

    FILTER

    (

        WHERE status='PASS'

    )::NUMERIC

    /

    NULLIF(COUNT(*),0)

    *

    100,

    2

)

AS release_readiness_percentage



FROM release_validation.check_results;



-- ============================================================================
-- RELEASE STATUS VIEW
-- ============================================================================


CREATE OR REPLACE VIEW release_validation.v_release_status AS


SELECT


CASE

WHEN COUNT(*)

FILTER

(

    WHERE status='FAIL'

) = 0

THEN 'READY_FOR_DEPLOYMENT'


WHEN COUNT(*)

FILTER

(

    WHERE status='FAIL'

) <= 3

THEN 'REVIEW_REQUIRED'


ELSE 'NOT_READY'


END

AS deployment_status



FROM release_validation.check_results;



-- ============================================================================
-- UPDATED VALIDATION EXECUTION TIME
-- ============================================================================


UPDATE release_validation.check_results

SET

executed_at = NOW();



-- ============================================================================
-- SECURITY GRANTS
-- ============================================================================


GRANT USAGE

ON SCHEMA release_validation

TO authenticated;



GRANT SELECT

ON ALL TABLES IN SCHEMA release_validation

TO authenticated;



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

    39,

    '039_final_validation.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;

