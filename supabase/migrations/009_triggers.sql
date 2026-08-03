-- ============================================================
-- 009_triggers.sql
-- PART 1
-- CORE DATABASE AUTOMATION TRIGGERS
-- ============================================================

BEGIN;


-- ============================================================
-- UPDATED TIMESTAMP TRIGGER FUNCTION ASSIGNMENT
-- ============================================================

-- PLATFORM

DROP TRIGGER IF EXISTS trg_organizations_updated
ON organizations;


CREATE TRIGGER trg_organizations_updated

BEFORE UPDATE ON organizations

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



DROP TRIGGER IF EXISTS trg_profiles_updated
ON profiles;


CREATE TRIGGER trg_profiles_updated

BEFORE UPDATE ON profiles

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



-- ADMIN

DROP TRIGGER IF EXISTS trg_admin_settings_updated
ON admin_platform_settings;


CREATE TRIGGER trg_admin_settings_updated

BEFORE UPDATE ON admin_platform_settings

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



DROP TRIGGER IF EXISTS trg_admin_org_settings_updated
ON admin_organization_settings;


CREATE TRIGGER trg_admin_org_settings_updated

BEFORE UPDATE ON admin_organization_settings

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



-- ============================================================
-- SOFT DELETE TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS trg_admin_roles_soft_delete
ON admin_roles;


CREATE TRIGGER trg_admin_roles_soft_delete

BEFORE DELETE ON admin_roles

FOR EACH ROW

EXECUTE FUNCTION apply_soft_delete();



DROP TRIGGER IF EXISTS trg_admin_users_soft_delete
ON admin_users;


CREATE TRIGGER trg_admin_users_soft_delete

BEFORE DELETE ON admin_users

FOR EACH ROW

EXECUTE FUNCTION apply_soft_delete();



-- ============================================================
-- ORGANIZATION VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_organization_reference()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF NEW.organization_id IS NULL

THEN

    RAISE EXCEPTION

    'organization_id is mandatory';


END IF;


RETURN NEW;


END;

$$;



DROP TRIGGER IF EXISTS trg_validate_admin_org

ON admin_organizations;



CREATE TRIGGER trg_validate_admin_org

BEFORE INSERT OR UPDATE

ON admin_organizations

FOR EACH ROW

EXECUTE FUNCTION validate_organization_reference();



DROP TRIGGER IF EXISTS trg_validate_admin_user_org

ON admin_users;



CREATE TRIGGER trg_validate_admin_user_org

BEFORE INSERT OR UPDATE

ON admin_users

FOR EACH ROW

EXECUTE FUNCTION validate_organization_reference();



-- ============================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION audit_table_changes()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

DECLARE

    entity_uuid UUID;


BEGIN


IF TG_OP = 'DELETE'

THEN

    entity_uuid := OLD.id;


    PERFORM create_audit_event(

        OLD.organization_id,

        TG_TABLE_NAME,

        entity_uuid,

        TG_OP,

        to_jsonb(OLD),

        '{}'::jsonb

    );


    RETURN OLD;


ELSE


    entity_uuid := NEW.id;


    PERFORM create_audit_event(

        NEW.organization_id,

        TG_TABLE_NAME,

        entity_uuid,

        TG_OP,

        CASE

            WHEN TG_OP='UPDATE'

            THEN to_jsonb(OLD)

            ELSE '{}'::jsonb

        END,

        to_jsonb(NEW)

    );


    RETURN NEW;


END IF;



END;

$$;



-- ============================================================
-- AUDIT ENABLEMENT CORE TABLES
-- ============================================================

DROP TRIGGER IF EXISTS trg_companies_audit
ON companies;


CREATE TRIGGER trg_companies_audit

AFTER INSERT OR UPDATE OR DELETE

ON companies

FOR EACH ROW

EXECUTE FUNCTION audit_table_changes();



DROP TRIGGER IF EXISTS trg_contacts_audit
ON contacts;


CREATE TRIGGER trg_contacts_audit

AFTER INSERT OR UPDATE OR DELETE

ON contacts

FOR EACH ROW

EXECUTE FUNCTION audit_table_changes();



DROP TRIGGER IF EXISTS trg_leads_audit
ON leads;


CREATE TRIGGER trg_leads_audit

AFTER INSERT OR UPDATE OR DELETE

ON leads

FOR EACH ROW

EXECUTE FUNCTION audit_table_changes();



COMMIT;
-- ============================================================
-- 009_triggers.sql
-- PART 2
-- CRM BUSINESS AUTOMATION TRIGGERS
-- ============================================================

BEGIN;


-- ============================================================
-- GENERIC ENTITY TIMELINE FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION create_entity_timeline_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

DECLARE

    action_text TEXT;

BEGIN


IF TG_OP = 'INSERT'

THEN

    action_text := 'created';


ELSIF TG_OP = 'UPDATE'

THEN

    action_text := 'updated';


ELSE

    action_text := 'deleted';


END IF;



PERFORM create_entity_activity(

    COALESCE(NEW.organization_id, OLD.organization_id),

    TG_TABLE_NAME,

    COALESCE(NEW.id, OLD.id),

    action_text,

    jsonb_build_object(

        'operation',

        TG_OP

    )

);



RETURN COALESCE(NEW, OLD);



END;

$$;



-- ============================================================
-- OPPORTUNITY STAGE HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS opportunity_stage_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    opportunity_id UUID NOT NULL,

    old_stage_id UUID,

    new_stage_id UUID,

    changed_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE OR REPLACE FUNCTION track_opportunity_stage_change()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF OLD.stage_id IS DISTINCT FROM NEW.stage_id

THEN


INSERT INTO opportunity_stage_history

(

organization_id,

opportunity_id,

old_stage_id,

new_stage_id,

changed_by

)

VALUES

(

NEW.organization_id,

NEW.id,

OLD.stage_id,

NEW.stage_id,

auth.uid()

);



END IF;



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_opportunity_stage_history

ON opportunities;



CREATE TRIGGER trg_opportunity_stage_history

AFTER UPDATE

ON opportunities

FOR EACH ROW

EXECUTE FUNCTION track_opportunity_stage_change();



-- ============================================================
-- CRM TIMELINE ENABLEMENT
-- ============================================================

DROP TRIGGER IF EXISTS trg_opportunities_timeline
ON opportunities;


CREATE TRIGGER trg_opportunities_timeline

AFTER INSERT OR UPDATE OR DELETE

ON opportunities

FOR EACH ROW

EXECUTE FUNCTION create_entity_timeline_event();



DROP TRIGGER IF EXISTS trg_tasks_timeline
ON tasks;


CREATE TRIGGER trg_tasks_timeline

AFTER INSERT OR UPDATE OR DELETE

ON tasks

FOR EACH ROW

EXECUTE FUNCTION create_entity_timeline_event();



DROP TRIGGER IF EXISTS trg_notes_timeline
ON notes;


CREATE TRIGGER trg_notes_timeline

AFTER INSERT OR UPDATE OR DELETE

ON notes

FOR EACH ROW

EXECUTE FUNCTION create_entity_timeline_event();



-- ============================================================
-- TASK COMPLETION NOTIFICATION
-- ============================================================

CREATE OR REPLACE FUNCTION notify_task_completion()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF OLD.status IS DISTINCT FROM NEW.status

AND NEW.status='completed'

THEN


PERFORM create_notification(

    NEW.assigned_to,

    NEW.organization_id,

    'task_completed',

    'Task completed successfully'

);



END IF;



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_task_completion_notification

ON tasks;



CREATE TRIGGER trg_task_completion_notification

AFTER UPDATE

ON tasks

FOR EACH ROW

EXECUTE FUNCTION notify_task_completion();



-- ============================================================
-- QUOTATION LIFECYCLE
-- ============================================================

CREATE OR REPLACE FUNCTION quotation_status_notification()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF OLD.status IS DISTINCT FROM NEW.status

THEN


PERFORM create_notification(

    NEW.owner_id,

    NEW.organization_id,

    'quotation_status',

    'Quotation status changed'

);



END IF;


RETURN NEW;


END;

$$;



DROP TRIGGER IF EXISTS trg_quote_status_notification

ON quotations;



CREATE TRIGGER trg_quote_status_notification

AFTER UPDATE

ON quotations

FOR EACH ROW

EXECUTE FUNCTION quotation_status_notification();



-- ============================================================
-- INVOICE PAYMENT EVENT
-- ============================================================

CREATE OR REPLACE FUNCTION invoice_payment_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF NEW.status='paid'

THEN


PERFORM create_entity_activity(

    NEW.organization_id,

    'invoice',

    NEW.id,

    'payment_received',

    jsonb_build_object(

        'amount',

        NEW.total_amount

    )

);



END IF;



RETURN NEW;


END;

$$;



DROP TRIGGER IF EXISTS trg_invoice_payment_event

ON invoices;



CREATE TRIGGER trg_invoice_payment_event

AFTER UPDATE

ON invoices

FOR EACH ROW

EXECUTE FUNCTION invoice_payment_event();



COMMIT;
-- ============================================================
-- 009_triggers.sql
-- PART 3 FINAL
-- ERP + PLATFORM AUTOMATION
-- ============================================================

BEGIN;


-- ============================================================
-- INVENTORY MOVEMENT TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_movement_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    item_id UUID NOT NULL,

    previous_quantity NUMERIC DEFAULT 0,

    new_quantity NUMERIC DEFAULT 0,

    movement_type TEXT,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE OR REPLACE FUNCTION track_inventory_change()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


INSERT INTO inventory_movement_history

(

    organization_id,

    item_id,

    previous_quantity,

    new_quantity,

    movement_type,

    created_by

)

VALUES

(

    NEW.organization_id,

    NEW.item_id,

    OLD.quantity,

    NEW.quantity,

    CASE

        WHEN NEW.quantity > OLD.quantity

        THEN 'stock_in'

        ELSE 'stock_out'

    END,

    auth.uid()

);



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_inventory_change

ON inventory_stock;



CREATE TRIGGER trg_inventory_change

AFTER UPDATE

ON inventory_stock

FOR EACH ROW

EXECUTE FUNCTION track_inventory_change();



-- ============================================================
-- PROCUREMENT STATUS EVENTS
-- ============================================================

CREATE OR REPLACE FUNCTION purchase_order_status_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF OLD.status IS DISTINCT FROM NEW.status

THEN


PERFORM create_entity_activity(

    NEW.organization_id,

    'purchase_order',

    NEW.id,

    'status_changed',

    jsonb_build_object(

        'from',

        OLD.status,

        'to',

        NEW.status

    )

);



END IF;


RETURN NEW;


END;

$$;



DROP TRIGGER IF EXISTS trg_purchase_order_status

ON purchase_orders;



CREATE TRIGGER trg_purchase_order_status

AFTER UPDATE

ON purchase_orders

FOR EACH ROW

EXECUTE FUNCTION purchase_order_status_event();



-- ============================================================
-- HR EMPLOYEE LIFECYCLE
-- ============================================================

CREATE OR REPLACE FUNCTION employee_status_change()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF OLD.status IS DISTINCT FROM NEW.status

THEN


PERFORM create_audit_event(

    NEW.organization_id,

    'employee',

    NEW.id,

    'status_change',

    to_jsonb(OLD),

    to_jsonb(NEW)

);



END IF;



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_employee_status

ON employees;



CREATE TRIGGER trg_employee_status

AFTER UPDATE

ON employees

FOR EACH ROW

EXECUTE FUNCTION employee_status_change();



-- ============================================================
-- ASSET MAINTENANCE REMINDER
-- ============================================================

CREATE OR REPLACE FUNCTION asset_maintenance_event()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF NEW.status='completed'

THEN


PERFORM create_entity_activity(

    NEW.organization_id,

    'asset',

    NEW.asset_id,

    'maintenance_completed',

    jsonb_build_object(

        'maintenance_id',

        NEW.id

    )

);



END IF;



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_asset_maintenance_event

ON asset_maintenance;



CREATE TRIGGER trg_asset_maintenance_event

AFTER UPDATE

ON asset_maintenance

FOR EACH ROW

EXECUTE FUNCTION asset_maintenance_event();



-- ============================================================
-- ERROR LOG MONITORING
-- ============================================================

CREATE OR REPLACE FUNCTION normalize_error_status()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


IF NEW.error_message IS NULL

THEN


RAISE EXCEPTION

'Error message cannot be empty';



END IF;



RETURN NEW;



END;

$$;



DROP TRIGGER IF EXISTS trg_validate_error_log

ON admin_error_logs;



CREATE TRIGGER trg_validate_error_log

BEFORE INSERT

ON admin_error_logs

FOR EACH ROW

EXECUTE FUNCTION normalize_error_status();



-- ============================================================
-- SYSTEM JOB EXECUTION UPDATE
-- ============================================================

CREATE OR REPLACE FUNCTION update_job_execution_time()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


UPDATE admin_system_jobs

SET

last_run_at = NEW.completed_at

WHERE id = NEW.job_id;



RETURN NEW;


END;

$$;



DROP TRIGGER IF EXISTS trg_job_execution_update

ON admin_job_executions;



CREATE TRIGGER trg_job_execution_update

AFTER INSERT OR UPDATE

ON admin_job_executions

FOR EACH ROW

EXECUTE FUNCTION update_job_execution_time();



-- ============================================================
-- FINAL TRIGGER VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM pg_trigger

WHERE tgname='trg_companies_audit'

)

THEN

RAISE EXCEPTION

'Audit triggers missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_trigger

WHERE tgname='trg_opportunity_stage_history'

)

THEN

RAISE EXCEPTION

'CRM lifecycle triggers missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_trigger

WHERE tgname='trg_inventory_change'

)

THEN

RAISE EXCEPTION

'ERP triggers missing';


END IF;



END $$;



COMMIT;