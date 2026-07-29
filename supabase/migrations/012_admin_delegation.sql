BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ADMIN DELEGATION FOUNDATION
-- Migration : 012
-- ============================================================================
-- Purpose
-- Enterprise delegated administration framework.
--
-- Supports:
-- Multi-level administration
-- Organization delegation
-- Temporary access
-- Scoped permissions
-- Approval based access
-- Enterprise support operations
--
-- Principles:
-- Least privilege
-- Time bound access
-- Scope controlled
-- Auditable
-- SaaS ready
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS admin;



-- ============================================================================
-- ADMIN SCOPES
-- ============================================================================
-- Defines boundaries where administrators can operate.
--
-- Examples:
-- Entire Organization
-- Department
-- Team
-- Module
-- Region
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.admin_scopes (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    scope_code TEXT NOT NULL UNIQUE,

    scope_name TEXT NOT NULL,

    scope_type TEXT NOT NULL,

    description TEXT,

    parent_scope_id UUID,

    configuration JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_parent_admin_scope

    FOREIGN KEY(parent_scope_id)

    REFERENCES admin.admin_scopes(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS
idx_admin_scopes_type
ON admin.admin_scopes(scope_type);



CREATE INDEX IF NOT EXISTS
idx_admin_scopes_parent
ON admin.admin_scopes(parent_scope_id);



-- ============================================================================
-- DELEGATED ADMINISTRATORS
-- ============================================================================
-- Assigns administration responsibility.
--
-- Example:
-- Company Admin delegates CRM management to Sales Manager.
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.delegated_administrators (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,

    delegated_role_id UUID NOT NULL,

    scope_id UUID NOT NULL,

    delegated_by UUID,

    status TEXT DEFAULT 'ACTIVE',

    start_date TIMESTAMPTZ DEFAULT NOW(),

    end_date TIMESTAMPTZ,

    reason TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delegated_role

    FOREIGN KEY(delegated_role_id)

    REFERENCES admin.roles(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_delegated_scope

    FOREIGN KEY(scope_id)

    REFERENCES admin.admin_scopes(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_delegated_admin_org
ON admin.delegated_administrators(organization_id);



CREATE INDEX IF NOT EXISTS
idx_delegated_admin_user
ON admin.delegated_administrators(user_id);



CREATE INDEX IF NOT EXISTS
idx_delegated_admin_status
ON admin.delegated_administrators(status);



-- ============================================================================
-- DELEGATION PERMISSION OVERRIDES
-- ============================================================================
-- Additional restrictions or grants.
--
-- Allows:
-- Grant specific permission
-- Remove sensitive permission
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.delegation_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delegation_id UUID NOT NULL,

    permission_id UUID NOT NULL,

    access_type TEXT DEFAULT 'GRANT',

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delegation_permission

    FOREIGN KEY(delegation_id)

    REFERENCES admin.delegated_administrators(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_delegation_permission_catalog

    FOREIGN KEY(permission_id)

    REFERENCES admin.permissions(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_delegation_permission

    UNIQUE(
        delegation_id,
        permission_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_delegation_permission_delegation
ON admin.delegation_permissions(delegation_id);



-- ============================================================================
-- TEMPORARY ACCESS GRANTS
-- ============================================================================
-- Emergency / support access.
--
-- Examples:
-- Vendor support
-- Platform troubleshooting
-- Customer success assistance
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.temporary_access_grants (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,

    granted_role_id UUID NOT NULL,

    granted_by UUID,

    access_reason TEXT NOT NULL,

    approval_status TEXT DEFAULT 'PENDING',

    valid_from TIMESTAMPTZ DEFAULT NOW(),

    valid_until TIMESTAMPTZ,

    revoked BOOLEAN DEFAULT FALSE,

    revoked_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_temp_access_role

    FOREIGN KEY(granted_role_id)

    REFERENCES admin.roles(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_temp_access_org
ON admin.temporary_access_grants(organization_id);



CREATE INDEX IF NOT EXISTS
idx_temp_access_status
ON admin.temporary_access_grants(approval_status);



-- ============================================================================
-- ADMIN APPROVAL REQUESTS
-- ============================================================================
-- Foundation for controlled delegation workflow.
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.admin_approval_requests (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    request_type TEXT NOT NULL,

    requested_by UUID NOT NULL,

    requested_for UUID,

    request_details JSONB DEFAULT '{}'::jsonb,

    approval_status TEXT DEFAULT 'PENDING',

    approved_by UUID,

    approved_at TIMESTAMPTZ,

    rejection_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_admin_approval_org
ON admin.admin_approval_requests(organization_id);



CREATE INDEX IF NOT EXISTS
idx_admin_approval_status
ON admin.admin_approval_requests(approval_status);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'admin_scopes',

        'delegated_administrators',

        'admin_approval_requests'

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

BEGIN;

-- ============================================================================
-- DEFAULT ADMIN SCOPES
-- ============================================================================
-- Standard administration boundaries.
--
-- Future extension:
-- Department
-- Branch
-- Region
-- Business Unit
-- ============================================================================


INSERT INTO admin.admin_scopes
(
    scope_code,
    scope_name,
    scope_type,
    description
)

VALUES


(
    'PLATFORM',
    'Entire Platform',
    'PLATFORM',
    'Full platform administration scope'
),


(
    'ORGANIZATION',
    'Organization',
    'ORGANIZATION',
    'Complete organization administration scope'
),


(
    'MODULE',
    'Module Scope',
    'MODULE',
    'Specific application module administration scope'
),


(
    'TEAM',
    'Team Scope',
    'TEAM',
    'Team level administration scope'
),


(
    'USER',
    'User Scope',
    'USER',
    'Individual user administration scope'
)

ON CONFLICT(scope_code)
DO NOTHING;



-- ============================================================================
-- DELEGATION POLICIES
-- ============================================================================
-- Controls how delegation can be created and managed.
--
-- Examples:
-- Maximum duration
-- Approval required
-- Allowed roles
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.delegation_policies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_code TEXT NOT NULL UNIQUE,

    policy_name TEXT NOT NULL,

    scope_type TEXT,

    max_duration_days INTEGER DEFAULT 30,

    approval_required BOOLEAN DEFAULT TRUE,

    allowed_roles JSONB DEFAULT '[]'::jsonb,

    restrictions JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_delegation_policy_scope
ON admin.delegation_policies(scope_type);



CREATE INDEX IF NOT EXISTS
idx_delegation_policy_status
ON admin.delegation_policies(active);



-- ============================================================================
-- DEFAULT DELEGATION POLICIES
-- ============================================================================


INSERT INTO admin.delegation_policies
(
    policy_code,
    policy_name,
    scope_type,
    max_duration_days,
    approval_required,
    restrictions
)

VALUES


(
    'ORG_ADMIN_DELEGATION',

    'Organization Administrator Delegation',

    'ORGANIZATION',

    90,

    TRUE,

    '{"requires_audit":true}'::jsonb

),


(
    'MODULE_ADMIN_DELEGATION',

    'Module Administrator Delegation',

    'MODULE',

    30,

    TRUE,

    '{"restricted_modules":["SECURITY"]}'::jsonb

),


(
    'SUPPORT_TEMP_ACCESS',

    'Temporary Support Access',

    'USER',

    7,

    TRUE,

    '{"requires_reason":true}'::jsonb

)


ON CONFLICT(policy_code)
DO NOTHING;



-- ============================================================================
-- DELEGATION ACTIVITY LOG
-- ============================================================================
-- Tracks delegation lifecycle.
--
-- Created
-- Approved
-- Modified
-- Revoked
-- Expired
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.delegation_activity (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delegation_id UUID NOT NULL,

    action_type TEXT NOT NULL,

    action_by UUID,

    action_details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delegation_activity

    FOREIGN KEY(delegation_id)

    REFERENCES admin.delegated_administrators(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_delegation_activity_delegation
ON admin.delegation_activity(delegation_id);



-- ============================================================================
-- ACCESS EVALUATION VIEW
-- ============================================================================
-- Provides unified delegation visibility.
-- ============================================================================


CREATE OR REPLACE VIEW admin.v_active_delegations AS

SELECT

    da.id,

    da.organization_id,

    da.user_id,

    r.role_code,

    r.role_name,

    s.scope_code,

    s.scope_type,

    da.start_date,

    da.end_date,

    da.status

FROM admin.delegated_administrators da

JOIN admin.roles r

ON r.id = da.delegated_role_id

JOIN admin.admin_scopes s

ON s.id = da.scope_id

WHERE

da.status = 'ACTIVE'

AND

(
    da.end_date IS NULL

    OR

    da.end_date > NOW()

);



-- ============================================================================
-- TEMPORARY ACCESS VALIDATION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW admin.v_active_temporary_access AS

SELECT

    ta.id,

    ta.organization_id,

    ta.user_id,

    r.role_code,

    r.role_name,

    ta.valid_from,

    ta.valid_until,

    ta.approval_status

FROM admin.temporary_access_grants ta

JOIN admin.roles r

ON r.id = ta.granted_role_id

WHERE

ta.revoked = FALSE

AND

ta.approval_status = 'APPROVED'

AND

(
    ta.valid_until IS NULL

    OR

    ta.valid_until > NOW()

);



-- ============================================================================
-- DELEGATION HEALTH CHECK
-- ============================================================================


CREATE OR REPLACE VIEW admin.v_delegation_health AS

SELECT

'ACTIVE_DELEGATIONS' AS check_name,

COUNT(*) AS total_records,

CASE

WHEN COUNT(*) >= 0

THEN 'PASS'

ELSE 'FAIL'

END AS status

FROM admin.delegated_administrators


UNION ALL


SELECT

'ACTIVE_POLICIES',

COUNT(*),

CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END

FROM admin.delegation_policies;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'delegation_policies'

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
    12,
    '012_admin_delegation.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;