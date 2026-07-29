BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- DATA MIGRATION FOUNDATION
-- Migration : 005
-- ============================================================================
-- Purpose
-- Normalize existing data
-- Populate new enterprise columns
-- Preserve legacy data
-- Zero data loss
-- Idempotent migration
-- ============================================================================

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

UPDATE public.organizations
SET

    code =
        COALESCE(
            code,
            UPPER(
                LEFT(
                    REGEXP_REPLACE(
                        name,
                        '[^A-Za-z0-9]',
                        '',
                        'g'
                    ),
                    8
                )
            )
        ),

    display_name =
        COALESCE(
            display_name,
            name
        ),

    organization_type =
        COALESCE(
            organization_type,
            'Customer'
        ),

    status =
        COALESCE(
            status,
            CASE
                WHEN is_active = TRUE
                    THEN 'Active'
                ELSE 'Suspended'
            END
        ),

    timezone =
        COALESCE(
            timezone,
            'UTC'
        ),

    language_code =
        COALESCE(
            language_code,
            'en'
        ),

    currency_code =
        COALESCE(
            currency_code,
            'USD'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- PROFILES
-- ============================================================================

UPDATE public.profiles
SET

    display_name =
        COALESCE(
            display_name,
            full_name
        ),

    first_name =
        COALESCE(
            first_name,
            split_part(full_name,' ',1)
        ),

    last_name =
        COALESCE(
            last_name,
            CASE
                WHEN strpos(full_name,' ') > 0
                THEN substring(
                    full_name
                    FROM strpos(full_name,' ')+1
                )
                ELSE NULL
            END
        ),

    employee_number =
        COALESCE(
            employee_number,
            public.generate_code('EMP')
        ),

    status =
        COALESCE(
            status,
            'Active'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- ORGANIZATION MEMBERS
-- ============================================================================

UPDATE public.organization_members
SET

    membership_number =
        COALESCE(
            membership_number,
            public.generate_code('MEM')
        ),

    joined_at =
        COALESCE(
            joined_at,
            created_at
        ),

    updated_at =
        NOW();
        -- ============================================================================
-- LEADS
-- ============================================================================

UPDATE public.leads
SET

    lead_number =
        COALESCE(
            lead_number,
            public.generate_code('LED')
        ),

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members om
                LIMIT 1
            )
        ),

    priority =
        COALESCE(
            priority,
            'Medium'
        ),

    source =
        COALESCE(
            source,
            'Manual'
        ),

    status =
        COALESCE(
            status,
            'New'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- CLIENTS
-- ============================================================================

UPDATE public.clients
SET

    client_number =
        COALESCE(
            client_number,
            public.generate_code('CLI')
        ),

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    customer_type =
        COALESCE(
            customer_type,
            'Customer'
        ),

    lifecycle_stage =
        COALESCE(
            lifecycle_stage,
            'Active'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- PROJECTS
-- ============================================================================

UPDATE public.projects
SET

    project_number =
        COALESCE(
            project_number,
            public.generate_code('PRJ')
        ),

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    priority =
        COALESCE(
            priority,
            'Medium'
        ),

    status =
        COALESCE(
            status,
            'Planning'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- TASKS
-- ============================================================================

UPDATE public.tasks
SET

    task_number =
        COALESCE(
            task_number,
            public.generate_code('TSK')
        ),

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    priority =
        COALESCE(
            priority,
            'Medium'
        ),

    status =
        COALESCE(
            status,
            'Open'
        ),

    updated_at =
        NOW();

-- ============================================================================
-- PAYMENTS
-- ============================================================================

UPDATE public.payments
SET

    payment_number =
        COALESCE(
            payment_number,
            public.generate_code('PAY')
        ),

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    payment_status =
        COALESCE(
            payment_status,
            'Pending'
        ),

    updated_at =
        NOW();
        -- ============================================================================
-- ACTIVITIES
-- ============================================================================

UPDATE public.activities
SET

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    activity_number =
        COALESCE(
            activity_number,
            public.generate_code('ACT')
        ),

    updated_at =
        NOW();

-- ============================================================================
-- NOTES
-- ============================================================================

UPDATE public.notes
SET

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    updated_at =
        NOW();

-- ============================================================================
-- ATTACHMENTS
-- ============================================================================

UPDATE public.attachments
SET

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    updated_at =
        NOW();

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

UPDATE public.notifications
SET

    organization_id =
        COALESCE(
            organization_id,
            (
                SELECT organization_id
                FROM public.organization_members
                LIMIT 1
            )
        ),

    updated_at =
        NOW();

-- ============================================================================
-- ENTITY TYPES
-- ============================================================================

INSERT INTO public.entity_types
(
    code,
    display_name
)
VALUES
('organization','Organization'),
('department','Department'),
('user','User'),
('lead','Lead'),
('client','Client'),
('contact','Contact'),
('opportunity','Opportunity'),
('quotation','Quotation'),
('project','Project'),
('task','Task'),
('invoice','Invoice'),
('payment','Payment'),
('activity','Activity'),
('note','Note'),
('attachment','Attachment'),
('notification','Notification'),
('workflow','Workflow'),
('report','Report')
ON CONFLICT (code)
DO NOTHING;

-- ============================================================================
-- REFRESH UPDATED TIMESTAMPS
-- ============================================================================

UPDATE public.organizations
SET updated_at = NOW();

UPDATE public.profiles
SET updated_at = NOW();

UPDATE public.organization_members
SET updated_at = NOW();

-- ============================================================================
-- DATA MIGRATION COMPLETE
-- ============================================================================

COMMIT;