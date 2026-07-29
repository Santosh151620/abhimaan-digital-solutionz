BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- VALIDATION SUITE
-- Migration : 006
-- ============================================================================
-- Purpose
-- Validate Platform Foundation
-- Validate Business Foundation
-- Validate Security Foundation
-- Validate Workflow Foundation
-- Validate Data Migration
-- Produce Deployment Readiness Checks
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS validation;

-- ============================================================================
-- VALIDATION RESULTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS validation.validation_results (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    validation_code TEXT NOT NULL,

    validation_name TEXT NOT NULL,

    category TEXT NOT NULL,

    severity TEXT DEFAULT 'INFO',

    status TEXT DEFAULT 'PENDING',

    details TEXT,

    execution_time_ms INTEGER,

    metadata JSONB DEFAULT '{}'::jsonb,

    executed_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_validation_category
ON validation.validation_results(category);

CREATE INDEX IF NOT EXISTS
idx_validation_status
ON validation.validation_results(status);

-- ============================================================================
-- PLATFORM VALIDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT

'PLATFORM_SCHEMA',

'Platform schema exists',

'Platform',

CASE

WHEN EXISTS (

SELECT 1

FROM information_schema.schemata

WHERE schema_name='platform'

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Platform schema validation';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT

'MASTER_SCHEMA',

'Master schema exists',

'Business',

CASE

WHEN EXISTS (

SELECT 1

FROM information_schema.schemata

WHERE schema_name='master'

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Business master schema validation';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT

'WORKFLOW_SCHEMA',

'Workflow schema exists',

'Workflow',

CASE

WHEN EXISTS (

SELECT 1

FROM information_schema.schemata

WHERE schema_name='workflow'

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Workflow schema validation';
-- ============================================================================
-- SECURITY VALIDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'SECURITY_SCHEMA',
'Security schema exists',
'Security',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.schemata
    WHERE schema_name='security'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Security schema validation';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'AI_SCHEMA',
'AI schema exists',
'AI',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.schemata
    WHERE schema_name='ai'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'AI schema validation';

-- ============================================================================
-- CORE TABLE VALIDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'ORGANIZATIONS_TABLE',
'Organizations table',
'Database',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='public'
      AND table_name='organizations'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Organizations table available';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'PROFILES_TABLE',
'Profiles table',
'Database',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='public'
      AND table_name='profiles'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Profiles table available';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'ORG_MEMBER_TABLE',
'Organization Members table',
'Database',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='public'
      AND table_name='organization_members'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Organization members available';

-- ============================================================================
-- ENTERPRISE FOUNDATION VALIDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'COUNTRIES_TABLE',
'Countries Master',
'Master Data',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='master'
      AND table_name='countries'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Country master validation';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'INDUSTRIES_TABLE',
'Industry Master',
'Master Data',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='master'
      AND table_name='industries'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Industry master validation';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'LOOKUP_TABLES',
'Lookup Foundation',
'Master Data',
CASE
WHEN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='platform'
      AND table_name='lookup_values'
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Platform lookup validation';
-- ============================================================================
-- RLS VALIDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'RLS_ORGANIZATIONS',
'Organizations RLS Enabled',
'Security',
CASE
WHEN EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n
      ON c.relnamespace = n.oid
    WHERE n.nspname='public'
      AND c.relname='organizations'
      AND c.relrowsecurity = TRUE
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Organizations Row Level Security';

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'RLS_PROFILES',
'Profiles RLS Enabled',
'Security',
CASE
WHEN EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n
      ON c.relnamespace=n.oid
    WHERE n.nspname='public'
      AND c.relname='profiles'
      AND c.relrowsecurity=TRUE
)
THEN 'PASS'
ELSE 'FAIL'
END,
'Profiles Row Level Security';

-- ============================================================================
-- ROLE FOUNDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'ROLE_COUNT',
'Enterprise Roles Installed',
'Security',
CASE
WHEN COUNT(*) >= 6
THEN 'PASS'
ELSE 'FAIL'
END,
'Enterprise admin hierarchy'
FROM security.roles;

-- ============================================================================
-- WORKFLOW FOUNDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'WORKFLOW_COUNT',
'Workflow Templates Installed',
'Workflow',
CASE
WHEN COUNT(*) >= 5
THEN 'PASS'
ELSE 'FAIL'
END,
'Workflow foundation'
FROM workflow.workflow_definitions;

-- ============================================================================
-- AI FOUNDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'AI_PROMPTS',
'AI Prompt Library',
'AI',
CASE
WHEN COUNT(*) >= 4
THEN 'PASS'
ELSE 'FAIL'
END,
'Prompt library'
FROM ai.prompt_library;

-- ============================================================================
-- REPORT FOUNDATION
-- ============================================================================

INSERT INTO validation.validation_results
(
    validation_code,
    validation_name,
    category,
    status,
    details
)
SELECT
'REPORT_LIBRARY',
'System Reports',
'Reporting',
CASE
WHEN COUNT(*) >= 5
THEN 'PASS'
ELSE 'FAIL'
END,
'Reporting library'
FROM reporting.report_definitions;

-- ============================================================================
-- VALIDATION SUMMARY VIEW
-- ============================================================================

CREATE OR REPLACE VIEW validation.v_summary AS

SELECT

category,

COUNT(*) AS total_checks,

COUNT(*) FILTER (WHERE status='PASS') AS passed,

COUNT(*) FILTER (WHERE status='FAIL') AS failed,

ROUND(

COUNT(*) FILTER (WHERE status='PASS')::numeric
/
NULLIF(COUNT(*),0)
*100,

2

) AS success_percentage

FROM validation.validation_results

GROUP BY category

ORDER BY category;

-- ============================================================================
-- VALIDATION COMPLETE
-- ============================================================================

COMMIT;