BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE FUNCTIONS FOUNDATION
-- Migration : 027
-- ============================================================================
-- Purpose
-- Production PostgreSQL function layer.
--
-- Supports:
-- Common utilities
-- Tenant/security helpers
-- Entity operations
-- Reporting calculations
-- Workflow helpers
-- Data consistency functions
--
-- Principles:
-- Reusable database capabilities
-- No module business duplication
-- Secure by default
-- Supabase compatible
-- ============================================================================


-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- UPDATED TIMESTAMP HANDLER
-- ----------------------------------------------------------------------------
-- Used by all updated_at triggers.
-- ----------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION public.set_updated_at()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$
BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;
$$;



-- ============================================================================
-- TENANT / ORGANIZATION HELPERS
-- ============================================================================


CREATE OR REPLACE FUNCTION public.get_user_organization_id()

RETURNS UUID

LANGUAGE plpgsql
SECURITY DEFINER

AS
$$

DECLARE

    org_id UUID;

BEGIN


    SELECT organization_id

    INTO org_id

    FROM public.profiles

    WHERE id = auth.uid();



    RETURN org_id;


END;

$$;



-- ----------------------------------------------------------------------------
-- Validate current tenant ownership
-- ----------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION public.user_belongs_to_organization(

    target_org_id UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql
SECURITY DEFINER

AS
$$

BEGIN


    RETURN EXISTS

    (

        SELECT 1

        FROM public.organization_members

        WHERE user_id = auth.uid()

        AND organization_id = target_org_id

    );


END;

$$;



-- ============================================================================
-- SECURITY HELPERS
-- ============================================================================


CREATE OR REPLACE FUNCTION security.has_role(

    required_role TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql
SECURITY DEFINER

AS
$$

BEGIN


    RETURN EXISTS

    (

        SELECT 1

        FROM security.user_roles ur

        JOIN security.roles r

        ON r.id = ur.role_id


        WHERE ur.user_id = auth.uid()

        AND r.role_code = required_role

    );


END;

$$;



-- ----------------------------------------------------------------------------
-- Permission validation
-- ----------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION security.has_permission(

    required_permission TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql
SECURITY DEFINER

AS
$$

BEGIN


    RETURN EXISTS

    (

        SELECT 1

        FROM security.user_roles ur


        JOIN security.role_permissions rp

        ON rp.role_id = ur.role_id


        JOIN security.permissions p

        ON p.id = rp.permission_id


        WHERE ur.user_id = auth.uid()

        AND p.permission_code = required_permission

    );


END;

$$;



-- ============================================================================
-- ENTITY HELPERS
-- ============================================================================
-- Generic entity architecture support.
-- ============================================================================


CREATE OR REPLACE FUNCTION public.entity_exists(

    entity_table TEXT,

    entity_id UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

AS
$$

DECLARE

    result BOOLEAN;

BEGIN


    EXECUTE format(

        'SELECT EXISTS(
            SELECT 1 FROM %I WHERE id = $1
        )',

        entity_table

    )

    INTO result

    USING entity_id;



    RETURN result;


END;

$$;



-- ============================================================================
-- ENTITY TIMELINE HELPERS
-- ============================================================================


CREATE OR REPLACE FUNCTION public.create_entity_activity(

    p_entity_type TEXT,

    p_entity_id UUID,

    p_activity_type TEXT,

    p_description TEXT

)

RETURNS UUID

LANGUAGE plpgsql

AS
$$

DECLARE

    activity_id UUID;


BEGIN


    INSERT INTO public.activities

    (

        entity_type,

        entity_id,

        activity_type,

        description,

        created_by

    )


    VALUES

    (

        p_entity_type,

        p_entity_id,

        p_activity_type,

        p_description,

        auth.uid()

    )


    RETURNING id

    INTO activity_id;



    RETURN activity_id;


END;

$$;



-- ============================================================================
-- REPORTING HELPERS
-- ============================================================================


CREATE OR REPLACE FUNCTION reporting.calculate_percentage(

    numerator NUMERIC,

    denominator NUMERIC

)

RETURNS NUMERIC

LANGUAGE plpgsql

IMMUTABLE

AS
$$

BEGIN


    IF denominator IS NULL

    OR denominator = 0

    THEN

        RETURN 0;

    END IF;



    RETURN ROUND(

        (numerator / denominator) * 100,

        2

    );


END;

$$;



-- ============================================================================
-- KPI STATUS CALCULATION
-- ============================================================================


CREATE OR REPLACE FUNCTION reporting.calculate_kpi_status(

    actual_value NUMERIC,

    target_value NUMERIC,

    warning_value NUMERIC

)

RETURNS TEXT

LANGUAGE plpgsql

IMMUTABLE

AS
$$

BEGIN


    IF actual_value >= target_value

    THEN

        RETURN 'ACHIEVED';


    ELSIF actual_value >= warning_value

    THEN

        RETURN 'WARNING';


    ELSE

        RETURN 'CRITICAL';


    END IF;


END;

$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE FUNCTIONS FOUNDATION
-- Migration : 027
-- Part 2
-- ============================================================================
-- Purpose
-- Complete database automation function layer.
--
-- Adds:
-- Workflow execution helpers
-- Notification helpers
-- Audit logging
-- Search utilities
-- Dashboard metric helpers
-- Data maintenance utilities
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- WORKFLOW EXECUTION FUNCTIONS
-- ============================================================================


CREATE OR REPLACE FUNCTION workflow.create_execution(

    p_workflow_id UUID,

    p_entity_type TEXT,

    p_entity_id UUID

)

RETURNS UUID

LANGUAGE plpgsql

AS
$$

DECLARE

    execution_id UUID;


BEGIN


    INSERT INTO workflow.workflow_executions

    (

        workflow_id,

        entity_type,

        entity_id,

        execution_status,

        started_at

    )


    VALUES

    (

        p_workflow_id,

        p_entity_type,

        p_entity_id,

        'STARTED',

        NOW()

    )


    RETURNING id

    INTO execution_id;



    RETURN execution_id;


END;

$$;



-- ============================================================================
-- COMPLETE WORKFLOW EXECUTION
-- ============================================================================


CREATE OR REPLACE FUNCTION workflow.complete_execution(

    p_execution_id UUID,

    p_status TEXT DEFAULT 'COMPLETED'

)

RETURNS BOOLEAN

LANGUAGE plpgsql

AS
$$

BEGIN


    UPDATE workflow.workflow_executions


    SET

        execution_status = p_status,

        completed_at = NOW()


    WHERE id = p_execution_id;



    RETURN FOUND;


END;

$$;



-- ============================================================================
-- NOTIFICATION FUNCTIONS
-- ============================================================================


CREATE OR REPLACE FUNCTION public.create_notification(

    p_user_id UUID,

    p_title TEXT,

    p_message TEXT,

    p_type TEXT DEFAULT 'SYSTEM'

)

RETURNS UUID

LANGUAGE plpgsql

AS
$$

DECLARE

    notification_id UUID;


BEGIN


    INSERT INTO public.notifications

    (

        user_id,

        title,

        message,

        notification_type,

        read_at,

        created_at

    )


    VALUES

    (

        p_user_id,

        p_title,

        p_message,

        p_type,

        NULL,

        NOW()

    )


    RETURNING id

    INTO notification_id;



    RETURN notification_id;


END;

$$;



-- ============================================================================
-- AUDIT LOG FUNCTIONS
-- ============================================================================


CREATE OR REPLACE FUNCTION admin.create_audit_log(

    p_action TEXT,

    p_entity_type TEXT,

    p_entity_id UUID,

    p_details JSONB DEFAULT '{}'::jsonb

)

RETURNS UUID

LANGUAGE plpgsql

AS
$$

DECLARE

    audit_id UUID;


BEGIN


    INSERT INTO admin.audit_logs

    (

        user_id,

        action,

        entity_type,

        entity_id,

        details,

        created_at

    )


    VALUES

    (

        auth.uid(),

        p_action,

        p_entity_type,

        p_entity_id,

        p_details,

        NOW()

    )


    RETURNING id

    INTO audit_id;



    RETURN audit_id;


END;

$$;



-- ============================================================================
-- SEARCH HELPERS
-- ============================================================================


CREATE OR REPLACE FUNCTION public.normalize_search_text(

    input_text TEXT

)

RETURNS TEXT

LANGUAGE plpgsql

IMMUTABLE

AS
$$

BEGIN


    RETURN lower(

        regexp_replace(

            trim(input_text),

            '\s+',

            ' ',

            'g'

        )

    );


END;

$$;



-- ============================================================================
-- DASHBOARD METRIC FUNCTIONS
-- ============================================================================


CREATE OR REPLACE FUNCTION dashboard.get_kpi_value(

    p_kpi_id UUID

)

RETURNS NUMERIC

LANGUAGE plpgsql

AS
$$

DECLARE

    result NUMERIC;


BEGIN


    SELECT actual_value

    INTO result


    FROM reporting.kpi_snapshots


    WHERE kpi_id = p_kpi_id


    ORDER BY snapshot_date DESC


    LIMIT 1;



    RETURN COALESCE(result,0);


END;

$$;



-- ============================================================================
-- DATA MAINTENANCE FUNCTIONS
-- ============================================================================


CREATE OR REPLACE FUNCTION public.cleanup_old_records(

    table_name TEXT,

    retention_days INTEGER

)

RETURNS INTEGER

LANGUAGE plpgsql

AS
$$

DECLARE

    deleted_count INTEGER;


BEGIN


    EXECUTE format(

        'DELETE FROM %I
         WHERE created_at < NOW() - INTERVAL ''%s days''',

        table_name,

        retention_days

    )

    ;



    GET DIAGNOSTICS deleted_count = ROW_COUNT;



    RETURN deleted_count;


END;

$$;



-- ============================================================================
-- SYSTEM HEALTH FUNCTION
-- ============================================================================


CREATE OR REPLACE FUNCTION public.get_system_health()

RETURNS JSONB

LANGUAGE plpgsql

AS
$$

DECLARE

    result JSONB;


BEGIN


    SELECT jsonb_build_object

    (

        'database_time',

        NOW(),


        'organizations',

        (

            SELECT COUNT(*)

            FROM public.organizations

        ),


        'users',

        (

            SELECT COUNT(*)

            FROM public.profiles

        )


    )


    INTO result;



    RETURN result;


END;

$$;



-- ============================================================================
-- FUNCTION VALIDATION
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS validation;



CREATE OR REPLACE VIEW validation.v_function_health AS


SELECT

routine_schema,

COUNT(*) AS function_count


FROM information_schema.routines


WHERE routine_schema IN

(

    'public',

    'security',

    'workflow',

    'reporting',

    'dashboard',

    'admin'

)


GROUP BY routine_schema;



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
    27,
    '027_functions.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT; 

