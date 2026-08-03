-- ============================================================
-- 005_admin.sql
-- Abhimaan Digital Solutionz
-- Admin Platform Schema
-- PART 1
-- ============================================================

BEGIN;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE admin_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'archived'
);


CREATE TYPE configuration_scope AS ENUM (
    'platform',
    'organization',
    'user'
);


CREATE TYPE job_status AS ENUM (
    'pending',
    'running',
    'completed',
    'failed',
    'cancelled'
);


CREATE TYPE subscription_status AS ENUM (
    'trial',
    'active',
    'paused',
    'cancelled',
    'expired'
);


CREATE TYPE user_invitation_status AS ENUM (
    'pending',
    'accepted',
    'expired',
    'cancelled'
);


-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_platform_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key TEXT NOT NULL UNIQUE,

    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,

    description TEXT,

    scope configuration_scope NOT NULL DEFAULT 'platform',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- ORGANIZATION ADMINISTRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_organizations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    status admin_status DEFAULT 'active',

    display_name TEXT,

    configuration JSONB DEFAULT '{}'::jsonb,

    notes TEXT,

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ

);



CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_org_unique
ON admin_organizations(organization_id);



-- ============================================================
-- ORGANIZATION SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_organization_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    setting_key TEXT NOT NULL,

    setting_value JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(
        organization_id,
        setting_key
    )

);



-- ============================================================
-- USER ADMINISTRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    status admin_status DEFAULT 'active',

    admin_notes TEXT,

    last_login_at TIMESTAMPTZ,

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ

);



CREATE INDEX IF NOT EXISTS idx_admin_users_org
ON admin_users(organization_id);


CREATE INDEX IF NOT EXISTS idx_admin_users_user
ON admin_users(user_id);



-- ============================================================
-- USER INVITATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_user_invitations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    email TEXT NOT NULL,

    role_id UUID,

    status user_invitation_status
        DEFAULT 'pending',

    invitation_token TEXT UNIQUE,

    expires_at TIMESTAMPTZ,

    invited_by UUID REFERENCES profiles(id),

    accepted_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_admin_invites_org
ON admin_user_invitations(organization_id);


CREATE INDEX IF NOT EXISTS idx_admin_invites_email
ON admin_user_invitations(email);



-- ============================================================
-- ORGANIZATION FEATURES
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_organization_features (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    feature_key TEXT NOT NULL,

    enabled BOOLEAN DEFAULT FALSE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(
        organization_id,
        feature_key
    )

);



COMMIT;
-- ============================================================
-- 005_admin.sql
-- PART 2
-- RBAC ADMINISTRATION
-- ============================================================

BEGIN;


-- ============================================================
-- ADMIN ROLE REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    role_name TEXT NOT NULL,

    role_key TEXT NOT NULL,

    description TEXT,

    is_system_role BOOLEAN DEFAULT FALSE,

    status admin_status DEFAULT 'active',

    created_by UUID REFERENCES profiles(id),

    updated_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    UNIQUE(
        organization_id,
        role_key
    )

);



CREATE INDEX IF NOT EXISTS idx_admin_roles_org
ON admin_roles(organization_id);



CREATE INDEX IF NOT EXISTS idx_admin_roles_key
ON admin_roles(role_key);



-- ============================================================
-- PERMISSION MASTER REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    permission_key TEXT NOT NULL UNIQUE,

    module_name TEXT NOT NULL,

    action_name TEXT NOT NULL,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    is_system_permission BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_admin_permissions_module
ON admin_permissions(module_name);



-- ============================================================
-- ROLE PERMISSION MAPPING
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_role_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,

    permission_id UUID NOT NULL
        REFERENCES admin_permissions(id)
        ON DELETE CASCADE,


    granted BOOLEAN DEFAULT TRUE,


    created_by UUID REFERENCES profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        role_id,
        permission_id
    )

);



CREATE INDEX IF NOT EXISTS idx_role_permission_role
ON admin_role_permissions(role_id);



CREATE INDEX IF NOT EXISTS idx_role_permission_permission
ON admin_role_permissions(permission_id);



-- ============================================================
-- USER ROLE ASSIGNMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_user_roles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,


    is_primary BOOLEAN DEFAULT FALSE,


    assigned_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        user_id,
        organization_id,
        role_id
    )

);



CREATE INDEX IF NOT EXISTS idx_admin_user_roles_user
ON admin_user_roles(user_id);



CREATE INDEX IF NOT EXISTS idx_admin_user_roles_org
ON admin_user_roles(organization_id);



-- ============================================================
-- TEMPORARY ROLE DELEGATION
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_role_delegations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    delegator_user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    delegate_user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    role_id UUID NOT NULL
        REFERENCES admin_roles(id)
        ON DELETE CASCADE,


    start_date TIMESTAMPTZ NOT NULL,


    end_date TIMESTAMPTZ NOT NULL,


    reason TEXT,


    is_active BOOLEAN DEFAULT TRUE,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_role_delegation_org
ON admin_role_delegations(organization_id);



CREATE INDEX IF NOT EXISTS idx_role_delegation_delegate
ON admin_role_delegations(delegate_user_id);



-- ============================================================
-- USER ACCESS OVERRIDES
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_user_permission_overrides (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    permission_id UUID NOT NULL
        REFERENCES admin_permissions(id)
        ON DELETE CASCADE,


    granted BOOLEAN DEFAULT TRUE,


    reason TEXT,


    expires_at TIMESTAMPTZ,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        user_id,
        organization_id,
        permission_id
    )

);



CREATE INDEX IF NOT EXISTS idx_permission_override_user
ON admin_user_permission_overrides(user_id);



-- ============================================================
-- DEFAULT SYSTEM ROLES
-- ============================================================

INSERT INTO admin_roles
(
    role_name,
    role_key,
    description,
    is_system_role
)
VALUES

(
    'Platform Owner',
    'platform_owner',
    'Full system access',
    TRUE
),

(
    'Organization Administrator',
    'organization_admin',
    'Organization level administration',
    TRUE
),

(
    'Manager',
    'manager',
    'Business management access',
    TRUE
),

(
    'User',
    'user',
    'Standard user access',
    TRUE
)

ON CONFLICT DO NOTHING;



COMMIT;
-- ============================================================
-- 005_admin.sql
-- PART 3
-- AUDIT + LICENSING + SUBSCRIPTIONS
-- ============================================================

BEGIN;


-- ============================================================
-- ADMIN AUDIT CENTER
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_audit_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    user_id UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,


    event_type TEXT NOT NULL,


    module_name TEXT,


    entity_type TEXT,


    entity_id UUID,


    action TEXT NOT NULL,


    old_values JSONB DEFAULT '{}'::jsonb,


    new_values JSONB DEFAULT '{}'::jsonb,


    metadata JSONB DEFAULT '{}'::jsonb,


    ip_address INET,


    user_agent TEXT,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_admin_audit_org
ON admin_audit_events(organization_id);



CREATE INDEX IF NOT EXISTS idx_admin_audit_user
ON admin_audit_events(user_id);



CREATE INDEX IF NOT EXISTS idx_admin_audit_entity
ON admin_audit_events(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS idx_admin_audit_created
ON admin_audit_events(created_at);



-- ============================================================
-- FEATURE FLAG MASTER
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_feature_flags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    feature_key TEXT NOT NULL UNIQUE,


    feature_name TEXT NOT NULL,


    description TEXT,


    is_enabled BOOLEAN DEFAULT FALSE,


    rollout_percentage INTEGER DEFAULT 0,


    configuration JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- ORGANIZATION FEATURE OVERRIDES
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_feature_flag_assignments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    feature_flag_id UUID NOT NULL
        REFERENCES admin_feature_flags(id)
        ON DELETE CASCADE,


    enabled BOOLEAN DEFAULT FALSE,


    configuration JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        feature_flag_id
    )

);



CREATE INDEX IF NOT EXISTS idx_feature_assignment_org
ON admin_feature_flag_assignments(organization_id);



-- ============================================================
-- LICENSE PLANS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_license_plans (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    plan_code TEXT NOT NULL UNIQUE,


    plan_name TEXT NOT NULL,


    description TEXT,


    pricing JSONB DEFAULT '{}'::jsonb,


    limits JSONB DEFAULT '{}'::jsonb,


    features JSONB DEFAULT '{}'::jsonb,


    is_active BOOLEAN DEFAULT TRUE,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- ORGANIZATION LICENSES
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_organization_licenses (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    license_plan_id UUID NOT NULL
        REFERENCES admin_license_plans(id)
        ON DELETE RESTRICT,


    status subscription_status DEFAULT 'trial',


    start_date TIMESTAMPTZ DEFAULT NOW(),


    end_date TIMESTAMPTZ,


    auto_renew BOOLEAN DEFAULT FALSE,


    metadata JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_org_license_org
ON admin_organization_licenses(organization_id);



-- ============================================================
-- SUBSCRIPTION TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_subscription_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    license_id UUID NOT NULL
        REFERENCES admin_organization_licenses(id)
        ON DELETE CASCADE,


    previous_status subscription_status,


    new_status subscription_status NOT NULL,


    reason TEXT,


    changed_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_subscription_history_org
ON admin_subscription_history(organization_id);



-- ============================================================
-- PLAN ENTITLEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_plan_entitlements (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    license_plan_id UUID NOT NULL
        REFERENCES admin_license_plans(id)
        ON DELETE CASCADE,


    entitlement_key TEXT NOT NULL,


    entitlement_value JSONB DEFAULT '{}'::jsonb,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        license_plan_id,
        entitlement_key
    )

);



COMMIT;
-- ============================================================
-- 005_admin.sql
-- PART 4 FINAL
-- SYSTEM OPERATIONS + MONITORING
-- ============================================================

BEGIN;


-- ============================================================
-- SYSTEM JOB DEFINITIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_system_jobs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    job_name TEXT NOT NULL,


    job_key TEXT NOT NULL,


    description TEXT,


    schedule_expression TEXT,


    status job_status DEFAULT 'pending',


    enabled BOOLEAN DEFAULT TRUE,


    configuration JSONB DEFAULT '{}'::jsonb,


    last_run_at TIMESTAMPTZ,


    next_run_at TIMESTAMPTZ,


    created_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        job_key
    )

);



CREATE INDEX IF NOT EXISTS idx_admin_jobs_org
ON admin_system_jobs(organization_id);



CREATE INDEX IF NOT EXISTS idx_admin_jobs_status
ON admin_system_jobs(status);



-- ============================================================
-- JOB EXECUTION HISTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_job_executions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    job_id UUID NOT NULL
        REFERENCES admin_system_jobs(id)
        ON DELETE CASCADE,


    status job_status DEFAULT 'running',


    started_at TIMESTAMPTZ DEFAULT NOW(),


    completed_at TIMESTAMPTZ,


    execution_time_ms INTEGER,


    result JSONB DEFAULT '{}'::jsonb,


    error_message TEXT,


    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_job_execution_job
ON admin_job_executions(job_id);



CREATE INDEX IF NOT EXISTS idx_job_execution_status
ON admin_job_executions(status);



-- ============================================================
-- PLATFORM HEALTH MONITORING
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_platform_health_metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    metric_name TEXT NOT NULL,


    metric_category TEXT NOT NULL,


    metric_value JSONB DEFAULT '{}'::jsonb,


    severity TEXT DEFAULT 'normal',


    recorded_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_health_metric_category
ON admin_platform_health_metrics(metric_category);



CREATE INDEX IF NOT EXISTS idx_health_metric_time
ON admin_platform_health_metrics(recorded_at);



-- ============================================================
-- ERROR TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_error_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    user_id UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,


    error_code TEXT,


    error_message TEXT NOT NULL,


    stack_trace TEXT,


    module_name TEXT,


    endpoint TEXT,


    metadata JSONB DEFAULT '{}'::jsonb,


    resolved BOOLEAN DEFAULT FALSE,


    resolved_by UUID REFERENCES profiles(id),


    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS idx_error_logs_org
ON admin_error_logs(organization_id);



CREATE INDEX IF NOT EXISTS idx_error_logs_resolved
ON admin_error_logs(resolved);



-- ============================================================
-- GLOBAL CONFIGURATION REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_configuration_registry (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    configuration_key TEXT NOT NULL UNIQUE,


    configuration_value JSONB DEFAULT '{}'::jsonb,


    scope configuration_scope DEFAULT 'platform',


    description TEXT,


    is_encrypted BOOLEAN DEFAULT FALSE,


    created_at TIMESTAMPTZ DEFAULT NOW(),


    updated_at TIMESTAMPTZ DEFAULT NOW()

);



-- ============================================================
-- ADMIN DASHBOARD METRICS CACHE
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_dashboard_metrics (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    organization_id UUID
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    metric_key TEXT NOT NULL,


    metric_value JSONB DEFAULT '{}'::jsonb,


    generated_at TIMESTAMPTZ DEFAULT NOW(),


    UNIQUE(
        organization_id,
        metric_key
    )

);



CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_org
ON admin_dashboard_metrics(organization_id);



-- ============================================================
-- ADMIN MODULE VALIDATION
-- ============================================================

DO $$

BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'admin_roles'
    )
    THEN

        RAISE EXCEPTION 
        'Admin RBAC tables missing';

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'admin_feature_flags'
    )
    THEN

        RAISE EXCEPTION 
        'Feature flag system missing';

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'admin_system_jobs'
    )
    THEN

        RAISE EXCEPTION
        'System jobs missing';

    END IF;


END $$;



COMMIT;