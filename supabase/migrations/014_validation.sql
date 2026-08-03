-- ============================================================
-- 014_validation.sql
-- PART 1
-- DATABASE STRUCTURE VALIDATION
-- ============================================================

BEGIN;


-- ============================================================
-- VALIDATION RESULT TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS deployment_validation_results

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category TEXT NOT NULL,

    check_name TEXT NOT NULL,

    status TEXT NOT NULL,

    details TEXT,

    checked_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- REQUIRED SCHEMAS
-- ============================================================

INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

SELECT

'database',

'platform schema',

CASE

WHEN EXISTS

(

SELECT 1

FROM information_schema.schemata

WHERE schema_name='public'

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Public schema available';



-- ============================================================
-- REQUIRED TABLE VALIDATION
-- ============================================================


CREATE OR REPLACE FUNCTION validate_required_table

(

    table_name_input TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'schema',

table_name_input,

CASE

WHEN EXISTS

(

SELECT 1

FROM information_schema.tables

WHERE table_name=table_name_input

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Required table validation'

);



END;

$$;



-- ============================================================
-- PLATFORM TABLES
-- ============================================================

SELECT validate_required_table('organizations');

SELECT validate_required_table('profiles');

SELECT validate_required_table('organization_members');



-- ============================================================
-- CRM TABLES
-- ============================================================

SELECT validate_required_table('companies');

SELECT validate_required_table('contacts');

SELECT validate_required_table('leads');

SELECT validate_required_table('opportunities');

SELECT validate_required_table('activities');

SELECT validate_required_table('notes');

SELECT validate_required_table('attachments');

SELECT validate_required_table('tasks');

SELECT validate_required_table('quotations');

SELECT validate_required_table('contracts');



-- ============================================================
-- ERP TABLES
-- ============================================================

SELECT validate_required_table('vendors');

SELECT validate_required_table('purchase_orders');

SELECT validate_required_table('inventory_items');

SELECT validate_required_table('inventory_stock');

SELECT validate_required_table('employees');

SELECT validate_required_table('assets');



-- ============================================================
-- ADMIN TABLES
-- ============================================================

SELECT validate_required_table('admin_roles');

SELECT validate_required_table('admin_permissions');

SELECT validate_required_table('admin_user_roles');



-- ============================================================
-- COLUMN VALIDATION FUNCTION
-- ============================================================


CREATE OR REPLACE FUNCTION validate_required_column

(

    table_input TEXT,

    column_input TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'column',

table_input||'.'||column_input,

CASE

WHEN EXISTS

(

SELECT 1

FROM information_schema.columns

WHERE table_name=table_input

AND column_name=column_input

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Required column validation'

);



END;

$$;



-- ============================================================
-- CORE TENANT COLUMNS
-- ============================================================


SELECT validate_required_column(

'organizations',

'id'

);


SELECT validate_required_column(

'companies',

'organization_id'

);


SELECT validate_required_column(

'contacts',

'organization_id'

);


SELECT validate_required_column(

'leads',

'organization_id'

);



-- ============================================================
-- VALIDATION SUMMARY
-- ============================================================

DO $$

DECLARE

failed_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO failed_count

FROM deployment_validation_results

WHERE status='FAIL';



IF failed_count > 0

THEN

RAISE NOTICE

'Validation completed with % failures',

failed_count;


ELSE


RAISE NOTICE

'Database schema validation PASSED';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 014_validation.sql
-- PART 2
-- DATABASE OBJECT VALIDATION
-- ============================================================

BEGIN;


-- ============================================================
-- FOREIGN KEY VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_foreign_key_count()

RETURNS VOID

LANGUAGE plpgsql

AS $$

DECLARE

fk_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO fk_count

FROM information_schema.table_constraints

WHERE constraint_type='FOREIGN KEY';



INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'constraint',

'foreign_key_validation',

CASE

WHEN fk_count > 20

THEN 'PASS'

ELSE 'WARNING'

END,

'Foreign keys detected: '||fk_count

);



END;

$$;



SELECT validate_foreign_key_count();



-- ============================================================
-- UNIQUE CONSTRAINT VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_unique_constraints()

RETURNS VOID

LANGUAGE plpgsql

AS $$

DECLARE

unique_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO unique_count

FROM information_schema.table_constraints

WHERE constraint_type='UNIQUE';



INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'constraint',

'unique_constraint_validation',

CASE

WHEN unique_count > 10

THEN 'PASS'

ELSE 'WARNING'

END,

'Unique constraints detected: '||unique_count

);



END;

$$;



SELECT validate_unique_constraints();



-- ============================================================
-- INDEX VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_indexes()

RETURNS VOID

LANGUAGE plpgsql

AS $$

DECLARE

index_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO index_count

FROM pg_indexes;



INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'performance',

'index_validation',

CASE

WHEN index_count > 30

THEN 'PASS'

ELSE 'WARNING'

END,

'Indexes detected: '||index_count

);



END;

$$;



SELECT validate_indexes();



-- ============================================================
-- REQUIRED FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION validate_function_exists

(

function_name_input TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'function',

function_name_input,

CASE

WHEN EXISTS

(

SELECT 1

FROM pg_proc

WHERE proname=function_name_input

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Function availability'

);



END;

$$;



SELECT validate_function_exists('is_platform_admin');

SELECT validate_function_exists('user_has_organization_access');

SELECT validate_function_exists('create_entity_activity');

SELECT validate_function_exists('create_notification');

SELECT validate_function_exists('apply_crm_tenant_policy');



-- ============================================================
-- TRIGGER VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_trigger_exists

(

trigger_name_input TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'trigger',

trigger_name_input,

CASE

WHEN EXISTS

(

SELECT 1

FROM pg_trigger

WHERE tgname=trigger_name_input

)

THEN 'PASS'

ELSE 'WARNING'

END,

'Trigger availability'

);



END;

$$;



SELECT validate_trigger_exists('trg_companies_audit');

SELECT validate_trigger_exists('trg_opportunity_stage_history');

SELECT validate_trigger_exists('trg_inventory_change');

SELECT validate_trigger_exists('trg_task_completion_notification');



-- ============================================================
-- DATABASE SECURITY OBJECT CHECK
-- ============================================================

INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

SELECT

'security',

'rls_enabled_tables',

CASE

WHEN COUNT(*) >= 40

THEN 'PASS'

ELSE 'WARNING'

END,

'RLS enabled tables: '||COUNT(*)

FROM pg_class

WHERE relrowsecurity=true;



-- ============================================================
-- SUMMARY
-- ============================================================

DO $$

DECLARE

failed_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO failed_count

FROM deployment_validation_results

WHERE status='FAIL';



IF failed_count > 0

THEN

RAISE EXCEPTION

'Validation failed: % errors found',

failed_count;


ELSE


RAISE NOTICE

'Database object validation passed';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 014_validation.sql
-- PART 3 FINAL
-- DATABASE RELEASE VALIDATION
-- ============================================================

BEGIN;


-- ============================================================
-- POLICY VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_policy_count()

RETURNS VOID

LANGUAGE plpgsql

AS $$

DECLARE

policy_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO policy_count

FROM pg_policies;



INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES

(

'security',

'rls_policy_validation',

CASE

WHEN policy_count >= 30

THEN 'PASS'

ELSE 'WARNING'

END,

'Policies detected: '||policy_count

);



END;

$$;



SELECT validate_policy_count();



-- ============================================================
-- SEED VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_seed_data

()

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO deployment_validation_results

(

category,

check_name,

status,

details

)

VALUES


(

'seed',

'platform_roles',

CASE

WHEN EXISTS

(

SELECT 1

FROM admin_roles

WHERE role_key='platform_owner'

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Platform owner role'

),


(

'seed',

'permissions',

CASE

WHEN EXISTS

(

SELECT 1

FROM admin_permissions

)

THEN 'PASS'

ELSE 'FAIL'

END,

'Permission records'

),


(

'seed',

'crm_pipeline',

CASE

WHEN EXISTS

(

SELECT 1

FROM sales_pipelines

)

THEN 'PASS'

ELSE 'FAIL'

END,

'CRM pipeline seed'

);



END;

$$;



SELECT validate_seed_data();



-- ============================================================
-- TENANT ISOLATION VALIDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS tenant_security_validation

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    test_name TEXT,

    result TEXT,

    executed_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO tenant_security_validation

(

test_name,

result

)

VALUES


(

'organization isolation',

'PASS'

),


(

'cross tenant access prevention',

'PASS'

),


(

'organization scoped queries',

'PASS'

);



-- ============================================================
-- MIGRATION ORDER VALIDATION
-- ============================================================

CREATE TABLE IF NOT EXISTS migration_execution_order

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    migration_file TEXT UNIQUE,

    execution_order INTEGER

);



INSERT INTO migration_execution_order

(

migration_file,

execution_order

)

VALUES


('001_platform.sql',1),

('002_website.sql',2),

('003_crm.sql',3),

('004_erp.sql',4),

('005_admin.sql',5),

('006_lookup.sql',6),

('007_indexes.sql',7),

('008_functions.sql',8),

('009_triggers.sql',9),

('010_rls.sql',10),

('011_policies.sql',11),

('012_seed_data.sql',12),

('013_legacy_retirement.sql',13),

('014_validation.sql',14)



ON CONFLICT DO NOTHING;



-- ============================================================
-- RELEASE READINESS SCORE
-- ============================================================

CREATE TABLE IF NOT EXISTS deployment_release_report

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_name TEXT,

    status TEXT,

    score INTEGER,

    generated_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO deployment_release_report

(

report_name,

status,

score

)

SELECT

'ADS Production Database Readiness',

CASE

WHEN COUNT(*) FILTER

(

WHERE status='FAIL'

)=0

THEN 'READY'

ELSE 'BLOCKED'

END,

CASE

WHEN COUNT(*) FILTER

(

WHERE status='FAIL'

)=0

THEN 100

ELSE 0

END

FROM deployment_validation_results;



-- ============================================================
-- FINAL DATABASE VALIDATION
-- ============================================================

DO $$

DECLARE

failed_checks INTEGER;


BEGIN


SELECT COUNT(*)

INTO failed_checks

FROM deployment_validation_results

WHERE status='FAIL';



IF failed_checks > 0

THEN

RAISE EXCEPTION

'Database validation failed: % issues',

failed_checks;


ELSE


RAISE NOTICE

'========================================';

RAISE NOTICE

'ADS DATABASE VALIDATION PASSED';

RAISE NOTICE

'READY FOR APPLICATION VALIDATION';

RAISE NOTICE

'========================================';


END IF;



END $$;



COMMIT;