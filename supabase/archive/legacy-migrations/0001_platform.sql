BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE SCHEMA IF NOT EXISTS ads_platform;

COMMENT ON SCHEMA ads_platform IS
'ADS Enterprise Platform v1.0 Shared Platform';

------------------------------------------------------------
-- ENUMS
------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='record_status') THEN
        CREATE TYPE record_status AS ENUM
        (
            'ACTIVE',
            'INACTIVE',
            'ARCHIVED',
            'DELETED'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='tenant_status') THEN
        CREATE TYPE tenant_status AS ENUM
        (
            'TRIAL',
            'ACTIVE',
            'SUSPENDED',
            'CANCELLED'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='deployment_mode') THEN
        CREATE TYPE deployment_mode AS ENUM
        (
            'SAAS',
            'ON_PREM'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='module_status') THEN
        CREATE TYPE module_status AS ENUM
        (
            'DISABLED',
            'ENABLED'
        );
    END IF;
END $$;

------------------------------------------------------------
-- BASE AUDIT COLUMNS DOMAIN
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS platform_audit_log
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    organization_id     uuid,

    entity_name         text NOT NULL,

    entity_id           uuid,

    action              text NOT NULL,

    performed_by        uuid,

    old_values          jsonb,

    new_values          jsonb,

    ip_address          inet,

    user_agent          text,

    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_audit_created
ON platform_audit_log(created_at DESC);

------------------------------------------------------------
-- TENANTS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tenants
(
    id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_code                 varchar(50) UNIQUE NOT NULL,

    tenant_name                 varchar(250) NOT NULL,

    deployment                  deployment_mode NOT NULL,

    status                      tenant_status NOT NULL DEFAULT 'TRIAL',

    database_version            varchar(20),

    timezone                    varchar(100),

    default_language            varchar(20),

    created_at                  timestamptz NOT NULL DEFAULT now(),

    updated_at                  timestamptz NOT NULL DEFAULT now(),

    created_by                  uuid,

    updated_by                  uuid,

    metadata                    jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_tenant_status
ON tenants(status);

------------------------------------------------------------
-- MODULE CATALOG
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS platform_modules
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    module_code             varchar(100) UNIQUE NOT NULL,

    module_name             varchar(250) NOT NULL,

    category                varchar(100),

    description             text,

    enabled_by_default      boolean DEFAULT false,

    created_at              timestamptz DEFAULT now()
);

------------------------------------------------------------
-- TENANT MODULES
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tenant_modules
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id               uuid NOT NULL,

    module_id               uuid NOT NULL,

    status                  module_status NOT NULL DEFAULT 'DISABLED',

    activated_at            timestamptz,

    activated_by            uuid,

    metadata                jsonb DEFAULT '{}',

    CONSTRAINT fk_tm_tenant
        FOREIGN KEY(tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tm_module
        FOREIGN KEY(module_id)
        REFERENCES platform_modules(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tm_unique
ON tenant_modules(tenant_id,module_id);

COMMIT; 
------------------------------------------------------------
-- ORGANIZATIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizations
(
    id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id                   uuid NOT NULL,

    organization_code           varchar(50) UNIQUE NOT NULL,

    organization_name           varchar(250) NOT NULL,

    legal_name                  varchar(250),

    organization_type           varchar(100),

    email                       citext,

    phone                       varchar(50),

    website                     text,

    tax_number                  varchar(100),

    registration_number         varchar(100),

    currency                    varchar(10) DEFAULT 'USD',

    timezone                    varchar(100),

    language                    varchar(20) DEFAULT 'en',

    country                     varchar(100),

    state                       varchar(100),

    city                        varchar(100),

    address1                    text,

    address2                    text,

    postal_code                 varchar(30),

    logo_url                    text,

    status                      record_status DEFAULT 'ACTIVE',

    metadata                    jsonb DEFAULT '{}',

    created_at                  timestamptz DEFAULT now(),

    updated_at                  timestamptz DEFAULT now(),

    created_by                  uuid,

    updated_by                  uuid,

    CONSTRAINT fk_org_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_org_tenant
ON organizations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_org_status
ON organizations(status);

------------------------------------------------------------
-- PROFILES
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles
(
    id                          uuid PRIMARY KEY,

    tenant_id                   uuid NOT NULL,

    organization_id             uuid,

    employee_number             varchar(50),

    first_name                  varchar(100),

    middle_name                 varchar(100),

    last_name                   varchar(100),

    display_name                varchar(250),

    email                       citext NOT NULL,

    phone                       varchar(50),

    avatar_url                  text,

    designation                 varchar(150),

    department                  varchar(150),

    timezone                    varchar(100),

    locale                      varchar(20),

    last_login_at               timestamptz,

    status                      record_status DEFAULT 'ACTIVE',

    metadata                    jsonb DEFAULT '{}',

    created_at                  timestamptz DEFAULT now(),

    updated_at                  timestamptz DEFAULT now(),

    CONSTRAINT fk_profile_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_profile_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
);

CREATE INDEX IF NOT EXISTS idx_profile_org
ON profiles(organization_id);

CREATE INDEX IF NOT EXISTS idx_profile_email
ON profiles(email);

------------------------------------------------------------
-- ROLES
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id               uuid,

    role_code               varchar(100) NOT NULL,

    role_name               varchar(150) NOT NULL,

    description             text,

    system_role             boolean DEFAULT false,

    status                  record_status DEFAULT 'ACTIVE',

    metadata                jsonb DEFAULT '{}',

    created_at              timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_role_unique
ON roles(tenant_id, role_code);

------------------------------------------------------------
-- PERMISSIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS permissions
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    permission_code         varchar(200) UNIQUE NOT NULL,

    module                  varchar(100),

    resource                varchar(100),

    action                  varchar(100),

    description             text,

    created_at              timestamptz DEFAULT now()
);

------------------------------------------------------------
-- ROLE PERMISSIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS role_permissions
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id                 uuid NOT NULL,

    permission_id           uuid NOT NULL,

    created_at              timestamptz DEFAULT now(),

    CONSTRAINT fk_rp_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rp_permission
        FOREIGN KEY(permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_role_permission
ON role_permissions(role_id, permission_id);

------------------------------------------------------------
-- USER ROLES
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_roles
(
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id              uuid NOT NULL,

    role_id                 uuid NOT NULL,

    assigned_at             timestamptz DEFAULT now(),

    assigned_by             uuid,

    CONSTRAINT fk_userrole_profile
        FOREIGN KEY(profile_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_userrole_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_role_unique
ON user_roles(profile_id, role_id);
------------------------------------------------------------
-- PLATFORM CONFIGURATION
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS platform_settings
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    setting_group       varchar(100) NOT NULL,

    setting_key         varchar(150) NOT NULL,

    setting_value       jsonb NOT NULL DEFAULT '{}',

    is_encrypted        boolean DEFAULT false,

    description         text,

    created_at          timestamptz DEFAULT now(),

    updated_at          timestamptz DEFAULT now(),

    UNIQUE(tenant_id,setting_group,setting_key),

    CONSTRAINT fk_platform_setting_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- FEATURE FLAGS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feature_flags
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    feature_code        varchar(150) NOT NULL,

    enabled             boolean DEFAULT false,

    metadata            jsonb DEFAULT '{}',

    created_at          timestamptz DEFAULT now(),

    updated_at          timestamptz DEFAULT now(),

    UNIQUE(tenant_id,feature_code),

    CONSTRAINT fk_feature_flag_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- WORKFLOW DEFINITIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_definitions
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid NOT NULL,

    workflow_code       varchar(100) NOT NULL,

    workflow_name       varchar(200) NOT NULL,

    module_code         varchar(100),

    version             integer DEFAULT 1,

    is_active           boolean DEFAULT true,

    workflow_json       jsonb NOT NULL,

    created_by          uuid,

    created_at          timestamptz DEFAULT now(),

    updated_at          timestamptz DEFAULT now(),

    UNIQUE(tenant_id,workflow_code),

    CONSTRAINT fk_workflow_tenant
        FOREIGN KEY(tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- WORKFLOW EXECUTIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_executions
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid NOT NULL,

    workflow_id         uuid NOT NULL,

    entity_type         varchar(100),

    entity_id           uuid,

    execution_status    varchar(50),

    execution_log       jsonb DEFAULT '{}',

    started_at          timestamptz DEFAULT now(),

    completed_at        timestamptz,

    CONSTRAINT fk_execution_tenant
        FOREIGN KEY(tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_execution_workflow
        FOREIGN KEY(workflow_id)
        REFERENCES workflow_definitions(id)
);

------------------------------------------------------------
-- SYSTEM INTEGRATIONS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS integrations
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    integration_code    varchar(100),

    provider            varchar(150),

    configuration       jsonb DEFAULT '{}',

    credentials         jsonb DEFAULT '{}',

    enabled             boolean DEFAULT true,

    created_at          timestamptz DEFAULT now(),

    updated_at          timestamptz DEFAULT now(),

    UNIQUE(tenant_id,integration_code),

    CONSTRAINT fk_integration_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
);

------------------------------------------------------------
-- API KEYS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS api_keys
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    key_name            varchar(150),

    api_key             text,

    expires_at          timestamptz,

    active              boolean DEFAULT true,

    created_at          timestamptz DEFAULT now(),

    CONSTRAINT fk_api_key_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
);

------------------------------------------------------------
-- SYSTEM JOBS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS scheduled_jobs
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    job_code            varchar(100),

    cron_expression     varchar(100),

    enabled             boolean DEFAULT true,

    configuration       jsonb DEFAULT '{}',

    last_run            timestamptz,

    next_run            timestamptz,

    created_at          timestamptz DEFAULT now(),

    CONSTRAINT fk_job_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
);

------------------------------------------------------------
-- AI PROVIDERS
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_providers
(
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id           uuid,

    provider_name       varchar(100),

    model_name          varchar(150),

    api_configuration   jsonb DEFAULT '{}',

    enabled             boolean DEFAULT true,

    created_at          timestamptz DEFAULT now(),

    CONSTRAINT fk_ai_provider_tenant
        FOREIGN KEY(tenant_id)
        REFERENCES tenants(id)
);
------------------------------------------------------------
-- GENERIC UPDATED_AT FUNCTION
------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

------------------------------------------------------------
-- AUDIT FUNCTION
------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO audit_logs
    (
        tenant_id,
        entity_name,
        entity_id,
        operation,
        old_data,
        new_data,
        performed_at
    )
    VALUES
    (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        now()
    );

    RETURN COALESCE(NEW, OLD);

END;
$$;

------------------------------------------------------------
-- UPDATE TRIGGERS
------------------------------------------------------------

CREATE TRIGGER trg_tenants_updated
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_modules_updated
BEFORE UPDATE ON platform_modules
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_org_updated
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_roles_updated
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_settings_updated
BEFORE UPDATE ON platform_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_feature_updated
BEFORE UPDATE ON feature_flags
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_workflow_updated
BEFORE UPDATE ON workflow_definitions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_integrations_updated
BEFORE UPDATE ON integrations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------
-- AUDIT TRIGGERS
------------------------------------------------------------

CREATE TRIGGER audit_tenants
AFTER INSERT OR UPDATE OR DELETE
ON tenants
FOR EACH ROW
EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_modules
AFTER INSERT OR UPDATE OR DELETE
ON platform_modules
FOR EACH ROW
EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_organizations
AFTER INSERT OR UPDATE OR DELETE
ON organizations
FOR EACH ROW
EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_profiles
AFTER INSERT OR UPDATE OR DELETE
ON profiles
FOR EACH ROW
EXECUTE FUNCTION audit_trigger();

------------------------------------------------------------
-- PLATFORM DEFAULT MODULES
------------------------------------------------------------

INSERT INTO platform_modules(module_code,module_name,module_category)
VALUES
('WEBSITE','Website','WEBSITE'),
('CRM','CRM','CRM'),
('ERP','ERP','ERP'),
('ADMIN','Administration','ADMIN')
ON CONFLICT (module_code)
DO NOTHING;

------------------------------------------------------------
-- DEFAULT FEATURE FLAGS
------------------------------------------------------------

INSERT INTO feature_flags
(
    tenant_id,
    feature_code,
    enabled
)
SELECT
NULL,
feature,
false
FROM
(
VALUES
('WEBSITE'),
('CRM'),
('ERP'),
('HRMS'),
('HELPDESK'),
('AI'),
('AUTOMATION'),
('REPORTING'),
('ANALYTICS'),
('KNOWLEDGE_BASE')
) f(feature)
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- END OF 0001_platform.sql
------------------------------------------------------------