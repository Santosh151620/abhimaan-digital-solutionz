BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- SECURITY • RLS • RBAC FOUNDATION
-- Migration : 004
-- ============================================================================
-- Purpose
-- Enterprise Security
-- Role Based Access
-- Permission Engine
-- Row Level Security
-- Authentication Foundation
-- Zero Trust Preparation
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS security;

-- ============================================================================
-- SYSTEM ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_code TEXT NOT NULL UNIQUE,

    role_name TEXT NOT NULL,

    hierarchy_level INTEGER NOT NULL,

    description TEXT,

    system_role BOOLEAN DEFAULT TRUE,

    assignable BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_security_roles_level
ON security.roles(hierarchy_level);

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    permission_code TEXT NOT NULL UNIQUE,

    module_name TEXT NOT NULL,

    resource_name TEXT NOT NULL,

    action_name TEXT NOT NULL,

    description TEXT,

    system_permission BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_permissions_module
ON security.permissions(module_name);

CREATE INDEX IF NOT EXISTS
idx_permissions_resource
ON security.permissions(resource_name);

-- ============================================================================
-- ROLE PERMISSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.role_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL,

    permission_id UUID NOT NULL,

    allow_access BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_role_permission_role
        FOREIGN KEY(role_id)
        REFERENCES security.roles(id),

    CONSTRAINT fk_role_permission_permission
        FOREIGN KEY(permission_id)
        REFERENCES security.permissions(id),

    CONSTRAINT uq_role_permission
        UNIQUE(role_id, permission_id)

);

CREATE INDEX IF NOT EXISTS
idx_role_permission_role
ON security.role_permissions(role_id);

CREATE INDEX IF NOT EXISTS
idx_role_permission_permission
ON security.role_permissions(permission_id);

-- ============================================================================
-- USER ROLE ASSIGNMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.user_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    profile_id UUID NOT NULL,

    role_id UUID NOT NULL,

    assigned_by UUID,

    assigned_at TIMESTAMPTZ DEFAULT NOW(),

    expires_at TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT fk_user_role_role
        FOREIGN KEY(role_id)
        REFERENCES security.roles(id)

);

CREATE INDEX IF NOT EXISTS
idx_user_roles_profile
ON security.user_roles(profile_id);

CREATE INDEX IF NOT EXISTS
idx_user_roles_org
ON security.user_roles(organization_id);
-- ============================================================================
-- SECURITY POLICIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.security_policies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_code TEXT NOT NULL UNIQUE,

    policy_name TEXT NOT NULL,

    category TEXT NOT NULL,

    description TEXT,

    severity TEXT DEFAULT 'Medium',

    enabled BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_security_policy_category
ON security.security_policies(category);

-- ============================================================================
-- LOGIN HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.login_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    profile_id UUID,

    login_at TIMESTAMPTZ DEFAULT NOW(),

    logout_at TIMESTAMPTZ,

    ip_address TEXT,

    user_agent TEXT,

    device_name TEXT,

    platform TEXT,

    browser TEXT,

    success BOOLEAN DEFAULT TRUE,

    failure_reason TEXT,

    metadata JSONB DEFAULT '{}'::jsonb

);

CREATE INDEX IF NOT EXISTS
idx_login_profile
ON security.login_history(profile_id);

CREATE INDEX IF NOT EXISTS
idx_login_org
ON security.login_history(organization_id);

CREATE INDEX IF NOT EXISTS
idx_login_date
ON security.login_history(login_at);

-- ============================================================================
-- API KEYS
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.api_keys (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    key_name TEXT NOT NULL,

    key_hash TEXT NOT NULL,

    description TEXT,

    scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

    expires_at TIMESTAMPTZ,

    last_used_at TIMESTAMPTZ,

    created_by UUID,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_api_key_org
ON security.api_keys(organization_id);

CREATE INDEX IF NOT EXISTS
idx_api_key_active
ON security.api_keys(active);

-- ============================================================================
-- SECURITY EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.security_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    profile_id UUID,

    event_type TEXT NOT NULL,

    severity TEXT DEFAULT 'Low',

    module_name TEXT,

    entity_type TEXT,

    entity_id UUID,

    description TEXT,

    ip_address TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    occurred_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_security_events_org
ON security.security_events(organization_id);

CREATE INDEX IF NOT EXISTS
idx_security_events_type
ON security.security_events(event_type);

CREATE INDEX IF NOT EXISTS
idx_security_events_time
ON security.security_events(occurred_at);

-- ============================================================================
-- PASSWORD POLICIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS security.password_policies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_name TEXT NOT NULL,

    minimum_length INTEGER DEFAULT 12,

    require_uppercase BOOLEAN DEFAULT TRUE,

    require_lowercase BOOLEAN DEFAULT TRUE,

    require_numeric BOOLEAN DEFAULT TRUE,

    require_special BOOLEAN DEFAULT TRUE,

    password_expiry_days INTEGER DEFAULT 90,

    password_history INTEGER DEFAULT 5,

    maximum_failed_attempts INTEGER DEFAULT 5,

    account_lock_minutes INTEGER DEFAULT 30,

    enabled BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_password_policy_enabled
ON security.password_policies(enabled);
-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

DO
$$
DECLARE
    tbl TEXT;
BEGIN

    FOREACH tbl IN ARRAY ARRAY[
        'roles',
        'permissions',
        'security_policies',
        'api_keys',
        'password_policies'
    ]
    LOOP

        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated ON security.%1$s;',
            tbl
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON security.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );

    END LOOP;

END;
$$;

-- ============================================================================
-- DEFAULT ENTERPRISE ROLES
-- ============================================================================

INSERT INTO security.roles
(
    role_code,
    role_name,
    hierarchy_level,
    description
)
VALUES
(
    'PLATFORM_OWNER',
    'Platform Owner',
    1,
    'Abhimaan Digital Solutionz Platform Owner'
),
(
    'PLATFORM_ADMIN',
    'Platform Administrator',
    2,
    'ADS Operations Team'
),
(
    'ORG_ADMIN',
    'Organization Administrator',
    3,
    'Customer Organization Administrator'
),
(
    'DEPARTMENT_ADMIN',
    'Department Administrator',
    4,
    'Department Administrator'
),
(
    'TEAM_LEAD',
    'Team Lead',
    5,
    'Team Lead'
),
(
    'USER',
    'User',
    6,
    'Standard User'
)
ON CONFLICT(role_code)
DO NOTHING;

-- ============================================================================
-- DEFAULT SECURITY POLICIES
-- ============================================================================

INSERT INTO security.security_policies
(
    policy_code,
    policy_name,
    category,
    severity
)
VALUES
(
    'PASSWORD_POLICY',
    'Enterprise Password Policy',
    'Authentication',
    'High'
),
(
    'MFA_POLICY',
    'Multi Factor Authentication',
    'Authentication',
    'High'
),
(
    'SESSION_POLICY',
    'Session Management',
    'Authentication',
    'Medium'
),
(
    'API_POLICY',
    'API Security',
    'Integration',
    'High'
),
(
    'AUDIT_POLICY',
    'Audit Logging',
    'Compliance',
    'Medium'
)
ON CONFLICT(policy_code)
DO NOTHING;

-- ============================================================================
-- DEFAULT PASSWORD POLICY
-- ============================================================================

INSERT INTO security.password_policies
(
    policy_name,
    minimum_length,
    require_uppercase,
    require_lowercase,
    require_numeric,
    require_special,
    password_expiry_days,
    password_history,
    maximum_failed_attempts,
    account_lock_minutes
)
VALUES
(
    'Enterprise Default',
    12,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    90,
    5,
    5,
    30
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.organizations
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.organization_members
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECURITY FOUNDATION COMPLETE
-- ============================================================================

COMMIT;