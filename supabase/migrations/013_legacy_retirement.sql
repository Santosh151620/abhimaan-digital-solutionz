-- ============================================================
-- 013_legacy_retirement.sql
-- PART 1
-- SAFE LEGACY RETIREMENT FOUNDATION
-- ============================================================

BEGIN;


-- ============================================================
-- ARCHIVE SCHEMA
-- ============================================================

CREATE SCHEMA IF NOT EXISTS archive;



-- ============================================================
-- LEGACY RETIREMENT REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_retirement_registry

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    object_type TEXT NOT NULL,

    object_name TEXT NOT NULL,

    replacement_object TEXT,

    retirement_status TEXT DEFAULT 'identified',

    notes TEXT,

    identified_at TIMESTAMPTZ DEFAULT NOW(),

    retired_at TIMESTAMPTZ

);



-- ============================================================
-- REGISTER COMMON LEGACY OBJECTS
-- ============================================================

INSERT INTO legacy_retirement_registry

(

object_type,

object_name,

replacement_object,

notes

)

VALUES


(

'table',

'legacy_leads',

'leads',

'Replaced by CRM entity lead model'

),


(

'table',

'legacy_contacts',

'contacts',

'Replaced by CRM contacts module'

),


(

'table',

'legacy_companies',

'companies',

'Replaced by CRM companies module'

),


(

'table',

'old_tasks',

'tasks',

'Replaced by entity task engine'

),


(

'table',

'old_notifications',

'notifications',

'Replaced by unified notification engine'

),


(

'table',

'old_activity_logs',

'activities',

'Replaced by entity activity timeline'

)


ON CONFLICT DO NOTHING;



-- ============================================================
-- LEGACY IMPORT TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_migration_tracking

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    legacy_object TEXT NOT NULL,

    target_object TEXT NOT NULL,

    records_processed BIGINT DEFAULT 0,

    migration_status TEXT DEFAULT 'pending',

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ

);



-- ============================================================
-- DETECT EXISTING LEGACY TABLES
-- ============================================================

CREATE OR REPLACE FUNCTION detect_legacy_objects()

RETURNS TABLE

(

    table_name TEXT

)

LANGUAGE sql

AS $$


SELECT

table_name::TEXT

FROM information_schema.tables

WHERE table_schema='public'

AND

(

table_name LIKE 'legacy_%'

OR

table_name LIKE 'old_%'

);



$$;



-- ============================================================
-- ARCHIVE HELPER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION archive_table_if_exists

(

    source_table TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


IF EXISTS

(

SELECT 1

FROM information_schema.tables

WHERE table_schema='public'

AND table_name=source_table

)

THEN


EXECUTE format

(

'ALTER TABLE %I SET SCHEMA archive',

source_table

);



END IF;



END;

$$;



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM information_schema.schemata

WHERE schema_name='archive'

)

THEN

RAISE EXCEPTION

'Archive schema creation failed';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM information_schema.tables

WHERE table_name='legacy_retirement_registry'

)

THEN

RAISE EXCEPTION

'Legacy registry missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 013_legacy_retirement.sql
-- PART 2
-- LEGACY MAPPING + MIGRATION TRACKING
-- ============================================================

BEGIN;


-- ============================================================
-- LEGACY COLUMN MAPPING
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_column_mapping

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    legacy_table TEXT NOT NULL,

    legacy_column TEXT NOT NULL,

    new_table TEXT NOT NULL,

    new_column TEXT NOT NULL,

    transformation_rule TEXT,

    migration_status TEXT DEFAULT 'pending',

    created_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO legacy_column_mapping

(

legacy_table,

legacy_column,

new_table,

new_column,

transformation_rule

)

VALUES


(

'legacy_leads',

'lead_id',

'leads',

'id',

'uuid conversion'

),


(

'legacy_leads',

'customer_name',

'leads',

'company_name',

'direct mapping'

),


(

'legacy_contacts',

'contact_name',

'contacts',

'first_name',

'name split required'

),


(

'old_tasks',

'task_description',

'tasks',

'description',

'direct mapping'

),


(

'old_activity_logs',

'activity_text',

'activities',

'description',

'direct mapping'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- REPOSITORY MIGRATION REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS repository_migration_registry

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    legacy_repository TEXT NOT NULL,

    replacement_repository TEXT NOT NULL,

    module_name TEXT NOT NULL,

    migration_status TEXT DEFAULT 'pending',

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO repository_migration_registry

(

legacy_repository,

replacement_repository,

module_name,

notes

)

VALUES


(

'LeadRepositoryLegacy',

'LeadRepository',

'CRM',

'Unified repository pattern'

),


(

'TaskRepositoryOld',

'TasksRepository',

'CRM',

'Entity task engine'

),


(

'NotificationRepositoryOld',

'NotificationsRepository',

'Platform',

'Unified notifications'

),


(

'ActivityRepositoryOld',

'ActivityRepository',

'Platform',

'Unified activity engine'

)


ON CONFLICT DO NOTHING;



-- ============================================================
-- SERVICE MIGRATION REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS service_migration_registry

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    legacy_service TEXT NOT NULL,

    replacement_service TEXT NOT NULL,

    module_name TEXT NOT NULL,

    migration_status TEXT DEFAULT 'pending',

    created_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO service_migration_registry

(

legacy_service,

replacement_service,

module_name

)

VALUES


(

'lead-service-old',

'crm/lead.service',

'CRM'

),


(

'client-service-old',

'crm/company.service',

'CRM'

),


(

'task-service-old',

'crm/task.service',

'CRM'

),


(

'notification-service-old',

'notification.service',

'Platform'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- DEPRECATED OBJECT MARKING
-- ============================================================

CREATE TABLE IF NOT EXISTS deprecated_objects

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    object_type TEXT NOT NULL,

    object_name TEXT NOT NULL,

    replacement TEXT,

    deprecated_reason TEXT,

    deprecated_at TIMESTAMPTZ DEFAULT NOW()

);



INSERT INTO deprecated_objects

(

object_type,

object_name,

replacement,

deprecated_reason

)

VALUES


(

'repository',

'NotificationRepository',

'NotificationsRepository',

'Duplicate repository removed'

),


(

'repository',

'ActivityRepositoryLegacy',

'ActivityRepository',

'Entity engine migration'

),


(

'type',

'OldLeadType',

'Lead',

'Type consolidation'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- ARCHIVE EXECUTION CONTROL
-- ============================================================

CREATE TABLE IF NOT EXISTS archive_execution_control

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    operation_name TEXT NOT NULL,

    approved BOOLEAN DEFAULT FALSE,

    executed BOOLEAN DEFAULT FALSE,

    executed_at TIMESTAMPTZ

);



INSERT INTO archive_execution_control

(

operation_name

)

VALUES


('archive legacy tables'),

('remove deprecated indexes'),

('remove old constraints')



ON CONFLICT DO NOTHING;



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM legacy_column_mapping

)

THEN

RAISE EXCEPTION

'Legacy mapping registry empty';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM repository_migration_registry

)

THEN

RAISE EXCEPTION

'Repository migration registry missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 013_legacy_retirement.sql
-- PART 3 FINAL
-- SAFE RETIREMENT VALIDATION
-- ============================================================

BEGIN;


-- ============================================================
-- LEGACY DEPENDENCY REPORT
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_dependency_report

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    object_name TEXT NOT NULL,

    dependency_type TEXT,

    dependency_reference TEXT,

    detected_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- DETECT LEGACY REFERENCES IN DATABASE OBJECTS
-- ============================================================

INSERT INTO legacy_dependency_report

(

object_name,

dependency_type,

dependency_reference

)

SELECT

routine_name,

'function',

routine_definition


FROM information_schema.routines

WHERE routine_definition ILIKE '%legacy_%';



-- ============================================================
-- SAFE ARCHIVE EXECUTION LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS archive_execution_log

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    object_name TEXT NOT NULL,

    action TEXT NOT NULL,

    status TEXT DEFAULT 'pending',

    executed_by UUID,

    executed_at TIMESTAMPTZ

);



-- ============================================================
-- SAFE ARCHIVE PROCEDURE
-- ============================================================

CREATE OR REPLACE FUNCTION execute_safe_archive

(

    target_table TEXT

)

RETURNS TEXT

LANGUAGE plpgsql

AS $$

DECLARE

    result TEXT;


BEGIN


IF EXISTS

(

SELECT 1

FROM information_schema.tables

WHERE table_schema='public'

AND table_name=target_table

)

THEN


INSERT INTO archive_execution_log

(

object_name,

action,

status

)

VALUES

(

target_table,

'archive',

'ready'

);



result := 'READY_FOR_ARCHIVE';



ELSE


result := 'TABLE_NOT_FOUND';



END IF;



RETURN result;


END;

$$;



-- ============================================================
-- MIGRATION COMPLETION STATUS
-- ============================================================

CREATE TABLE IF NOT EXISTS migration_release_status

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    migration_name TEXT UNIQUE,

    status TEXT DEFAULT 'pending',

    verified BOOLEAN DEFAULT FALSE,

    completed_at TIMESTAMPTZ

);



INSERT INTO migration_release_status

(

migration_name

)

VALUES


('platform_architecture'),

('website_architecture'),

('crm_architecture'),

('erp_architecture'),

('admin_architecture'),

('legacy_cleanup')



ON CONFLICT DO NOTHING;



-- ============================================================
-- RETIREMENT CHECKLIST
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_retirement_checklist

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    checklist_item TEXT NOT NULL,

    completed BOOLEAN DEFAULT FALSE

);



INSERT INTO legacy_retirement_checklist

(

checklist_item

)

VALUES


('New schema validated'),

('Application build successful'),

('Repository migration completed'),

('Service migration completed'),

('Legacy imports removed'),

('External UAT completed'),

('Production backup completed'),

('Archive approval received')



ON CONFLICT DO NOTHING;



-- ============================================================
-- FINAL VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM legacy_dependency_report

)

THEN

RAISE NOTICE

'No legacy database dependencies detected';

END IF;



IF NOT EXISTS

(

SELECT 1

FROM legacy_retirement_checklist

)

THEN

RAISE EXCEPTION

'Retirement checklist missing';

END IF;



END $$;



COMMIT;