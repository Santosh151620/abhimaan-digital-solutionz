BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE STORAGE MANAGEMENT FOUNDATION
-- Migration : 038
-- ============================================================================
-- Purpose
-- Production storage governance layer.
--
-- Supports:
-- Supabase Storage integration
-- Bucket management
-- File lifecycle control
-- Storage security
-- Usage monitoring
-- Multi-module compatibility
--
-- Principles:
-- Storage abstraction
-- Entity aligned
-- Secure by default
-- Multi-tenant ready
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS storage_management;



-- ============================================================================
-- STORAGE BUCKET MASTER
-- ============================================================================
-- Logical storage containers.
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.buckets

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_code TEXT UNIQUE NOT NULL,

    bucket_name TEXT NOT NULL,

    provider_code TEXT DEFAULT 'SUPABASE_STORAGE',

    visibility TEXT DEFAULT 'PRIVATE',

    max_file_size_mb INTEGER DEFAULT 25,

    allowed_extensions TEXT[],

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_storage_bucket_active

ON storage_management.buckets(active);



CREATE INDEX IF NOT EXISTS

idx_storage_bucket_provider

ON storage_management.buckets(provider_code);



-- ============================================================================
-- STORAGE OBJECT REGISTRY
-- ============================================================================
-- Tracks physical storage objects.
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.objects

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    bucket_id UUID NOT NULL,

    entity_type TEXT,

    entity_id UUID,

    object_path TEXT NOT NULL,

    original_name TEXT,

    mime_type TEXT,

    file_size BIGINT DEFAULT 0,

    checksum TEXT,

    status TEXT DEFAULT 'ACTIVE',

    uploaded_by UUID,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_storage_object_bucket

    FOREIGN KEY(bucket_id)

    REFERENCES storage_management.buckets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_storage_object_entity

ON storage_management.objects

(

    entity_type,

    entity_id

);



CREATE INDEX IF NOT EXISTS

idx_storage_object_org

ON storage_management.objects

(

    organization_id

);



CREATE INDEX IF NOT EXISTS

idx_storage_object_bucket

ON storage_management.objects(bucket_id);



-- ============================================================================
-- STORAGE ACCESS POLICIES
-- ============================================================================
-- File access governance.
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.access_policies

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_id UUID NOT NULL,

    policy_code TEXT UNIQUE NOT NULL,

    access_type TEXT DEFAULT 'READ',

    role_code TEXT,

    conditions JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_storage_policy_bucket

    FOREIGN KEY(bucket_id)

    REFERENCES storage_management.buckets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_storage_policy_bucket

ON storage_management.access_policies(bucket_id);



-- ============================================================================
-- FILE LIFECYCLE MANAGEMENT
-- ============================================================================
-- Controls retention/archive/delete workflow.
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.lifecycle_rules

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_id UUID NOT NULL,

    rule_code TEXT UNIQUE NOT NULL,

    retention_days INTEGER DEFAULT 365,

    archive_after_days INTEGER,

    delete_after_days INTEGER,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_lifecycle_bucket

    FOREIGN KEY(bucket_id)

    REFERENCES storage_management.buckets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_storage_lifecycle_bucket

ON storage_management.lifecycle_rules(bucket_id);



-- ============================================================================
-- STORAGE USAGE SNAPSHOTS
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.usage_snapshots

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    bucket_id UUID,

    file_count INTEGER DEFAULT 0,

    storage_bytes BIGINT DEFAULT 0,

    snapshot_date DATE DEFAULT CURRENT_DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_storage_usage_snapshot_org

ON storage_management.usage_snapshots(organization_id);



-- ============================================================================
-- STANDARD BUCKET SEEDS
-- ============================================================================


INSERT INTO storage_management.buckets

(

    bucket_code,

    bucket_name,

    visibility,

    max_file_size_mb,

    allowed_extensions

)

VALUES


(

    'CRM_DOCUMENTS',

    'CRM Documents',

    'PRIVATE',

    50,

    ARRAY['pdf','doc','docx','xls','xlsx']

),


(

    'PUBLIC_ASSETS',

    'Public Website Assets',

    'PUBLIC',

    10,

    ARRAY['png','jpg','jpeg','webp']

),


(

    'SYSTEM_EXPORTS',

    'Generated System Exports',

    'PRIVATE',

    100,

    ARRAY['csv','xlsx','pdf']

)



ON CONFLICT(bucket_code)

DO UPDATE SET

bucket_name = EXCLUDED.bucket_name;



-- ============================================================================
-- STANDARD ACCESS POLICIES
-- ============================================================================


INSERT INTO storage_management.access_policies

(

    bucket_id,

    policy_code,

    access_type,

    role_code

)


SELECT

    id,

    'ADMIN_FULL_ACCESS',

    'FULL',

    'ADMIN'


FROM storage_management.buckets



ON CONFLICT(policy_code)

DO NOTHING;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE STORAGE MANAGEMENT FOUNDATION
-- Migration : 038
-- Part 2 Final
-- ============================================================================
-- Purpose
-- Complete storage intelligence and governance layer.
--
-- Adds:
-- Storage analytics
-- Validation framework
-- Lifecycle monitoring
-- Security alignment
-- Timestamp automation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- STORAGE VALIDATION RULES
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.validation_rules

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rule_code TEXT UNIQUE NOT NULL,

    rule_name TEXT NOT NULL,

    max_size_mb INTEGER DEFAULT 25,

    allowed_mime_types TEXT[],

    blocked_extensions TEXT[],

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_storage_validation_active

ON storage_management.validation_rules(active);



-- ============================================================================
-- STORAGE OPERATIONS LOG
-- ============================================================================
-- Tracks upload/download/delete operations.
-- ============================================================================


CREATE TABLE IF NOT EXISTS storage_management.operation_logs

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    object_id UUID,

    operation_type TEXT NOT NULL,

    performed_by UUID,

    operation_status TEXT DEFAULT 'SUCCESS',

    error_message TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_storage_operation_object

    FOREIGN KEY(object_id)

    REFERENCES storage_management.objects(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_storage_operation_object

ON storage_management.operation_logs(object_id);



CREATE INDEX IF NOT EXISTS

idx_storage_operation_org

ON storage_management.operation_logs(organization_id);



-- ============================================================================
-- STORAGE ANALYTICS
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_storage_summary AS


SELECT


    b.bucket_code,


    b.bucket_name,


    COUNT(o.id)

    AS object_count,


    COALESCE(

        SUM(o.file_size),

        0

    )

    AS total_storage_bytes



FROM storage_management.buckets b



LEFT JOIN storage_management.objects o

ON o.bucket_id=b.id



GROUP BY


b.bucket_code,

b.bucket_name;



-- ============================================================================
-- ORGANIZATION STORAGE USAGE
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_organization_storage_usage AS


SELECT


    organization_id,


    COUNT(id)

    AS total_objects,


    COALESCE(

        SUM(file_size),

        0

    )

    AS total_bytes



FROM storage_management.objects



GROUP BY organization_id;



-- ============================================================================
-- STORAGE LIFECYCLE MONITORING VIEW
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_storage_lifecycle_status AS


SELECT


    b.bucket_code,


    b.bucket_name,


    lr.rule_code,


    lr.retention_days,


    lr.archive_after_days,


    lr.delete_after_days,


    lr.active



FROM storage_management.lifecycle_rules lr



JOIN storage_management.buckets b

ON b.id=lr.bucket_id;



-- ============================================================================
-- STANDARD STORAGE VALIDATION SEEDS
-- ============================================================================


INSERT INTO storage_management.validation_rules

(

    rule_code,

    rule_name,

    max_size_mb,

    allowed_mime_types,

    blocked_extensions

)

VALUES


(

    'DOCUMENT_POLICY',

    'Business Document Validation',

    50,

    ARRAY[

        'application/pdf',

        'application/msword',

        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    ],

    ARRAY['exe','bat']

),


(

    'IMAGE_POLICY',

    'Image Validation',

    10,

    ARRAY[

        'image/png',

        'image/jpeg',

        'image/webp'

    ],

    ARRAY['exe']

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

        'buckets',

        'objects',

        'access_policies',

        'lifecycle_rules',

        'validation_rules'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON storage_management.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON storage_management.%I
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

ON SCHEMA storage_management

TO authenticated;



GRANT SELECT, INSERT, UPDATE

ON ALL TABLES IN SCHEMA storage_management

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

    38,

    '038_storage.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;

