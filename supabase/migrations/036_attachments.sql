BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE ATTACHMENT MANAGEMENT FOUNDATION
-- Migration : 036
-- ============================================================================
-- Purpose
-- Unified attachment and document management architecture.
--
-- Supports:
-- CRM entities
-- Admin documents
-- Website assets
-- File metadata
-- Storage integration
-- Version management
-- Access control foundation
--
-- Principles:
-- Entity driven
-- Storage independent
-- Multi-module compatible
-- Supabase Storage ready
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS attachment;



-- ============================================================================
-- STORAGE PROVIDER MASTER
-- ============================================================================
-- Supports future storage providers.
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.storage_providers

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider_code TEXT UNIQUE NOT NULL,

    provider_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_storage_provider_active

ON attachment.storage_providers(active);



-- ============================================================================
-- FILE CATEGORY MASTER
-- ============================================================================
-- Document classification.
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.file_categories

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_code TEXT UNIQUE NOT NULL,

    category_name TEXT NOT NULL,

    description TEXT,

    module_name TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_file_categories_module

ON attachment.file_categories(module_name);



-- ============================================================================
-- ATTACHMENT MASTER
-- ============================================================================
-- Generic entity attachment model.
--
-- Compatible with:
-- Leads
-- Companies
-- Contacts
-- Projects
-- Tasks
-- Any future entity.
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.attachments

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    category_id UUID,

    provider_id UUID,

    file_name TEXT NOT NULL,

    original_file_name TEXT,

    file_extension TEXT,

    mime_type TEXT,

    file_size BIGINT,

    storage_path TEXT NOT NULL,

    storage_bucket TEXT,

    checksum TEXT,

    version_number INTEGER DEFAULT 1,

    is_latest_version BOOLEAN DEFAULT TRUE,

    uploaded_by UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_category

    FOREIGN KEY(category_id)

    REFERENCES attachment.file_categories(id)

    ON DELETE SET NULL,


    CONSTRAINT fk_attachment_provider

    FOREIGN KEY(provider_id)

    REFERENCES attachment.storage_providers(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_attachment_entity

ON attachment.attachments

(

    entity_type,

    entity_id

);



CREATE INDEX IF NOT EXISTS

idx_attachment_organization

ON attachment.attachments

(

    organization_id

);



CREATE INDEX IF NOT EXISTS

idx_attachment_latest

ON attachment.attachments

(

    entity_type,

    entity_id,

    is_latest_version

);



-- ============================================================================
-- FILE VERSION HISTORY
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.file_versions

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    version_number INTEGER NOT NULL,

    storage_path TEXT NOT NULL,

    file_size BIGINT,

    checksum TEXT,

    uploaded_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_file_version_attachment

    FOREIGN KEY(attachment_id)

    REFERENCES attachment.attachments(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_attachment_version

    UNIQUE

    (

        attachment_id,

        version_number

    )

);



CREATE INDEX IF NOT EXISTS

idx_file_versions_attachment

ON attachment.file_versions(attachment_id);



-- ============================================================================
-- ATTACHMENT ACCESS CONTROL
-- ============================================================================
-- Foundation for private/public/share permissions.
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.access_permissions

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    user_id UUID,

    access_type TEXT DEFAULT 'VIEW',

    expires_at TIMESTAMPTZ,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_permission

    FOREIGN KEY(attachment_id)

    REFERENCES attachment.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_attachment_permission_user

ON attachment.access_permissions(user_id);



-- ============================================================================
-- STANDARD PROVIDER SEEDS
-- ============================================================================


INSERT INTO attachment.storage_providers

(

    provider_code,

    provider_name,

    description

)

VALUES


(

    'SUPABASE_STORAGE',

    'Supabase Storage',

    'Primary application storage'

),


(

    'LOCAL',

    'Local Storage',

    'Development/local storage provider'

)



ON CONFLICT(provider_code)

DO UPDATE SET

provider_name = EXCLUDED.provider_name;



-- ============================================================================
-- STANDARD FILE CATEGORIES
-- ============================================================================


INSERT INTO attachment.file_categories

(

    category_code,

    category_name,

    module_name

)

VALUES


(

    'DOCUMENT',

    'Business Documents',

    'CORE'

),


(

    'IMAGE',

    'Images',

    'CORE'

),


(

    'CONTRACT',

    'Contracts',

    'CRM'

),


(

    'EXPORT',

    'Generated Reports',

    'REPORTING'

)


ON CONFLICT(category_code)

DO UPDATE SET

category_name = EXCLUDED.category_name;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE ATTACHMENT MANAGEMENT FOUNDATION
-- Migration : 036
-- Part 2 Final
-- ============================================================================
-- Purpose
-- Complete attachment intelligence layer.
--
-- Adds:
-- Attachment analytics
-- Storage monitoring
-- Validation framework
-- Audit tracking
-- Security alignment
-- Timestamp automation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- ATTACHMENT VALIDATION RULES
-- ============================================================================
-- Controls allowed file behaviour.
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.validation_rules

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rule_code TEXT UNIQUE NOT NULL,

    rule_name TEXT NOT NULL,

    max_file_size_mb INTEGER DEFAULT 25,

    allowed_extensions TEXT[],

    allowed_mime_types TEXT[],

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_attachment_validation_active

ON attachment.validation_rules(active);



-- ============================================================================
-- ATTACHMENT AUDIT HISTORY
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.audit_history

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    action_type TEXT NOT NULL,

    performed_by UUID,

    action_details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_audit

    FOREIGN KEY(attachment_id)

    REFERENCES attachment.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_attachment_audit_attachment

ON attachment.audit_history(attachment_id);



-- ============================================================================
-- STORAGE USAGE TRACKING
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachment.storage_usage

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    storage_provider_id UUID,

    total_files INTEGER DEFAULT 0,

    total_size_bytes BIGINT DEFAULT 0,

    calculated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_storage_usage_provider

    FOREIGN KEY(storage_provider_id)

    REFERENCES attachment.storage_providers(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_storage_usage_org

ON attachment.storage_usage(organization_id);



-- ============================================================================
-- ATTACHMENT ANALYTICS
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_attachment_summary AS


SELECT


    entity_type,


    COUNT(*) AS total_files,


    SUM(file_size) AS total_storage_bytes,


    COUNT(*)

        FILTER

        (

            WHERE is_latest_version = TRUE

        )

        AS latest_versions



FROM attachment.attachments



GROUP BY

entity_type;



-- ============================================================================
-- STORAGE PROVIDER REPORT
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_storage_provider_usage AS


SELECT


    sp.provider_code,


    sp.provider_name,


    COUNT(a.id)

    AS file_count,


    COALESCE(

        SUM(a.file_size),

        0

    )

    AS storage_bytes



FROM attachment.storage_providers sp



LEFT JOIN attachment.attachments a

ON a.provider_id = sp.id



GROUP BY


sp.provider_code,

sp.provider_name;



-- ============================================================================
-- STANDARD VALIDATION RULES
-- ============================================================================


INSERT INTO attachment.validation_rules

(

    rule_code,

    rule_name,

    max_file_size_mb,

    allowed_extensions

)

VALUES


(

    'GENERAL_DOCUMENT',

    'General Document Upload',

    25,

    ARRAY['pdf','doc','docx','xls','xlsx']

),


(

    'IMAGE_UPLOAD',

    'Image Upload',

    10,

    ARRAY['png','jpg','jpeg','webp']

)



ON CONFLICT(rule_code)

DO UPDATE SET

rule_name = EXCLUDED.rule_name;



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'storage_providers',

        'file_categories',

        'attachments',

        'validation_rules'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON attachment.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON attachment.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl,

            tbl

        );


    END LOOP;


END;

$$;



-- ============================================================================
-- SECURITY GRANTS
-- ============================================================================


GRANT USAGE

ON SCHEMA attachment

TO authenticated;



GRANT SELECT, INSERT, UPDATE

ON ALL TABLES IN SCHEMA attachment

TO authenticated;



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

    36,

    '036_attachments.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;

