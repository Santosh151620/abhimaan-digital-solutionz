BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ADMIN FOUNDATION
-- Migration : 010
-- ============================================================================
-- Purpose
-- Establish enterprise administration foundation:
--
-- Platform Configuration
-- Organization Settings
-- Feature Management
-- System Preferences
-- Environment Controls
-- SaaS / On-Prem Compatibility
--
-- Principles:
-- Centralized administration
-- Tenant aware
-- Configuration driven
-- No hard-coded business rules
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS admin;



-- ============================================================================
-- ORGANIZATION SETTINGS
-- ============================================================================
-- Tenant-level configuration
--
-- Examples:
-- Branding
-- Regional settings
-- Feature preferences
-- Business defaults
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.organization_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL UNIQUE,

    setting_category TEXT NOT NULL,

    settings JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_by UUID,

    updated_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_org_settings_org
ON admin.organization_settings(organization_id);



CREATE INDEX IF NOT EXISTS
idx_org_settings_category
ON admin.organization_settings(setting_category);



-- ============================================================================
-- PLATFORM CONFIGURATION
-- ============================================================================
-- Global platform controls
--
-- Used by:
-- Admin Portal
-- Feature Management
-- Runtime Configuration
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.platform_configuration (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    config_key TEXT NOT NULL UNIQUE,

    config_value JSONB DEFAULT '{}'::jsonb,

    config_type TEXT DEFAULT 'SYSTEM',

    description TEXT,

    environment TEXT DEFAULT 'PRODUCTION',

    editable BOOLEAN DEFAULT TRUE,

    created_by UUID,

    updated_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_platform_configuration_type
ON admin.platform_configuration(config_type);



CREATE INDEX IF NOT EXISTS
idx_platform_configuration_environment
ON admin.platform_configuration(environment);



-- ============================================================================
-- FEATURE FLAGS
-- ============================================================================
-- Enables controlled rollout:
--
-- New CRM modules
-- AI capabilities
-- Enterprise features
-- Beta releases
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.feature_flags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    feature_code TEXT NOT NULL UNIQUE,

    feature_name TEXT NOT NULL,

    description TEXT,

    module_name TEXT,

    enabled BOOLEAN DEFAULT FALSE,

    rollout_percentage INTEGER DEFAULT 0,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_feature_flags_module
ON admin.feature_flags(module_name);



CREATE INDEX IF NOT EXISTS
idx_feature_flags_status
ON admin.feature_flags(enabled);



-- ============================================================================
-- SYSTEM PREFERENCES
-- ============================================================================
-- Application-wide defaults
--
-- Examples:
-- Date format
-- Language
-- Notification defaults
-- Security defaults
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.system_preferences (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    preference_key TEXT NOT NULL UNIQUE,

    preference_value JSONB DEFAULT '{}'::jsonb,

    preference_group TEXT DEFAULT 'GENERAL',

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_system_preferences_group
ON admin.system_preferences(preference_group);



-- ============================================================================
-- ADMIN MODULE REGISTRY
-- ============================================================================
-- Controls available admin capabilities
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.module_registry (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    module_code TEXT NOT NULL UNIQUE,

    module_name TEXT NOT NULL,

    module_type TEXT DEFAULT 'PLATFORM',

    description TEXT,

    enabled BOOLEAN DEFAULT TRUE,

    display_order INTEGER DEFAULT 0,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_admin_module_status
ON admin.module_registry(enabled);



CREATE INDEX IF NOT EXISTS
idx_admin_module_order
ON admin.module_registry(display_order);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'organization_settings',

        'platform_configuration',

        'feature_flags',

        'system_preferences',

        'module_registry'

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
-- ADMIN CONFIGURATION HISTORY
-- ============================================================================
-- Tracks changes to platform and organization configurations.
--
-- Supports:
-- Change management
-- Compliance
-- Rollback analysis
-- Enterprise audit
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.configuration_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    configuration_type TEXT NOT NULL,

    configuration_id UUID NOT NULL,

    previous_value JSONB DEFAULT '{}'::jsonb,

    new_value JSONB DEFAULT '{}'::jsonb,

    change_reason TEXT,

    changed_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_configuration_history_type
ON admin.configuration_history(configuration_type);



CREATE INDEX IF NOT EXISTS
idx_configuration_history_id
ON admin.configuration_history(configuration_id);



CREATE INDEX IF NOT EXISTS
idx_configuration_history_date
ON admin.configuration_history(created_at);



-- ============================================================================
-- ADMIN AUDIT EVENTS
-- ============================================================================
-- Administrative activity tracking.
--
-- Covers:
-- Settings changes
-- User administration
-- Feature changes
-- Security actions
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.audit_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    actor_id UUID,

    action_type TEXT NOT NULL,

    resource_type TEXT,

    resource_id UUID,

    action_description TEXT,

    severity TEXT DEFAULT 'INFO',

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_admin_audit_org
ON admin.audit_events(organization_id);



CREATE INDEX IF NOT EXISTS
idx_admin_audit_actor
ON admin.audit_events(actor_id);



CREATE INDEX IF NOT EXISTS
idx_admin_audit_resource
ON admin.audit_events(resource_type, resource_id);



-- ============================================================================
-- ENVIRONMENT REGISTRY
-- ============================================================================
-- Supports:
-- Development
-- Testing
-- Staging
-- Production
-- SaaS / Enterprise deployments
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.environment_registry (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    environment_code TEXT NOT NULL UNIQUE,

    environment_name TEXT NOT NULL,

    environment_type TEXT NOT NULL,

    active BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_environment_type
ON admin.environment_registry(environment_type);



-- ============================================================================
-- MAINTENANCE MODE CONTROL
-- ============================================================================
-- Controlled platform availability management.
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.maintenance_controls (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    maintenance_enabled BOOLEAN DEFAULT FALSE,

    maintenance_message TEXT,

    allowed_roles JSONB DEFAULT '[]'::jsonb,

    start_time TIMESTAMPTZ,

    end_time TIMESTAMPTZ,

    enabled_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_maintenance_status
ON admin.maintenance_controls(maintenance_enabled);



-- ============================================================================
-- SYSTEM HEALTH REGISTRY
-- ============================================================================
-- Future monitoring integration:
--
-- Database
-- APIs
-- Storage
-- Email
-- External Services
-- ============================================================================


CREATE TABLE IF NOT EXISTS admin.system_health (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    component_name TEXT NOT NULL,

    component_type TEXT NOT NULL,

    health_status TEXT DEFAULT 'UNKNOWN',

    response_time_ms INTEGER,

    last_checked_at TIMESTAMPTZ DEFAULT NOW(),

    details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_system_health_component
ON admin.system_health(component_name);



CREATE INDEX IF NOT EXISTS
idx_system_health_status
ON admin.system_health(health_status);



-- ============================================================================
-- DEFAULT ADMIN MODULES
-- ============================================================================


INSERT INTO admin.module_registry
(
    module_code,
    module_name,
    module_type,
    description,
    enabled,
    display_order
)

VALUES

(
    'USER_MANAGEMENT',
    'User Management',
    'ADMIN',
    'Manage platform users and access',
    TRUE,
    1
),

(
    'ORGANIZATION_SETTINGS',
    'Organization Settings',
    'ADMIN',
    'Manage organization configuration',
    TRUE,
    2
),

(
    'SECURITY_CONTROL',
    'Security Controls',
    'ADMIN',
    'Manage security configuration',
    TRUE,
    3
),

(
    'AUDIT_MANAGEMENT',
    'Audit Management',
    'ADMIN',
    'Review administrative activities',
    TRUE,
    4
),

(
    'SYSTEM_CONFIGURATION',
    'System Configuration',
    'ADMIN',
    'Manage platform configuration',
    TRUE,
    5
)

ON CONFLICT(module_code)
DO NOTHING;



-- ============================================================================
-- DEFAULT PLATFORM CONFIGURATION
-- ============================================================================


INSERT INTO admin.platform_configuration
(
    config_key,
    config_value,
    config_type,
    description,
    editable
)

VALUES

(
    'platform.name',
    '{"value":"Abhimaan Digital Solutionz"}'::jsonb,
    'SYSTEM',
    'Platform display name',
    TRUE
),

(
    'platform.mode',
    '{"value":"SAAS"}'::jsonb,
    'SYSTEM',
    'Deployment operating mode',
    TRUE
),

(
    'platform.registration.enabled',
    '{"value":true}'::jsonb,
    'SECURITY',
    'Allow organization registration',
    TRUE
)

ON CONFLICT(config_key)
DO NOTHING;



-- ============================================================================
-- DEFAULT ENVIRONMENTS
-- ============================================================================


INSERT INTO admin.environment_registry
(
    environment_code,
    environment_name,
    environment_type
)

VALUES

(
    'DEV',
    'Development Environment',
    'DEVELOPMENT'
),

(
    'TEST',
    'Testing Environment',
    'TESTING'
),

(
    'STAGE',
    'Staging Environment',
    'STAGING'
),

(
    'PROD',
    'Production Environment',
    'PRODUCTION'
)

ON CONFLICT(environment_code)
DO NOTHING;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'environment_registry',

        'maintenance_controls',

        'system_health'

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
    10,
    '010_admin_foundation.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;