-- ============================================================
-- 008_functions.sql
-- PART 1
-- CORE DATABASE FUNCTIONS
-- ============================================================

BEGIN;


-- ============================================================
-- AUTO UPDATE TIMESTAMP FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$;



-- ============================================================
-- CURRENT ORGANIZATION HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION current_organization_id()

RETURNS UUID

LANGUAGE plpgsql

STABLE

AS $$

DECLARE

    org_id UUID;

BEGIN


    SELECT organization_id

    INTO org_id

    FROM organization_members

    WHERE user_id = auth.uid()

    AND deleted_at IS NULL

    LIMIT 1;


    RETURN org_id;


END;

$$;



-- ============================================================
-- USER ORGANIZATION ACCESS CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_organization_access(

    target_org UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


    RETURN EXISTS (

        SELECT 1

        FROM organization_members

        WHERE user_id = auth.uid()

        AND organization_id = target_org

        AND deleted_at IS NULL

    );


END;

$$;



-- ============================================================
-- ADMIN USER CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION is_platform_admin()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS (

    SELECT 1

    FROM admin_user_roles ur

    JOIN admin_roles r

        ON r.id = ur.role_id


    WHERE ur.user_id = auth.uid()

    AND r.role_key IN

    (

        'platform_owner',

        'organization_admin'

    )

);


END;

$$;



-- ============================================================
-- REQUIRED FIELD VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_required_text(

    value TEXT,

    field_name TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

AS $$

BEGIN


IF value IS NULL OR trim(value) = ''

THEN

    RAISE EXCEPTION

    'Required field missing: %',

    field_name;


END IF;


RETURN TRUE;


END;

$$;



-- ============================================================
-- EMAIL FORMAT VALIDATION
-- ============================================================

CREATE OR REPLACE FUNCTION validate_email(

    email_value TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

AS $$

BEGIN


RETURN email_value ~*

'^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$';


END;

$$;



-- ============================================================
-- SOFT DELETE HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION apply_soft_delete()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


    NEW.deleted_at = NOW();


    RETURN NEW;


END;

$$;



COMMIT;
-- ============================================================
-- 008_functions.sql
-- PART 2
-- RBAC + FEATURE MANAGEMENT FUNCTIONS
-- ============================================================

BEGIN;


-- ============================================================
-- CHECK USER ROLE
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_role(

    target_user UUID,

    target_role_key TEXT,

    target_org UUID DEFAULT NULL

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS (

    SELECT 1

    FROM admin_user_roles ur

    JOIN admin_roles r

        ON r.id = ur.role_id


    WHERE ur.user_id = target_user

    AND r.role_key = target_role_key

    AND

    (

        target_org IS NULL

        OR ur.organization_id = target_org

    )

);


END;

$$;



-- ============================================================
-- CHECK USER PERMISSION
-- ============================================================

CREATE OR REPLACE FUNCTION user_has_permission(

    target_user UUID,

    permission TEXT,

    target_org UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS (

    SELECT 1

    FROM admin_user_roles ur


    JOIN admin_role_permissions rp

        ON rp.role_id = ur.role_id


    JOIN admin_permissions p

        ON p.id = rp.permission_id


    WHERE ur.user_id = target_user

    AND ur.organization_id = target_org

    AND p.permission_key = permission

    AND rp.granted = TRUE


)

OR EXISTS (

    SELECT 1

    FROM admin_user_permission_overrides po


    JOIN admin_permissions p

        ON p.id = po.permission_id


    WHERE po.user_id = target_user

    AND po.organization_id = target_org

    AND p.permission_key = permission

    AND po.granted = TRUE

    AND

    (

        po.expires_at IS NULL

        OR po.expires_at > NOW()

    )

);



END;

$$;



-- ============================================================
-- CURRENT USER PERMISSIONS
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_permissions(

    target_user UUID,

    target_org UUID

)

RETURNS TABLE

(

    permission_key TEXT

)

LANGUAGE sql

STABLE

AS $$


SELECT DISTINCT

    p.permission_key


FROM admin_user_roles ur


JOIN admin_role_permissions rp

    ON rp.role_id = ur.role_id


JOIN admin_permissions p

    ON p.id = rp.permission_id


WHERE ur.user_id = target_user

AND ur.organization_id = target_org

AND rp.granted = TRUE



UNION



SELECT DISTINCT

    p.permission_key


FROM admin_user_permission_overrides po


JOIN admin_permissions p

    ON p.id = po.permission_id


WHERE po.user_id = target_user

AND po.organization_id = target_org

AND po.granted = TRUE

AND

(

    po.expires_at IS NULL

    OR po.expires_at > NOW()

);


$$;



-- ============================================================
-- FEATURE FLAG CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION feature_enabled(

    target_org UUID,

    target_feature TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

DECLARE

    result BOOLEAN;


BEGIN


SELECT

    COALESCE(

        assignment.enabled,

        flag.is_enabled,

        FALSE

    )


INTO result


FROM admin_feature_flags flag


LEFT JOIN admin_feature_flag_assignments assignment

ON assignment.feature_flag_id = flag.id

AND assignment.organization_id = target_org



WHERE flag.feature_key = target_feature



LIMIT 1;



RETURN COALESCE(result,FALSE);


END;

$$;



-- ============================================================
-- LICENSE ENTITLEMENT CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION organization_has_entitlement(

    target_org UUID,

    entitlement TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$


BEGIN


RETURN EXISTS

(

    SELECT 1


    FROM admin_organization_licenses l


    JOIN admin_plan_entitlements e

        ON e.license_plan_id = l.license_plan_id


    WHERE l.organization_id = target_org


    AND l.status IN

    (

        'trial',

        'active'

    )


    AND e.entitlement_key = entitlement

);


END;

$$;



-- ============================================================
-- ORGANIZATION CONFIGURATION LOOKUP
-- ============================================================

CREATE OR REPLACE FUNCTION get_org_configuration(

    target_org UUID,

    config_key TEXT

)

RETURNS JSONB

LANGUAGE plpgsql

STABLE

AS $$

DECLARE

    result JSONB;


BEGIN


SELECT setting_value

INTO result


FROM admin_organization_settings


WHERE organization_id = target_org

AND setting_key = config_key



LIMIT 1;



RETURN COALESCE(

    result,

    '{}'::jsonb

);



END;

$$;



COMMIT;
-- ============================================================
-- 008_functions.sql
-- PART 3 FINAL
-- AUDIT + AUTOMATION FUNCTIONS
-- ============================================================

BEGIN;


-- ============================================================
-- AUDIT EVENT CREATION
-- ============================================================

CREATE OR REPLACE FUNCTION create_audit_event(

    target_org UUID,

    target_entity_type TEXT,

    target_entity_id UUID,

    target_action TEXT,

    old_data JSONB DEFAULT '{}'::jsonb,

    new_data JSONB DEFAULT '{}'::jsonb

)

RETURNS UUID

LANGUAGE plpgsql

AS $$

DECLARE

    audit_id UUID;


BEGIN


INSERT INTO admin_audit_events

(

    organization_id,

    user_id,

    event_type,

    entity_type,

    entity_id,

    action,

    old_values,

    new_values

)

VALUES

(

    target_org,

    auth.uid(),

    'database_change',

    target_entity_type,

    target_entity_id,

    target_action,

    old_data,

    new_data

)


RETURNING id INTO audit_id;



RETURN audit_id;


END;

$$;



-- ============================================================
-- ENTITY TIMELINE ENTRY
-- ============================================================

CREATE OR REPLACE FUNCTION create_entity_activity(

    target_org UUID,

    target_entity_type TEXT,

    target_entity_id UUID,

    activity_name TEXT,

    activity_metadata JSONB DEFAULT '{}'::jsonb

)

RETURNS UUID

LANGUAGE plpgsql

AS $$

DECLARE

    activity_id UUID;


BEGIN


INSERT INTO activities

(

    organization_id,

    entity_type,

    entity_id,

    title,

    metadata

)

VALUES

(

    target_org,

    target_entity_type,

    target_entity_id,

    activity_name,

    activity_metadata

)


RETURNING id INTO activity_id;



RETURN activity_id;


END;

$$;



-- ============================================================
-- DOCUMENT NUMBER GENERATOR
-- ============================================================

CREATE OR REPLACE FUNCTION generate_document_number(

    prefix TEXT

)

RETURNS TEXT

LANGUAGE plpgsql

AS $$

BEGIN


RETURN

prefix

||

'-'

||

TO_CHAR(

NOW(),

'YYYYMMDDHH24MISS'

)

||

'-'

||

SUBSTRING(

gen_random_uuid()::TEXT,

1,

8

);



END;

$$;



-- ============================================================
-- REVENUE TOTAL CALCULATION
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_revenue_total(

    target_org UUID,

    start_date DATE,

    end_date DATE

)

RETURNS NUMERIC

LANGUAGE plpgsql

STABLE

AS $$

DECLARE

    total NUMERIC;


BEGIN


SELECT

COALESCE(

SUM(amount),

0

)


INTO total


FROM revenue_transactions


WHERE organization_id = target_org


AND transaction_date BETWEEN start_date AND end_date;



RETURN total;


END;

$$;



-- ============================================================
-- PIPELINE VALUE CALCULATION
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_pipeline_value(

    target_org UUID

)

RETURNS NUMERIC

LANGUAGE plpgsql

STABLE

AS $$


DECLARE

    total NUMERIC;


BEGIN


SELECT

COALESCE(

SUM(amount),

0

)


INTO total


FROM opportunities


WHERE organization_id = target_org;



RETURN total;


END;

$$;



-- ============================================================
-- WORKFLOW CONDITION CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION workflow_condition_matches(

    record_data JSONB,

    condition JSONB

)

RETURNS BOOLEAN

LANGUAGE plpgsql

IMMUTABLE

AS $$


BEGIN


RETURN

record_data @> condition;



END;

$$;



-- ============================================================
-- NOTIFICATION CREATION
-- ============================================================

CREATE OR REPLACE FUNCTION create_notification(

    target_user UUID,

    target_org UUID,

    notification_type TEXT,

    message TEXT

)

RETURNS UUID

LANGUAGE plpgsql

AS $$

DECLARE

    notification_id UUID;


BEGIN


INSERT INTO notifications

(

    organization_id,

    user_id,

    notification_type,

    message

)

VALUES

(

    target_org,

    target_user,

    notification_type,

    message

)


RETURNING id INTO notification_id;



RETURN notification_id;


END;

$$;



-- ============================================================
-- GLOBAL SEARCH HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION normalize_search_text(

    input_text TEXT

)

RETURNS TEXT

LANGUAGE sql

IMMUTABLE

AS $$

SELECT

lower(

regexp_replace(

coalesce(input_text,''),

'[^a-zA-Z0-9 ]',

'',

'g'

)

);


$$;



-- ============================================================
-- FINAL FUNCTION VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM pg_proc

WHERE proname='user_has_permission'

)

THEN

RAISE EXCEPTION

'RBAC functions missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_proc

WHERE proname='create_audit_event'

)

THEN

RAISE EXCEPTION

'Audit functions missing';


END IF;



END $$;



COMMIT;