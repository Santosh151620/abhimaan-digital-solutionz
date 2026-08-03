-- ============================================================
-- 010_rls.sql
-- PART 1
-- PLATFORM SECURITY POLICIES
-- ============================================================

BEGIN;


-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- ORGANIZATIONS
-- ============================================================

DROP POLICY IF EXISTS organizations_select_policy
ON organizations;


CREATE POLICY organizations_select_policy

ON organizations

FOR SELECT

TO authenticated

USING

(

    user_has_organization_access(id)

    OR

    is_platform_admin()

);



DROP POLICY IF EXISTS organizations_update_policy

ON organizations;


CREATE POLICY organizations_update_policy

ON organizations

FOR UPDATE

TO authenticated

USING

(

    user_has_organization_access(id)

    OR

    is_platform_admin()

);



-- ============================================================
-- PROFILES
-- ============================================================

DROP POLICY IF EXISTS profiles_select_policy

ON profiles;



CREATE POLICY profiles_select_policy

ON profiles

FOR SELECT

TO authenticated

USING

(

    id = auth.uid()

    OR

    EXISTS

    (

        SELECT 1

        FROM organization_members om

        WHERE om.user_id = profiles.id

        AND user_has_organization_access(

            om.organization_id

        )

    )

);



DROP POLICY IF EXISTS profiles_update_policy

ON profiles;



CREATE POLICY profiles_update_policy

ON profiles

FOR UPDATE

TO authenticated

USING

(

    id = auth.uid()

);



-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================

DROP POLICY IF EXISTS organization_members_select_policy

ON organization_members;



CREATE POLICY organization_members_select_policy

ON organization_members

FOR SELECT

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



DROP POLICY IF EXISTS organization_members_insert_policy

ON organization_members;



CREATE POLICY organization_members_insert_policy

ON organization_members

FOR INSERT

TO authenticated

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



DROP POLICY IF EXISTS organization_members_update_policy

ON organization_members;



CREATE POLICY organization_members_update_policy

ON organization_members

FOR UPDATE

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



DROP POLICY IF EXISTS organization_members_delete_policy

ON organization_members;



CREATE POLICY organization_members_delete_policy

ON organization_members

FOR DELETE

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM pg_policies

WHERE policyname='organizations_select_policy'

)

THEN

RAISE EXCEPTION

'Organization RLS missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_policies

WHERE policyname='organization_members_select_policy'

)

THEN

RAISE EXCEPTION

'Membership RLS missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 010_rls.sql
-- PART 2
-- ADMIN SECURITY POLICIES
-- ============================================================

BEGIN;


-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE admin_organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_user_roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_user_permission_overrides ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_role_delegations ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_audit_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_feature_flags ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_feature_flag_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_organization_licenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_license_plans ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_plan_entitlements ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_platform_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_organization_settings ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- ORGANIZATION ADMINISTRATION
-- ============================================================

DROP POLICY IF EXISTS admin_org_access
ON admin_organizations;


CREATE POLICY admin_org_access

ON admin_organizations

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- ADMIN USERS
-- ============================================================

DROP POLICY IF EXISTS admin_users_access
ON admin_users;


CREATE POLICY admin_users_access

ON admin_users

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- ROLES
-- ============================================================

DROP POLICY IF EXISTS admin_roles_access
ON admin_roles;


CREATE POLICY admin_roles_access

ON admin_roles

FOR ALL

TO authenticated

USING

(

    organization_id IS NULL

    OR

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    organization_id IS NULL

    OR

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- PERMISSIONS
-- ============================================================

DROP POLICY IF EXISTS admin_permissions_read
ON admin_permissions;


CREATE POLICY admin_permissions_read

ON admin_permissions

FOR SELECT

TO authenticated

USING

(

    TRUE

);



-- ============================================================
-- USER ROLE ASSIGNMENTS
-- ============================================================

DROP POLICY IF EXISTS admin_user_roles_access
ON admin_user_roles;


CREATE POLICY admin_user_roles_access

ON admin_user_roles

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- ROLE PERMISSIONS
-- ============================================================

DROP POLICY IF EXISTS admin_role_permissions_access
ON admin_role_permissions;


CREATE POLICY admin_role_permissions_access

ON admin_role_permissions

FOR ALL

TO authenticated

USING

(

    is_platform_admin()

);



-- ============================================================
-- USER OVERRIDES
-- ============================================================

DROP POLICY IF EXISTS admin_permission_override_access
ON admin_user_permission_overrides;


CREATE POLICY admin_permission_override_access

ON admin_user_permission_overrides

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- AUDIT CENTER
-- ============================================================

DROP POLICY IF EXISTS admin_audit_read
ON admin_audit_events;


CREATE POLICY admin_audit_read

ON admin_audit_events

FOR SELECT

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- FEATURE FLAGS
-- ============================================================

DROP POLICY IF EXISTS admin_feature_access
ON admin_feature_flag_assignments;


CREATE POLICY admin_feature_access

ON admin_feature_flag_assignments

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- LICENSE SECURITY
-- ============================================================

DROP POLICY IF EXISTS admin_license_access
ON admin_organization_licenses;


CREATE POLICY admin_license_access

ON admin_organization_licenses

FOR SELECT

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



-- ============================================================
-- ORGANIZATION SETTINGS
-- ============================================================

DROP POLICY IF EXISTS admin_org_settings_access
ON admin_organization_settings;


CREATE POLICY admin_org_settings_access

ON admin_organization_settings

FOR ALL

TO authenticated

USING

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

)

WITH CHECK

(

    user_has_organization_access(

        organization_id

    )

    OR

    is_platform_admin()

);



COMMIT;
-- ============================================================
-- 010_rls.sql
-- PART 3
-- CRM SECURITY POLICIES
-- ============================================================

BEGIN;


-- ============================================================
-- ENABLE CRM RLS
-- ============================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

ALTER TABLE sales_pipelines ENABLE ROW LEVEL SECURITY;

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;



-- ============================================================
-- GENERIC CRM TENANT POLICY
-- ============================================================

CREATE OR REPLACE FUNCTION apply_crm_tenant_policy(

    target_table TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


EXECUTE format(

'

DROP POLICY IF EXISTS %I ON %I;


CREATE POLICY %I

ON %I

FOR ALL

TO authenticated

USING

(

 user_has_organization_access(

 organization_id

 )

 OR

 is_platform_admin()

)


WITH CHECK

(

 user_has_organization_access(

 organization_id

 )

 OR

 is_platform_admin()

);

',

target_table || '_tenant_policy',

target_table,

target_table || '_tenant_policy',

target_table

);



END;

$$;



-- ============================================================
-- APPLY CORE CRM POLICIES
-- ============================================================

SELECT apply_crm_tenant_policy('companies');

SELECT apply_crm_tenant_policy('contacts');

SELECT apply_crm_tenant_policy('leads');

SELECT apply_crm_tenant_policy('opportunities');

SELECT apply_crm_tenant_policy('sales_pipelines');

SELECT apply_crm_tenant_policy('pipeline_stages');

SELECT apply_crm_tenant_policy('activities');

SELECT apply_crm_tenant_policy('notes');

SELECT apply_crm_tenant_policy('attachments');

SELECT apply_crm_tenant_policy('tasks');

SELECT apply_crm_tenant_policy('quotations');

SELECT apply_crm_tenant_policy('contracts');

SELECT apply_crm_tenant_policy('projects');

SELECT apply_crm_tenant_policy('tickets');

SELECT apply_crm_tenant_policy('products');

SELECT apply_crm_tenant_policy('pricing_rules');

SELECT apply_crm_tenant_policy('invoices');

SELECT apply_crm_tenant_policy('payments');

SELECT apply_crm_tenant_policy('revenue_transactions');



-- ============================================================
-- ENTITY ENGINE READ VALIDATION
-- ============================================================

DROP POLICY IF EXISTS activities_entity_access

ON activities;



CREATE POLICY activities_entity_access

ON activities

FOR SELECT

TO authenticated

USING

(

user_has_organization_access(

organization_id

)

);



DROP POLICY IF EXISTS attachments_entity_access

ON attachments;



CREATE POLICY attachments_entity_access

ON attachments

FOR SELECT

TO authenticated

USING

(

user_has_organization_access(

organization_id

)

);



DROP POLICY IF EXISTS notes_entity_access

ON notes;



CREATE POLICY notes_entity_access

ON notes

FOR SELECT

TO authenticated

USING

(

user_has_organization_access(

organization_id

)

);



-- ============================================================
-- VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM pg_policies

WHERE policyname='companies_tenant_policy'

)

THEN

RAISE EXCEPTION

'CRM tenant policies missing';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM pg_policies

WHERE policyname='leads_tenant_policy'

)

THEN

RAISE EXCEPTION

'Lead RLS missing';


END IF;



END $$;



COMMIT;
-- ============================================================
-- 010_rls.sql
-- PART 4 FINAL
-- ERP + WEBSITE SECURITY POLICIES
-- ============================================================

BEGIN;


-- ============================================================
-- ENABLE ERP RLS
-- ============================================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE inventory_stock ENABLE ROW LEVEL SECURITY;

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

ALTER TABLE asset_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;



-- ============================================================
-- GENERIC ERP TENANT POLICY
-- ============================================================

CREATE OR REPLACE FUNCTION apply_erp_tenant_policy(

    target_table TEXT

)

RETURNS VOID

LANGUAGE plpgsql

AS $$

BEGIN


EXECUTE format(

'

DROP POLICY IF EXISTS %I ON %I;


CREATE POLICY %I

ON %I

FOR ALL

TO authenticated

USING

(

 user_has_organization_access(

 organization_id

 )

 OR

 is_platform_admin()

)


WITH CHECK

(

 user_has_organization_access(

 organization_id

 )

 OR

 is_platform_admin()

);

',

target_table || '_tenant_policy',

target_table,

target_table || '_tenant_policy',

target_table

);


END;

$$;



-- ============================================================
-- PROCUREMENT
-- ============================================================

SELECT apply_erp_tenant_policy('vendors');

SELECT apply_erp_tenant_policy('purchase_orders');



-- ============================================================
-- INVENTORY
-- ============================================================

SELECT apply_erp_tenant_policy('inventory_items');

SELECT apply_erp_tenant_policy('inventory_stock');

SELECT apply_erp_tenant_policy('inventory_transactions');

SELECT apply_erp_tenant_policy('warehouses');

SELECT apply_erp_tenant_policy('storage_locations');



-- ============================================================
-- MANUFACTURING
-- ============================================================

SELECT apply_erp_tenant_policy('production_orders');

SELECT apply_erp_tenant_policy('quality_checks');



-- ============================================================
-- FINANCE
-- ============================================================

SELECT apply_erp_tenant_policy('accounts');

SELECT apply_erp_tenant_policy('financial_transactions');

SELECT apply_erp_tenant_policy('expenses');



-- ============================================================
-- HR
-- ============================================================

SELECT apply_erp_tenant_policy('employees');

SELECT apply_erp_tenant_policy('attendance');

SELECT apply_erp_tenant_policy('leave_requests');



-- ============================================================
-- ASSET MANAGEMENT
-- ============================================================

SELECT apply_erp_tenant_policy('assets');

SELECT apply_erp_tenant_policy('asset_assignments');

SELECT apply_erp_tenant_policy('asset_maintenance');



-- ============================================================
-- WEBSITE PUBLIC CONTENT SECURITY
-- ============================================================

ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;

ALTER TABLE website_blog_posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE website_navigation ENABLE ROW LEVEL SECURITY;



DROP POLICY IF EXISTS website_public_pages

ON website_pages;



CREATE POLICY website_public_pages

ON website_pages

FOR SELECT

TO anon, authenticated

USING

(

status='published'

);



DROP POLICY IF EXISTS website_public_blog

ON website_blog_posts;



CREATE POLICY website_public_blog

ON website_blog_posts

FOR SELECT

TO anon, authenticated

USING

(

status='published'

);



DROP POLICY IF EXISTS website_navigation_public

ON website_navigation;



CREATE POLICY website_navigation_public

ON website_navigation

FOR SELECT

TO anon, authenticated

USING

(

is_active=true

);



-- ============================================================
-- FINAL RLS VALIDATION
-- ============================================================

DO $$

DECLARE

    rls_count INTEGER;


BEGIN


SELECT COUNT(*)

INTO rls_count

FROM pg_class

WHERE relrowsecurity = TRUE;



IF rls_count < 40

THEN

    RAISE EXCEPTION

    'Insufficient RLS coverage detected';

END IF;



END $$;



COMMIT;