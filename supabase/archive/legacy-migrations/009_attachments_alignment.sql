BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ATTACHMENTS ALIGNMENT
-- Migration : 009
-- ============================================================================
-- Purpose
-- Standardize attachment handling across:
-- Website
-- CRM
-- Admin
-- Projects
-- Finance
-- Future Enterprise Modules
--
-- Principles:
-- Entity-driven
-- Tenant-aware
-- Storage-provider independent
-- Audit ready
-- Version capable
-- Supabase Storage compatible
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS attachments;



-- ============================================================================
-- ATTACHMENT MASTER
-- ============================================================================
-- Central entity attachment registry.
--
-- Examples:
-- lead + documents
-- client + contracts
-- project + files
-- invoice + receipts
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.attachments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    file_name TEXT NOT NULL,

    original_file_name TEXT,

    file_extension TEXT,

    mime_type TEXT,

    file_size BIGINT,

    storage_provider TEXT DEFAULT 'SUPABASE',

    storage_bucket TEXT,

    storage_path TEXT NOT NULL,

    access_level TEXT DEFAULT 'PRIVATE',

    status TEXT DEFAULT 'ACTIVE',

    uploaded_by UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_attachment_org
ON attachments.attachments(organization_id);



CREATE INDEX IF NOT EXISTS
idx_attachment_entity
ON attachments.attachments(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_attachment_status
ON attachments.attachments(status);



CREATE INDEX IF NOT EXISTS
idx_attachment_uploaded_by
ON attachments.attachments(uploaded_by);



-- ============================================================================
-- ATTACHMENT VERSIONS
-- ============================================================================
-- Enables document history.
--
-- Example:
-- Contract v1
-- Contract v2
-- Contract signed copy
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.attachment_versions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    version_number INTEGER NOT NULL DEFAULT 1,

    storage_path TEXT NOT NULL,

    file_size BIGINT,

    checksum TEXT,

    uploaded_by UUID,

    change_description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_version

    FOREIGN KEY(attachment_id)

    REFERENCES attachments.attachments(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_attachment_version

    UNIQUE(
        attachment_id,
        version_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_attachment_versions_attachment
ON attachments.attachment_versions(attachment_id);



-- ============================================================================
-- ATTACHMENT ACCESS CONTROL
-- ============================================================================
-- Supports:
-- User access
-- Team access
-- Role based access
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.attachment_permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    subject_type TEXT NOT NULL,

    subject_id UUID NOT NULL,

    permission_level TEXT DEFAULT 'VIEW',

    granted_by UUID,

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_permission

    FOREIGN KEY(attachment_id)

    REFERENCES attachments.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_attachment_permission_attachment
ON attachments.attachment_permissions(attachment_id);



CREATE INDEX IF NOT EXISTS
idx_attachment_permission_subject
ON attachments.attachment_permissions(subject_type, subject_id);



-- ============================================================================
-- STORAGE PROVIDERS
-- ============================================================================
-- Allows future migration:
-- Supabase Storage
-- AWS S3
-- Azure Blob
-- Google Cloud Storage
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.storage_providers (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider_code TEXT NOT NULL UNIQUE,

    provider_name TEXT NOT NULL,

    enabled BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_storage_provider_status
ON attachments.storage_providers(enabled);



-- ============================================================================
-- ATTACHMENT TAGS
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.attachment_tags (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    tag_name TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_tag

    FOREIGN KEY(attachment_id)

    REFERENCES attachments.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_attachment_tags_attachment
ON attachments.attachment_tags(attachment_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'attachments',

        'storage_providers'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated 
             ON attachments.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON attachments.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

-- ============================================================================
-- ATTACHMENT AUDIT HISTORY
-- ============================================================================
-- Tracks:
-- Upload
-- Download
-- Update
-- Delete
-- Permission changes
-- Security review
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.attachment_audit (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    action_type TEXT NOT NULL,

    performed_by UUID,

    ip_address INET,

    user_agent TEXT,

    action_details JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_attachment_audit

    FOREIGN KEY(attachment_id)

    REFERENCES attachments.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_attachment_audit_attachment
ON attachments.attachment_audit(attachment_id);



CREATE INDEX IF NOT EXISTS
idx_attachment_audit_action
ON attachments.attachment_audit(action_type);



-- ============================================================================
-- ATTACHMENT DOWNLOAD TRACKING
-- ============================================================================
-- Security and usage analytics
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.download_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    attachment_id UUID NOT NULL,

    downloaded_by UUID,

    download_source TEXT,

    download_status TEXT DEFAULT 'SUCCESS',

    metadata JSONB DEFAULT '{}'::jsonb,

    downloaded_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_download_attachment

    FOREIGN KEY(attachment_id)

    REFERENCES attachments.attachments(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_download_history_attachment
ON attachments.download_history(attachment_id);



CREATE INDEX IF NOT EXISTS
idx_download_history_user
ON attachments.download_history(downloaded_by);



-- ============================================================================
-- STORAGE BUCKET REGISTRY
-- ============================================================================
-- Maps application buckets with storage providers.
--
-- Compatible with:
-- Supabase Storage buckets
-- Enterprise object storage
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.storage_buckets (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_code TEXT NOT NULL UNIQUE,

    bucket_name TEXT NOT NULL,

    provider_code TEXT NOT NULL,

    purpose TEXT,

    visibility TEXT DEFAULT 'PRIVATE',

    max_file_size BIGINT,

    allowed_file_types JSONB DEFAULT '[]'::jsonb,

    enabled BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_storage_bucket_provider
ON attachments.storage_buckets(provider_code);



CREATE INDEX IF NOT EXISTS
idx_storage_bucket_status
ON attachments.storage_buckets(enabled);



-- ============================================================================
-- DEFAULT STORAGE PROVIDERS
-- ============================================================================


INSERT INTO attachments.storage_providers
(
    provider_code,
    provider_name,
    enabled
)

VALUES

(
    'SUPABASE',
    'Supabase Storage',
    TRUE
),

(
    'AWS_S3',
    'Amazon S3 Storage',
    FALSE
),

(
    'AZURE_BLOB',
    'Azure Blob Storage',
    FALSE
)

ON CONFLICT(provider_code)
DO NOTHING;



-- ============================================================================
-- DEFAULT STORAGE BUCKETS
-- ============================================================================


INSERT INTO attachments.storage_buckets
(
    bucket_code,
    bucket_name,
    provider_code,
    purpose,
    visibility
)

VALUES

(
    'CRM_DOCUMENTS',
    'CRM Documents',
    'SUPABASE',
    'CRM entity documents',
    'PRIVATE'
),

(
    'USER_UPLOADS',
    'User Uploads',
    'SUPABASE',
    'General user uploads',
    'PRIVATE'
),

(
    'PUBLIC_ASSETS',
    'Public Assets',
    'SUPABASE',
    'Website public assets',
    'PUBLIC'
)

ON CONFLICT(bucket_code)
DO NOTHING;



-- ============================================================================
-- ATTACHMENT VALIDATION RULES
-- ============================================================================


CREATE TABLE IF NOT EXISTS attachments.validation_rules (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rule_code TEXT NOT NULL UNIQUE,

    rule_name TEXT NOT NULL,

    rule_type TEXT NOT NULL,

    rule_configuration JSONB DEFAULT '{}'::jsonb,

    enabled BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_attachment_validation_status
ON attachments.validation_rules(enabled);



INSERT INTO attachments.validation_rules
(
    rule_code,
    rule_name,
    rule_type,
    rule_configuration
)

VALUES

(
    'MAX_FILE_SIZE',
    'Maximum File Size Validation',
    'SIZE',
    '{"max_size_mb":50}'::jsonb
),

(
    'BLOCK_EXECUTABLE_FILES',
    'Block Executable Uploads',
    'FILE_TYPE',
    '{"blocked":["exe","bat","cmd"]}'::jsonb
)

ON CONFLICT(rule_code)
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

        'storage_buckets',

        'validation_rules'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated 
             ON attachments.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON attachments.%1$s
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
    9,
    '009_attachments_alignment.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

