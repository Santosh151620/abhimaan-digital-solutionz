-- ============================================================
-- 011_policies.sql
-- PART 1
-- APPLICATION AUTHORIZATION POLICIES
-- ============================================================

BEGIN;


-- ============================================================
-- POLICY HELPER FUNCTIONS
-- ============================================================


CREATE OR REPLACE FUNCTION can_access_module(

    module_name TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

    SELECT 1

    FROM admin_user_roles ur

    JOIN admin_roles r

        ON r.id = ur.role_id


    WHERE ur.user_id = auth.uid()

    AND

    (

        r.permissions @> jsonb_build_array(module_name)

        OR

        r.role_key IN

        (

            'platform_owner',

            'organization_admin'

        )

    )

);


END;

$$;



-- ============================================================
-- RECORD OWNERSHIP CHECK
-- ============================================================

CREATE OR REPLACE FUNCTION can_modify_record(

    record_owner UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

(

record_owner = auth.uid()

)

OR

is_platform_admin();



END;

$$;



-- ============================================================
-- SALES ACCESS FUNCTIONS
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_sales()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'sales_manager',

'sales_admin',

'organization_admin',

'platform_owner'

)

);



END;

$$;



CREATE OR REPLACE FUNCTION can_view_sales()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'sales_user',

'sales_manager',

'sales_admin',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- CRM POLICY TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS application_permission_policies

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    module_name TEXT NOT NULL,

    role_key TEXT NOT NULL,

    permission_key TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(

        module_name,

        role_key,

        permission_key

    )

);



-- ============================================================
-- CRM POLICY DEFINITIONS
-- ============================================================


INSERT INTO application_permission_policies

(

module_name,

role_key,

permission_key

)

VALUES


('crm','sales_user','lead.view'),

('crm','sales_user','lead.create'),

('crm','sales_user','lead.update'),


('crm','sales_manager','lead.delete'),

('crm','sales_manager','pipeline.manage'),

('crm','sales_manager','forecast.view'),


('crm','organization_admin','crm.full_access'),

('crm','platform_owner','crm.full_access')



ON CONFLICT DO NOTHING;



-- ============================================================
-- CRM ENTITY ACCESS FUNCTIONS
-- ============================================================


CREATE OR REPLACE FUNCTION can_view_leads()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

can_view_sales();



END;

$$;



CREATE OR REPLACE FUNCTION can_manage_leads()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

can_manage_sales();



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

FROM application_permission_policies

WHERE module_name='crm'

)

THEN

RAISE EXCEPTION

'CRM permission policies missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 011_policies.sql
-- PART 2
-- CRM BUSINESS AUTHORIZATION
-- ============================================================

BEGIN;


-- ============================================================
-- LEAD MANAGEMENT POLICIES
-- ============================================================

CREATE OR REPLACE FUNCTION can_create_lead()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN user_has_permission(

    auth.uid(),

    'lead.create',

    current_organization_id()

)

OR can_manage_leads();



END;

$$;



CREATE OR REPLACE FUNCTION can_update_lead(

    lead_owner UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

lead_owner = auth.uid()

OR can_manage_leads();



END;

$$;



CREATE OR REPLACE FUNCTION can_delete_lead()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN can_manage_leads();



END;

$$;



-- ============================================================
-- CONTACT AND COMPANY POLICIES
-- ============================================================

CREATE OR REPLACE FUNCTION can_manage_customer_data()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'sales_user',

'sales_manager',

'customer_success',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- OPPORTUNITY POLICIES
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_opportunity(

    opportunity_owner UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

(

opportunity_owner = auth.uid()

)

OR

can_manage_sales();



END;

$$;



CREATE OR REPLACE FUNCTION can_change_pipeline_stage()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id=ur.role_id


WHERE ur.user_id=auth.uid()


AND r.role_key IN

(

'sales_manager',

'sales_admin',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- QUOTATION APPROVAL
-- ============================================================


CREATE OR REPLACE FUNCTION can_approve_quote()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id=ur.role_id


WHERE ur.user_id=auth.uid()


AND r.role_key IN

(

'sales_manager',

'finance_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- PROJECT ACCESS
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_projects()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id=ur.role_id


WHERE ur.user_id=auth.uid()


AND r.role_key IN

(

'project_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- SUPPORT ACCESS
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_support()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id=ur.role_id


WHERE ur.user_id=auth.uid()


AND r.role_key IN

(

'support_agent',

'support_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- POLICY MATRIX DATA
-- ============================================================


INSERT INTO application_permission_policies

(

module_name,

role_key,

permission_key

)

VALUES


('crm','sales_user','contact.view'),

('crm','sales_user','company.view'),


('crm','sales_manager','opportunity.manage'),

('crm','sales_manager','quotation.approve'),


('crm','project_manager','project.manage'),


('crm','support_agent','ticket.manage'),


('crm','organization_admin','customer.full_access')



ON CONFLICT DO NOTHING;



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM application_permission_policies

WHERE permission_key='opportunity.manage'

)

THEN

RAISE EXCEPTION

'Opportunity policies missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 011_policies.sql
-- PART 3 FINAL
-- ERP + ENTERPRISE AUTHORIZATION
-- ============================================================

BEGIN;


-- ============================================================
-- PROCUREMENT AUTHORIZATION
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_procurement()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'procurement_user',

'procurement_manager',

'organization_admin',

'platform_owner'

)

);


END;

$$;



CREATE OR REPLACE FUNCTION can_approve_purchase_order()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'procurement_manager',

'finance_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- INVENTORY AUTHORIZATION
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_inventory()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'inventory_user',

'inventory_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



CREATE OR REPLACE FUNCTION can_adjust_stock()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'inventory_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- FINANCE AUTHORIZATION
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_finance()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'finance_user',

'finance_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



CREATE OR REPLACE FUNCTION can_approve_payment()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'finance_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- HR AUTHORIZATION
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_hr()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'hr_user',

'hr_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



CREATE OR REPLACE FUNCTION can_view_employee_data(

    employee_id UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN

employee_id = auth.uid()

OR

can_manage_hr();



END;

$$;



-- ============================================================
-- ASSET MANAGEMENT
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_assets()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'asset_manager',

'organization_admin',

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- PLATFORM ADMIN AUTHORIZATION
-- ============================================================


CREATE OR REPLACE FUNCTION can_manage_platform()

RETURNS BOOLEAN

LANGUAGE plpgsql

STABLE

AS $$

BEGIN


RETURN EXISTS

(

SELECT 1

FROM admin_user_roles ur

JOIN admin_roles r

ON r.id = ur.role_id


WHERE ur.user_id = auth.uid()


AND r.role_key IN

(

'platform_owner'

)

);



END;

$$;



-- ============================================================
-- COMPLETE POLICY MATRIX
-- ============================================================


INSERT INTO application_permission_policies

(

module_name,

role_key,

permission_key

)

VALUES


('erp','procurement_user','vendor.view'),

('erp','procurement_manager','purchase.approve'),


('erp','inventory_user','stock.view'),

('erp','inventory_manager','stock.adjust'),


('erp','finance_user','invoice.manage'),

('erp','finance_manager','payment.approve'),


('erp','hr_manager','employee.manage'),


('erp','asset_manager','asset.manage'),


('platform','platform_owner','system.full_access')



ON CONFLICT DO NOTHING;



-- ============================================================
-- FINAL AUTHORIZATION VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM application_permission_policies

WHERE permission_key='system.full_access'

)

THEN

RAISE EXCEPTION

'Platform authorization missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_proc

WHERE proname='can_manage_finance'

)

THEN

RAISE EXCEPTION

'Finance authorization missing';


END IF;



END $$;



COMMIT;