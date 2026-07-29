BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ADMIN RBAC FOUNDATION
-- Migration : 011
-- ============================================================================
-- Purpose
-- Enterprise Role Based Access Control foundation.
--
-- Supports:
-- Platform Administration
-- CRM Security
-- Organization Roles
-- Delegated Administration
-- Permission Management
-- Future Enterprise Modules
--
-- Principles:
-- Least privilege
-- Organization aware
-- Permission driven
-- Extensible
-- Audit compatible
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS admin;



-- ============================================================================
-- PERMISSION CATALOG
-- ============================================================================
-- Master list of all platform capabilities.
--
-- Example:
-- crm.leads.view
-- crm.leads.create
-- admin.users.manage
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    permission_code TEXT NOT NULL UNIQUE,

    permission_name TEXT NOT NULL,

    module_name TEXT NOT NULL,

    permission_group TEXT,

    description TEXT,

    permission_type TEXT DEFAULT 'ACTION',

    system_permission BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_permissions_module
ON admin.permissions(module_name);



CREATE INDEX IF NOT EXISTS
idx_permissions_group
ON admin.permissions(permission_group);



CREATE INDEX IF NOT EXISTS
idx_permissions_status
ON admin.permissions(active);



-- ============================================================================
-- ROLE DEFINITIONS
-- ============================================================================
-- Organization and platform roles.
--
-- Examples:
-- Super Admin
-- Organization Admin
-- Manager
-- Sales User
-- Viewer
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_code TEXT NOT NULL UNIQUE,

    role_name TEXT NOT NULL,

    role_type TEXT DEFAULT 'ORGANIZATION',

    description TEXT,

    hierarchy_level INTEGER DEFAULT 0,

    is_system_role BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_roles_type
ON admin.roles(role_type);



CREATE INDEX IF NOT EXISTS
idx_roles_active
ON admin.roles(active);



-- ============================================================================
-- ROLE PERMISSION MAPPING
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.role_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL,

    permission_id UUID NOT NULL,

    granted BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_role_permission_role

    FOREIGN KEY(role_id)

    REFERENCES admin.roles(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_role_permission_permission

    FOREIGN KEY(permission_id)

    REFERENCES admin.permissions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_role_permission

    UNIQUE(
        role_id,
        permission_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_role_permission_role
ON admin.role_permissions(role_id);



CREATE INDEX IF NOT EXISTS
idx_role_permission_permission
ON admin.role_permissions(permission_id);



-- ============================================================================
-- USER ROLE ASSIGNMENTS
-- ============================================================================
-- Organization-aware role assignment.
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.user_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,

    role_id UUID NOT NULL,

    assigned_by UUID,

    expires_at TIMESTAMPTZ,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_user_role

    FOREIGN KEY(role_id)

    REFERENCES admin.roles(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_user_role

    UNIQUE(
        organization_id,
        user_id,
        role_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_user_roles_org
ON admin.user_roles(organization_id);



CREATE INDEX IF NOT EXISTS
idx_user_roles_user
ON admin.user_roles(user_id);



-- ============================================================================
-- ROLE GROUPS
-- ============================================================================
-- Supports permission bundling.
--
-- Example:
-- Sales Team
-- Finance Team
-- Support Team
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.role_groups (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    group_code TEXT NOT NULL UNIQUE,

    group_name TEXT NOT NULL,

    description TEXT,

    module_scope TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_role_groups_module
ON admin.role_groups(module_scope);



-- ============================================================================
-- ROLE GROUP MEMBERSHIP
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.role_group_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_group_id UUID NOT NULL,

    role_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_group_role_group

    FOREIGN KEY(role_group_id)

    REFERENCES admin.role_groups(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_group_role_role

    FOREIGN KEY(role_id)

    REFERENCES admin.roles(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_role_group_member

    UNIQUE(
        role_group_id,
        role_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_role_group_members_group
ON admin.role_group_members(role_group_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'permissions',

        'roles',

        'role_groups'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON admin.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON admin.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- DEFAULT ENTERPRISE PERMISSIONS
-- ============================================================================
-- Core permissions for:
-- Admin
-- CRM
-- Platform
-- Future Enterprise Modules
-- ============================================================================


INSERT INTO admin.permissions
(
    permission_code,
    permission_name,
    module_name,
    permission_group,
    description,
    system_permission
)

VALUES


-- PLATFORM

(
    'platform.settings.view',
    'View Platform Settings',
    'PLATFORM',
    'SETTINGS',
    'View platform configuration',
    TRUE
),

(
    'platform.settings.manage',
    'Manage Platform Settings',
    'PLATFORM',
    'SETTINGS',
    'Modify platform configuration',
    TRUE
),


-- ADMIN USERS

(
    'admin.users.view',
    'View Users',
    'ADMIN',
    'USER_MANAGEMENT',
    'View users',
    TRUE
),

(
    'admin.users.manage',
    'Manage Users',
    'ADMIN',
    'USER_MANAGEMENT',
    'Create update deactivate users',
    TRUE
),


-- ORGANIZATION

(
    'organization.settings.view',
    'View Organization Settings',
    'ORGANIZATION',
    'SETTINGS',
    'View organization settings',
    TRUE
),

(
    'organization.settings.manage',
    'Manage Organization Settings',
    'ORGANIZATION',
    'SETTINGS',
    'Modify organization settings',
    TRUE
),


-- CRM LEADS

(
    'crm.leads.view',
    'View Leads',
    'CRM',
    'SALES',
    'View CRM leads',
    FALSE
),

(
    'crm.leads.create',
    'Create Leads',
    'CRM',
    'SALES',
    'Create CRM leads',
    FALSE
),

(
    'crm.leads.update',
    'Update Leads',
    'CRM',
    'SALES',
    'Update CRM leads',
    FALSE
),

(
    'crm.leads.delete',
    'Delete Leads',
    'CRM',
    'SALES',
    'Delete CRM leads',
    FALSE
),


-- CRM COMPANIES

(
    'crm.companies.view',
    'View Companies',
    'CRM',
    'CUSTOMER_MANAGEMENT',
    'View companies',
    FALSE
),

(
    'crm.companies.manage',
    'Manage Companies',
    'CRM',
    'CUSTOMER_MANAGEMENT',
    'Manage companies',
    FALSE
),


-- AUDIT

(
    'audit.view',
    'View Audit Logs',
    'SECURITY',
    'AUDIT',
    'View audit history',
    TRUE
),


-- SECURITY

(
    'security.manage',
    'Manage Security Settings',
    'SECURITY',
    'SECURITY',
    'Manage security configuration',
    TRUE
)


ON CONFLICT(permission_code)
DO NOTHING;



-- ============================================================================
-- DEFAULT ENTERPRISE ROLES
-- ============================================================================


INSERT INTO admin.roles
(
    role_code,
    role_name,
    role_type,
    description,
    hierarchy_level,
    is_system_role
)

VALUES


(
    'SUPER_ADMIN',
    'Super Administrator',
    'PLATFORM',
    'Full platform access',
    100,
    TRUE
),


(
    'ORG_ADMIN',
    'Organization Administrator',
    'ORGANIZATION',
    'Organization administration access',
    90,
    TRUE
),


(
    'MANAGER',
    'Manager',
    'ORGANIZATION',
    'Team management access',
    70,
    TRUE
),


(
    'SALES_USER',
    'Sales User',
    'ORGANIZATION',
    'CRM sales access',
    50,
    TRUE
),


(
    'SUPPORT_USER',
    'Support User',
    'ORGANIZATION',
    'Customer support access',
    40,
    TRUE
),


(
    'VIEWER',
    'Viewer',
    'ORGANIZATION',
    'Read only access',
    10,
    TRUE
)


ON CONFLICT(role_code)
DO NOTHING;



-- ============================================================================
-- SUPER ADMIN PERMISSION ASSIGNMENT
-- ============================================================================


INSERT INTO admin.role_permissions
(
    role_id,
    permission_id
)

SELECT

r.id,

p.id

FROM admin.roles r

CROSS JOIN admin.permissions p

WHERE

r.role_code = 'SUPER_ADMIN'

ON CONFLICT(
    role_id,
    permission_id
)

DO NOTHING;



-- ============================================================================
-- ORGANIZATION ADMIN PERMISSIONS
-- ============================================================================


INSERT INTO admin.role_permissions
(
    role_id,
    permission_id
)

SELECT

r.id,

p.id

FROM admin.roles r

JOIN admin.permissions p

ON p.permission_code IN

(

'organization.settings.view',

'organization.settings.manage',

'admin.users.view',

'admin.users.manage',

'crm.leads.view',

'crm.leads.create',

'crm.leads.update',

'crm.companies.view',

'crm.companies.manage',

'audit.view'

)

WHERE

r.role_code='ORG_ADMIN'


ON CONFLICT(
role_id,
permission_id
)

DO NOTHING;



-- ============================================================================
-- SALES USER PERMISSIONS
-- ============================================================================


INSERT INTO admin.role_permissions
(
    role_id,
    permission_id
)

SELECT

r.id,

p.id

FROM admin.roles r

JOIN admin.permissions p

ON p.permission_code IN

(

'crm.leads.view',

'crm.leads.create',

'crm.leads.update',

'crm.companies.view'

)

WHERE

r.role_code='SALES_USER'


ON CONFLICT(
role_id,
permission_id
)

DO NOTHING;



-- ============================================================================
-- RBAC VALIDATION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW admin.v_role_permission_matrix AS

SELECT

r.role_code,

r.role_name,

p.permission_code,

p.permission_name,

p.module_name

FROM admin.roles r

JOIN admin.role_permissions rp

ON rp.role_id=r.id

JOIN admin.permissions p

ON p.id=rp.permission_id

WHERE

rp.granted = TRUE

ORDER BY

r.hierarchy_level DESC,

p.module_name,

p.permission_code;



-- ============================================================================
-- RBAC HEALTH CHECK
-- ============================================================================


CREATE OR REPLACE VIEW admin.v_rbac_health AS

SELECT

'ROLES' AS check_name,

COUNT(*) AS total_records,

CASE

WHEN COUNT(*) >= 6

THEN 'PASS'

ELSE 'FAIL'

END AS status

FROM admin.roles


UNION ALL


SELECT

'PERMISSIONS',

COUNT(*),

CASE

WHEN COUNT(*) >= 10

THEN 'PASS'

ELSE 'FAIL'

END

FROM admin.permissions;



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
    11,
    '011_admin_rbac.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

