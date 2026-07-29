BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- NOTIFICATIONS ALIGNMENT
-- Migration : 008
-- ============================================================================
-- Purpose
-- Align notification architecture across:
-- Website
-- CRM
-- Admin
-- Workflow Engine
-- Future Enterprise Modules
--
-- Principles:
-- Entity-driven
-- Tenant-aware
-- Multi-channel ready
-- Audit capable
-- Backward compatible
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS notifications;



-- ============================================================================
-- NOTIFICATION CORE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications.notifications (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID,

    entity_type TEXT,

    entity_id UUID,

    notification_type TEXT NOT NULL,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    priority TEXT DEFAULT 'NORMAL',

    status TEXT DEFAULT 'UNREAD',

    source_module TEXT,

    action_url TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()


);



CREATE INDEX IF NOT EXISTS
idx_notifications_org
ON notifications.notifications(organization_id);



CREATE INDEX IF NOT EXISTS
idx_notifications_user
ON notifications.notifications(user_id);



CREATE INDEX IF NOT EXISTS
idx_notifications_entity
ON notifications.notifications(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_notifications_status
ON notifications.notifications(status);



CREATE INDEX IF NOT EXISTS
idx_notifications_created
ON notifications.notifications(created_at);



-- ============================================================================
-- NOTIFICATION RECIPIENTS
-- Supports:
-- Multiple users
-- Team notifications
-- Delegation
-- Future escalation
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.notification_recipients (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id UUID NOT NULL,

    user_id UUID NOT NULL,

    delivery_status TEXT DEFAULT 'PENDING',

    read_at TIMESTAMPTZ,

    delivered_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_notification_recipient

    FOREIGN KEY(notification_id)

    REFERENCES notifications.notifications(id)

    ON DELETE CASCADE


);



CREATE INDEX IF NOT EXISTS
idx_notification_recipient_notification
ON notifications.notification_recipients(notification_id);



CREATE INDEX IF NOT EXISTS
idx_notification_recipient_user
ON notifications.notification_recipients(user_id);



-- ============================================================================
-- NOTIFICATION CHANNEL CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications.notification_channels (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    channel_code TEXT NOT NULL,

    channel_name TEXT NOT NULL,

    enabled BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_notification_channel

    UNIQUE(
        organization_id,
        channel_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_notification_channels_org
ON notifications.notification_channels(organization_id);



-- ============================================================================
-- USER NOTIFICATION PREFERENCES
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.user_preferences (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,

    notification_type TEXT NOT NULL,

    in_app_enabled BOOLEAN DEFAULT TRUE,

    email_enabled BOOLEAN DEFAULT TRUE,

    sms_enabled BOOLEAN DEFAULT FALSE,

    push_enabled BOOLEAN DEFAULT FALSE,

    preferences JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_user_notification_preference

    UNIQUE(
        organization_id,
        user_id,
        notification_type
    )

);



CREATE INDEX IF NOT EXISTS
idx_notification_preferences_user
ON notifications.user_preferences(user_id);



-- ============================================================================
-- NOTIFICATION TEMPLATE FOUNDATION
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.notification_templates (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    template_code TEXT NOT NULL UNIQUE,

    template_name TEXT NOT NULL,

    module_name TEXT,

    event_name TEXT,

    title_template TEXT NOT NULL,

    message_template TEXT NOT NULL,

    supported_channels JSONB DEFAULT '["IN_APP"]'::jsonb,

    variables JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_notification_template_module
ON notifications.notification_templates(module_name);



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN

    FOREACH tbl IN ARRAY ARRAY[

        'notifications',

        'notification_channels',

        'user_preferences',

        'notification_templates'

    ]

    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated 
             ON notifications.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON notifications.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );
    END LOOP;
END;
$$;

-- ============================================================================
-- NOTIFICATION EVENT REGISTRY
-- ============================================================================
-- Central registry for all system events.
-- Used by:
-- CRM
-- Admin
-- Workflow Engine
-- Automation
-- AI Assistants
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.notification_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_code TEXT NOT NULL UNIQUE,

    event_name TEXT NOT NULL,

    module_name TEXT NOT NULL,

    entity_type TEXT,

    description TEXT,

    severity TEXT DEFAULT 'INFO',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_notification_events_module
ON notifications.notification_events(module_name);



CREATE INDEX IF NOT EXISTS
idx_notification_events_entity
ON notifications.notification_events(entity_type);



-- ============================================================================
-- NOTIFICATION DELIVERY QUEUE
-- ============================================================================
-- Async processing foundation
-- Compatible with:
-- Resend
-- Push providers
-- SMS providers
-- Future event workers
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.delivery_queue (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id UUID NOT NULL,

    recipient_id UUID,

    channel_code TEXT NOT NULL,

    delivery_status TEXT DEFAULT 'PENDING',

    retry_count INTEGER DEFAULT 0,

    max_retries INTEGER DEFAULT 3,

    scheduled_at TIMESTAMPTZ DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    failure_reason TEXT,

    provider_reference TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delivery_notification

    FOREIGN KEY(notification_id)

    REFERENCES notifications.notifications(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_delivery_queue_status
ON notifications.delivery_queue(delivery_status);



CREATE INDEX IF NOT EXISTS
idx_delivery_queue_schedule
ON notifications.delivery_queue(scheduled_at);



-- ============================================================================
-- NOTIFICATION DELIVERY LOG
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.delivery_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_queue_id UUID,

    channel_code TEXT NOT NULL,

    provider_name TEXT,

    provider_reference TEXT,

    delivery_status TEXT,

    response_payload JSONB DEFAULT '{}'::jsonb,

    delivered_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delivery_log_queue

    FOREIGN KEY(delivery_queue_id)

    REFERENCES notifications.delivery_queue(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS
idx_delivery_logs_status
ON notifications.delivery_logs(delivery_status);



-- ============================================================================
-- NOTIFICATION RULES
-- ============================================================================
-- Supports future workflow automation:
--
-- IF Lead Created
-- THEN Notify Sales Manager
-- ============================================================================


CREATE TABLE IF NOT EXISTS notifications.notification_rules (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    rule_code TEXT NOT NULL,

    rule_name TEXT NOT NULL,

    event_code TEXT NOT NULL,

    target_type TEXT DEFAULT 'USER',

    target_configuration JSONB DEFAULT '{}'::jsonb,

    channel_configuration JSONB DEFAULT '{}'::jsonb,

    enabled BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_notification_rule

    UNIQUE(
        organization_id,
        rule_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_notification_rules_event
ON notifications.notification_rules(event_code);



-- ============================================================================
-- DEFAULT SYSTEM EVENTS
-- ============================================================================


INSERT INTO notifications.notification_events
(
    event_code,
    event_name,
    module_name,
    entity_type,
    description,
    severity
)

VALUES


(
    'LEAD_CREATED',
    'Lead Created',
    'CRM',
    'lead',
    'New lead created',
    'INFO'
),


(
    'LEAD_ASSIGNED',
    'Lead Assigned',
    'CRM',
    'lead',
    'Lead assigned to user',
    'INFO'
),


(
    'TASK_CREATED',
    'Task Created',
    'CRM',
    'task',
    'New task created',
    'INFO'
),


(
    'PAYMENT_RECEIVED',
    'Payment Received',
    'Finance',
    'payment',
    'Payment received',
    'SUCCESS'
),


(
    'SYSTEM_ALERT',
    'System Alert',
    'Platform',
    NULL,
    'Platform system notification',
    'WARNING'
)


ON CONFLICT(event_code)
DO NOTHING;



-- ============================================================================
-- DEFAULT NOTIFICATION TEMPLATES
-- ============================================================================


INSERT INTO notifications.notification_templates
(
    template_code,
    template_name,
    module_name,
    event_name,
    title_template,
    message_template,
    supported_channels
)

VALUES


(
    'TPL_LEAD_CREATED',

    'Lead Created Notification',

    'CRM',

    'LEAD_CREATED',

    'New Lead Created',

    'A new lead has been created and requires attention.',

    '["IN_APP","EMAIL"]'::jsonb
),


(
    'TPL_TASK_CREATED',

    'Task Created Notification',

    'CRM',

    'TASK_CREATED',

    'New Task Assigned',

    'A new task has been assigned to you.',

    '["IN_APP","EMAIL"]'::jsonb
),


(
    'TPL_SYSTEM_ALERT',

    'System Alert',

    'Platform',

    'SYSTEM_ALERT',

    'System Alert',

    'A platform event requires attention.',

    '["IN_APP"]'::jsonb
)


ON CONFLICT(template_code)
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

        'notification_events',

        'notification_rules'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated 
             ON notifications.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON notifications.%1$s
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
    8,
    '008_notifications_alignment.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);

COMMIT;


