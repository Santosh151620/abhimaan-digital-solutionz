BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE TRIGGER FOUNDATION
-- Migration : 028
-- ============================================================================
-- Purpose
-- Production database automation triggers.
--
-- Supports:
-- Automatic timestamps
-- Audit automation
-- Entity activity tracking
-- Notification automation
-- Workflow hooks
-- Data integrity enforcement
--
-- Principles:
-- Event driven
-- Reusable
-- Module independent
-- No business duplication
-- Supabase compatible
-- ============================================================================



-- ============================================================================
-- GENERIC UPDATED_AT TRIGGER APPLICATION
-- ============================================================================
-- Ensures modified timestamps remain accurate.
-- ============================================================================


DO
$$
DECLARE

    trigger_record RECORD;

BEGIN


    FOR trigger_record IN

        SELECT

            table_schema,

            table_name


        FROM information_schema.columns


        WHERE column_name = 'updated_at'


        AND table_schema IN

        (

            'public',

            'admin',

            'workflow',

            'reporting',

            'dashboard',

            'website'

        )


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON %I.%I;',

            trigger_record.table_name,

            trigger_record.table_schema,

            trigger_record.table_name

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON %I.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            trigger_record.table_name,

            trigger_record.table_schema,

            trigger_record.table_name

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- AUDIT EVENT TABLE
-- ============================================================================
-- Centralized enterprise audit trail.
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.entity_audit_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    entity_type TEXT NOT NULL,

    entity_id UUID,

    action_type TEXT NOT NULL,

    old_data JSONB,

    new_data JSONB,

    changed_by UUID,

    changed_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_entity_audit_entity

ON admin.entity_audit_events

(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS

idx_entity_audit_date

ON admin.entity_audit_events

(
    changed_at DESC
);



-- ============================================================================
-- GENERIC AUDIT FUNCTION
-- ============================================================================


CREATE OR REPLACE FUNCTION admin.capture_entity_change()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$

DECLARE

    entity_identifier UUID;

BEGIN


    IF TG_OP = 'DELETE'

    THEN

        entity_identifier := OLD.id;


    ELSE

        entity_identifier := NEW.id;


    END IF;



    INSERT INTO admin.entity_audit_events

    (

        entity_type,

        entity_id,

        action_type,

        old_data,

        new_data,

        changed_by

    )


    VALUES

    (

        TG_TABLE_NAME,

        entity_identifier,

        TG_OP,

        CASE

            WHEN TG_OP <> 'INSERT'

            THEN to_jsonb(OLD)

        END,


        CASE

            WHEN TG_OP <> 'DELETE'

            THEN to_jsonb(NEW)

        END,


        auth.uid()

    );



    RETURN COALESCE(NEW, OLD);


END;

$$;



-- ============================================================================
-- AUDIT TRIGGER REGISTRATION
-- ============================================================================
-- Core business entities.
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'organizations',

        'profiles',

        'leads',

        'clients',

        'contacts',

        'opportunities',

        'quotations',

        'projects',

        'tasks'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_audit
             ON public.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_audit
             AFTER INSERT OR UPDATE OR DELETE
             ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION admin.capture_entity_change();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- ENTITY TIMELINE AUTOMATION
-- ============================================================================
-- Automatically creates activity records.
-- ============================================================================


CREATE OR REPLACE FUNCTION public.create_change_activity()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$

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

        TG_TABLE_NAME,

        COALESCE(NEW.id, OLD.id),

        lower(TG_OP),

        CONCAT(

            TG_OP,

            ' operation completed on ',

            TG_TABLE_NAME

        ),

        auth.uid()

    );



    RETURN COALESCE(NEW, OLD);


END;

$$;



-- ============================================================================
-- TIMELINE TRIGGER REGISTRATION
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'leads',

        'clients',

        'contacts',

        'opportunities',

        'quotations',

        'projects'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_activity
             ON public.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_activity
             AFTER INSERT OR UPDATE
             ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.create_change_activity();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE DATABASE TRIGGER FOUNDATION
-- Migration : 028
-- Part 2
-- ============================================================================
-- Purpose
-- Complete production trigger automation layer.
--
-- Adds:
-- Notification automation
-- Workflow event triggers
-- Security tracking
-- Data integrity protection
-- Validation monitoring
-- Trigger health framework
-- Migration registry
-- ============================================================================



-- ============================================================================
-- NOTIFICATION EVENT LOG
-- ============================================================================
-- Stores automated notification events.
-- ============================================================================


CREATE TABLE IF NOT EXISTS public.notification_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type TEXT NOT NULL,

    entity_id UUID,

    event_type TEXT NOT NULL,

    user_id UUID,

    processed BOOLEAN DEFAULT FALSE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_notification_events_entity

ON public.notification_events
(
    entity_type,
    entity_id
);



CREATE INDEX IF NOT EXISTS
idx_notification_events_processed

ON public.notification_events(processed);



-- ============================================================================
-- NOTIFICATION EVENT CREATION FUNCTION
-- ============================================================================


CREATE OR REPLACE FUNCTION public.create_notification_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$

BEGIN


    INSERT INTO public.notification_events

    (

        entity_type,

        entity_id,

        event_type,

        user_id,

        metadata

    )


    VALUES

    (

        TG_TABLE_NAME,

        COALESCE(NEW.id, OLD.id),

        TG_OP,

        auth.uid(),

        jsonb_build_object(

            'table',

            TG_TABLE_NAME,

            'operation',

            TG_OP

        )

    );



    RETURN COALESCE(NEW, OLD);


END;

$$;



-- ============================================================================
-- NOTIFICATION TRIGGER REGISTRATION
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'leads',

        'opportunities',

        'quotations',

        'tasks'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_notification_event
             ON public.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_notification_event
             AFTER INSERT OR UPDATE
             ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.create_notification_event();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- WORKFLOW EVENT QUEUE
-- ============================================================================
-- Event-driven workflow execution foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS workflow.event_queue (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type TEXT NOT NULL,

    entity_id UUID,

    event_name TEXT NOT NULL,

    payload JSONB DEFAULT '{}'::jsonb,

    status TEXT DEFAULT 'PENDING',

    processed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_workflow_event_status

ON workflow.event_queue(status);



CREATE INDEX IF NOT EXISTS
idx_workflow_event_entity

ON workflow.event_queue
(
    entity_type,
    entity_id
);



-- ============================================================================
-- WORKFLOW EVENT CREATION
-- ============================================================================


CREATE OR REPLACE FUNCTION workflow.enqueue_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$

BEGIN


    INSERT INTO workflow.event_queue

    (

        entity_type,

        entity_id,

        event_name,

        payload

    )


    VALUES

    (

        TG_TABLE_NAME,

        COALESCE(NEW.id, OLD.id),

        TG_OP,

        jsonb_build_object(

            'operation',

            TG_OP,

            'timestamp',

            NOW()

        )

    );



    RETURN COALESCE(NEW, OLD);


END;

$$;



-- ============================================================================
-- WORKFLOW TRIGGER REGISTRATION
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'leads',

        'opportunities',

        'projects',

        'tasks'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_workflow_event
             ON public.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_workflow_event
             AFTER INSERT OR UPDATE
             ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION workflow.enqueue_event();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- SECURITY CHANGE TRACKING
-- ============================================================================


CREATE OR REPLACE FUNCTION security.capture_security_change()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$

BEGIN


    INSERT INTO admin.entity_audit_events

    (

        entity_type,

        entity_id,

        action_type,

        old_data,

        new_data,

        changed_by

    )


    VALUES

    (

        TG_TABLE_NAME,

        COALESCE(NEW.id, OLD.id),

        CONCAT(

            'SECURITY_',

            TG_OP

        ),

        CASE

            WHEN TG_OP <> 'INSERT'

            THEN to_jsonb(OLD)

        END,

        CASE

            WHEN TG_OP <> 'DELETE'

            THEN to_jsonb(NEW)

        END,

        auth.uid()

    );



    RETURN COALESCE(NEW, OLD);


END;

$$;



-- ============================================================================
-- SECURITY TRIGGER REGISTRATION
-- ============================================================================


DO
$$

BEGIN


    DROP TRIGGER IF EXISTS trg_role_security_audit

    ON security.user_roles;



    CREATE TRIGGER trg_role_security_audit

    AFTER INSERT OR UPDATE OR DELETE

    ON security.user_roles

    FOR EACH ROW

    EXECUTE FUNCTION security.capture_security_change();


END;

$$;



-- ============================================================================
-- TRIGGER HEALTH VIEW
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS validation;



CREATE OR REPLACE VIEW validation.v_trigger_health AS


SELECT

event_object_schema AS schema_name,

event_object_table AS table_name,

COUNT(*) AS trigger_count


FROM information_schema.triggers


GROUP BY

event_object_schema,

event_object_table;



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
    28,
    '028_triggers.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

