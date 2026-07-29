BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE SECURITY HARDENING
-- Migration : 037
-- ============================================================================
-- Purpose
-- Production security reinforcement.
--
-- Supports:
-- Tenant isolation
-- Authentication controls
-- Authorization validation
-- Security auditing
-- Permission governance
-- Platform protection
--
-- Principles:
-- Defense in depth
-- Least privilege
-- Multi-tenant safe
-- Supabase compatible
-- Production ready
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS security;



-- ============================================================================
-- SECURITY EVENTS
-- ============================================================================
-- Central security activity tracking.
-- ============================================================================


CREATE TABLE IF NOT EXISTS security.security_events

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    user_id UUID,

    event_type TEXT NOT NULL,

    severity TEXT DEFAULT 'INFO',

    source TEXT,

    ip_address INET,

    user_agent TEXT,

    entity_type TEXT,

    entity_id UUID,

    event_details JSONB DEFAULT '{}'::jsonb,

    resolved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_security_events_org

ON security.security_events(organization_id);



CREATE INDEX IF NOT EXISTS

idx_security_events_user

ON security.security_events(user_id);



CREATE INDEX IF NOT EXISTS

idx_security_events_type

ON security.security_events(event_type);



-- ============================================================================
-- LOGIN SECURITY TRACKING
-- ============================================================================


CREATE TABLE IF NOT EXISTS security.login_attempts

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,

    email TEXT,

    success BOOLEAN DEFAULT FALSE,

    failure_reason TEXT,

    ip_address INET,

    user_agent TEXT,

    attempted_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_login_attempts_email

ON security.login_attempts(email);



CREATE INDEX IF NOT EXISTS

idx_login_attempts_time

ON security.login_attempts(attempted_at);



-- ============================================================================
-- SECURITY CONFIGURATION
-- ============================================================================
-- Platform security policies.
-- ============================================================================


CREATE TABLE IF NOT EXISTS security.security_configuration

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    config_code TEXT UNIQUE NOT NULL,

    config_value JSONB NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_security_configuration_active

ON security.security_configuration(active);



-- ============================================================================
-- ACCESS REVIEW TRACKING
-- ============================================================================


CREATE TABLE IF NOT EXISTS security.access_reviews

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    reviewed_user_id UUID NOT NULL,

    reviewer_user_id UUID,

    review_status TEXT DEFAULT 'PENDING',

    review_notes TEXT,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_access_reviews_user

ON security.access_reviews(reviewed_user_id);



-- ============================================================================
-- SECURITY POLICY MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS security.policies

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_code TEXT UNIQUE NOT NULL,

    policy_name TEXT NOT NULL,

    category TEXT,

    policy_value JSONB DEFAULT '{}'::jsonb,

    mandatory BOOLEAN DEFAULT FALSE,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_security_policy_category

ON security.policies(category);



-- ============================================================================
-- STANDARD SECURITY CONFIGURATION
-- ============================================================================


INSERT INTO security.security_configuration

(

    config_code,

    config_value,

    description

)

VALUES


(

    'MAX_LOGIN_ATTEMPTS',

    '{"value":5}',

    'Maximum failed login attempts'

),


(

    'SESSION_TIMEOUT',

    '{"minutes":60}',

    'Session expiry duration'

),


(

    'PASSWORD_POLICY',

    '{"minimum_length":8}',

    'Password security rules'

)



ON CONFLICT(config_code)

DO UPDATE SET

config_value = EXCLUDED.config_value;



-- ============================================================================
-- STANDARD SECURITY POLICIES
-- ============================================================================


INSERT INTO security.policies

(

    policy_code,

    policy_name,

    category,

    policy_value,

    mandatory

)

VALUES


(

    'TENANT_ISOLATION',

    'Tenant Data Isolation',

    'DATABASE',

    '{"enabled":true}',

    TRUE

),


(

    'AUDIT_LOGGING',

    'Security Audit Logging',

    'COMPLIANCE',

    '{"enabled":true}',

    TRUE

),


(

    'ROLE_BASED_ACCESS',

    'Role Based Access Control',

    'AUTHORIZATION',

    '{"enabled":true}',

    TRUE

)



ON CONFLICT(policy_code)

DO UPDATE SET

policy_value = EXCLUDED.policy_value;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE SECURITY HARDENING
-- Migration : 037
-- Part 2 Final
-- ============================================================================
-- Purpose
-- Complete security control layer.
--
-- Adds:
-- Tenant validation functions
-- Permission validation
-- Security analytics
-- Audit optimization
-- RLS reinforcement
-- Security grants
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- TENANT ACCESS VALIDATION FUNCTION
-- ============================================================================
-- Central validation helper for services/repositories.
-- ============================================================================


CREATE OR REPLACE FUNCTION security.validate_tenant_access

(

    p_user_id UUID,

    p_organization_id UUID

)

RETURNS BOOLEAN

LANGUAGE plpgsql

SECURITY DEFINER

AS

$$

BEGIN


    RETURN EXISTS

    (

        SELECT 1

        FROM public.organization_members om

        WHERE om.user_id = p_user_id

        AND om.organization_id = p_organization_id

        AND om.status = 'ACTIVE'

    );


END;

$$;



-- ============================================================================
-- ROLE PERMISSION VALIDATION FUNCTION
-- ============================================================================


CREATE OR REPLACE FUNCTION security.has_permission

(

    p_user_id UUID,

    p_permission_code TEXT

)

RETURNS BOOLEAN

LANGUAGE plpgsql

SECURITY DEFINER

AS

$$

BEGIN


    RETURN EXISTS

    (

        SELECT 1


        FROM public.organization_members om


        JOIN security.role_permissions rp

        ON rp.role_id = om.role_id


        JOIN security.permissions p

        ON p.id = rp.permission_id


        WHERE om.user_id = p_user_id

        AND p.permission_code = p_permission_code

        AND om.status = 'ACTIVE'

    );


END;

$$;



-- ============================================================================
-- SECURITY AUDIT VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_security_event_summary AS


SELECT


    event_type,


    severity,


    COUNT(*) AS event_count,


    COUNT(*)

    FILTER

    (

        WHERE resolved = FALSE

    )

    AS unresolved_count



FROM security.security_events



GROUP BY


event_type,

severity;



-- ============================================================================
-- LOGIN SECURITY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_login_security_summary AS


SELECT


    email,


    COUNT(*) AS total_attempts,


    COUNT(*)

    FILTER

    (

        WHERE success = TRUE

    )

    AS successful_attempts,


    COUNT(*)

    FILTER

    (

        WHERE success = FALSE

    )

    AS failed_attempts



FROM security.login_attempts



GROUP BY email;



-- ============================================================================
-- SECURITY EVENT RETENTION CONFIGURATION
-- ============================================================================


INSERT INTO security.security_configuration

(

    config_code,

    config_value,

    description

)

VALUES


(

    'AUDIT_RETENTION_DAYS',

    '{"days":365}',

    'Security audit retention period'

),


(

    'ENABLE_SECURITY_ALERTS',

    '{"enabled":true}',

    'Enable security monitoring alerts'

)



ON CONFLICT(config_code)

DO UPDATE SET

config_value = EXCLUDED.config_value;



-- ============================================================================
-- RLS ENABLEMENT FOUNDATION
-- ============================================================================
-- Enables row security where supported.
-- Existing business policies remain authoritative.
-- ============================================================================


DO
$$

DECLARE

    tbl RECORD;


BEGIN


    FOR tbl IN

    SELECT

        schemaname,

        tablename

    FROM pg_tables

    WHERE schemaname IN

    (

        'security',

        'notification',

        'attachment'

    )


    LOOP


        EXECUTE format(

            'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;',

            tbl.schemaname,

            tbl.tablename

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- SECURITY GRANTS
-- ============================================================================


GRANT USAGE

ON SCHEMA security

TO authenticated;



GRANT SELECT, INSERT, UPDATE

ON ALL TABLES IN SCHEMA security

TO authenticated;



GRANT EXECUTE

ON FUNCTION security.validate_tenant_access

TO authenticated;



GRANT EXECUTE

ON FUNCTION security.has_permission

TO authenticated;



-- ============================================================================
-- UPDATED TIMESTAMP TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'security_configuration',

        'access_reviews',

        'policies'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON security.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON security.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl,

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

    37,

    '037_security_hardening.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;

