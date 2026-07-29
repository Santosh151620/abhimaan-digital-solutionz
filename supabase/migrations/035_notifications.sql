BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE NOTIFICATION ENGINE
-- Migration : 035
-- ============================================================================
-- Purpose
-- Unified notification architecture.
--
-- Supports:
-- CRM alerts
-- Admin notifications
-- System events
-- User preferences
-- Multi-channel delivery
-- Template-driven messaging
-- Future workflow automation
--
-- Principles:
-- Event driven
-- Entity agnostic
-- Multi-tenant ready
-- Repository compatible
-- Production safe
-- ============================================================================



CREATE SCHEMA IF NOT EXISTS notification;



-- ============================================================================
-- NOTIFICATION CHANNEL MASTER
-- ============================================================================
-- Delivery mechanisms.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.channels

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    channel_code TEXT UNIQUE NOT NULL,

    channel_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_notification_channels_active

ON notification.channels(active);



-- ============================================================================
-- NOTIFICATION EVENTS
-- ============================================================================
-- Business/system events generating notifications.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.events

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_code TEXT UNIQUE NOT NULL,

    event_name TEXT NOT NULL,

    module_name TEXT,

    description TEXT,

    severity TEXT DEFAULT 'INFO',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_notification_events_module

ON notification.events(module_name);



-- ============================================================================
-- NOTIFICATION TEMPLATES
-- ============================================================================
-- Reusable notification content.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.templates

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    template_code TEXT UNIQUE NOT NULL,

    template_name TEXT NOT NULL,

    channel_id UUID,

    subject_template TEXT,

    body_template TEXT NOT NULL,

    variables JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_notification_template_channel

    FOREIGN KEY(channel_id)

    REFERENCES notification.channels(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_notification_templates_channel

ON notification.templates(channel_id);



-- ============================================================================
-- USER NOTIFICATION PREFERENCES
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.user_preferences

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    channel_id UUID NOT NULL,

    enabled BOOLEAN DEFAULT TRUE,

    quiet_hours JSONB DEFAULT '{}'::jsonb,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_user_preference_channel

    FOREIGN KEY(channel_id)

    REFERENCES notification.channels(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_user_channel_preference

    UNIQUE

    (

        user_id,

        channel_id

    )

);



CREATE INDEX IF NOT EXISTS

idx_user_notification_preferences

ON notification.user_preferences(user_id);



-- ============================================================================
-- NOTIFICATION DELIVERY QUEUE
-- ============================================================================
-- Async processing foundation.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.delivery_queue

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    user_id UUID,

    event_id UUID,

    template_id UUID,

    entity_type TEXT,

    entity_id UUID,

    channel_id UUID,

    delivery_status TEXT DEFAULT 'PENDING',

    priority TEXT DEFAULT 'NORMAL',

    scheduled_at TIMESTAMPTZ DEFAULT NOW(),

    delivered_at TIMESTAMPTZ,

    failure_reason TEXT,

    payload JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_delivery_event

    FOREIGN KEY(event_id)

    REFERENCES notification.events(id)

    ON DELETE SET NULL,


    CONSTRAINT fk_delivery_template

    FOREIGN KEY(template_id)

    REFERENCES notification.templates(id)

    ON DELETE SET NULL,


    CONSTRAINT fk_delivery_channel

    FOREIGN KEY(channel_id)

    REFERENCES notification.channels(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_delivery_queue_status

ON notification.delivery_queue(delivery_status);



CREATE INDEX IF NOT EXISTS

idx_delivery_queue_user

ON notification.delivery_queue(user_id);



-- ============================================================================
-- NOTIFICATION HISTORY
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.history

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    queue_id UUID,

    user_id UUID,

    organization_id UUID,

    delivery_status TEXT,

    delivered_at TIMESTAMPTZ,

    response_payload JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_notification_history_queue

    FOREIGN KEY(queue_id)

    REFERENCES notification.delivery_queue(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_notification_history_user

ON notification.history(user_id);



-- ============================================================================
-- STANDARD CHANNEL SEEDS
-- ============================================================================


INSERT INTO notification.channels

(

    channel_code,

    channel_name,

    description

)

VALUES


(

    'IN_APP',

    'In Application',

    'Application notifications'

),


(

    'EMAIL',

    'Email',

    'Email based notifications'

),


(

    'SMS',

    'SMS',

    'Text message notifications'

),


(

    'PUSH',

    'Push Notification',

    'Mobile/web push notifications'

)


ON CONFLICT(channel_code)

DO UPDATE SET

channel_name = EXCLUDED.channel_name;



-- ============================================================================
-- STANDARD EVENT SEEDS
-- ============================================================================


INSERT INTO notification.events

(

    event_code,

    event_name,

    module_name,

    severity

)

VALUES


(

    'LEAD_CREATED',

    'Lead Created',

    'CRM',

    'INFO'

),


(

    'TASK_ASSIGNED',

    'Task Assigned',

    'CRM',

    'INFO'

),


(

    'PAYMENT_RECEIVED',

    'Payment Received',

    'FINANCE',

    'SUCCESS'

),


(

    'SECURITY_ALERT',

    'Security Alert',

    'ADMIN',

    'HIGH'

)


ON CONFLICT(event_code)

DO UPDATE SET

event_name = EXCLUDED.event_name;

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE NOTIFICATION ENGINE
-- Migration : 035
-- Part 2
-- ============================================================================
-- Purpose
-- Complete notification intelligence layer.
--
-- Adds:
-- Notification templates
-- Entity payload support
-- Workflow integration
-- Analytics
-- Retry handling
-- Security alignment
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- TEMPLATE SEEDS
-- ============================================================================


INSERT INTO notification.templates

(

    template_code,

    template_name,

    channel_id,

    subject_template,

    body_template,

    variables

)


SELECT


    t.template_code,

    t.template_name,

    c.id,

    t.subject_template,

    t.body_template,

    t.variables::jsonb



FROM

(

VALUES


(

    'LEAD_CREATED_EMAIL',

    'Lead Created Email',

    'EMAIL',

    'New Lead Created',

    'A new lead {{lead_name}} has been created.',

    '{"lead_name":"text"}'

),


(

    'TASK_ASSIGNED_IN_APP',

    'Task Assigned Notification',

    'IN_APP',

    'Task Assigned',

    'A task has been assigned to you.',

    '{}'

),


(

    'SECURITY_ALERT_EMAIL',

    'Security Alert',

    'EMAIL',

    'Security Alert',

    'A security event requires your attention.',

    '{}'

)

)

AS t

(

    template_code,

    template_name,

    channel_code,

    subject_template,

    body_template,

    variables

)



JOIN notification.channels c

ON c.channel_code=t.channel_code



ON CONFLICT(template_code)

DO UPDATE SET

template_name = EXCLUDED.template_name,

body_template = EXCLUDED.body_template;



-- ============================================================================
-- ENTITY NOTIFICATION CONTEXT
-- ============================================================================
-- Generic entity-driven notification payload.
-- Compatible with CRM entity architecture.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.entity_notifications

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    user_id UUID,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    event_code TEXT NOT NULL,

    notification_title TEXT,

    notification_message TEXT,

    read_status BOOLEAN DEFAULT FALSE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS

idx_entity_notifications_entity

ON notification.entity_notifications

(

    entity_type,

    entity_id

);



CREATE INDEX IF NOT EXISTS

idx_entity_notifications_user

ON notification.entity_notifications(user_id);



CREATE INDEX IF NOT EXISTS

idx_entity_notifications_unread

ON notification.entity_notifications

(

    user_id,

    read_status

);



-- ============================================================================
-- WORKFLOW NOTIFICATION RULES
-- ============================================================================
-- Connects workflow engine with notifications.
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.workflow_rules

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_code TEXT NOT NULL,

    event_id UUID NOT NULL,

    template_id UUID,

    enabled BOOLEAN DEFAULT TRUE,

    conditions JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_workflow_notification_event

    FOREIGN KEY(event_id)

    REFERENCES notification.events(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_workflow_notification_template

    FOREIGN KEY(template_id)

    REFERENCES notification.templates(id)

    ON DELETE SET NULL

);



CREATE INDEX IF NOT EXISTS

idx_notification_workflow_rules

ON notification.workflow_rules(workflow_code);



-- ============================================================================
-- DELIVERY RETRY FOUNDATION
-- ============================================================================


CREATE TABLE IF NOT EXISTS notification.delivery_attempts

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    queue_id UUID NOT NULL,

    attempt_number INTEGER DEFAULT 1,

    attempt_status TEXT DEFAULT 'FAILED',

    error_message TEXT,

    attempted_at TIMESTAMPTZ DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb,


    CONSTRAINT fk_delivery_attempt_queue

    FOREIGN KEY(queue_id)

    REFERENCES notification.delivery_queue(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS

idx_delivery_attempt_queue

ON notification.delivery_attempts(queue_id);



-- ============================================================================
-- NOTIFICATION ANALYTICS
-- ============================================================================


CREATE OR REPLACE VIEW analytics.v_notification_summary AS


SELECT


    delivery_status,


    COUNT(*) AS notification_count



FROM notification.delivery_queue



GROUP BY

delivery_status;



CREATE OR REPLACE VIEW analytics.v_user_notification_activity AS


SELECT


    user_id,


    COUNT(*) AS total_notifications,


    COUNT(*)

    FILTER

    (

        WHERE read_status = FALSE

    )

    AS unread_notifications



FROM notification.entity_notifications



GROUP BY

user_id;



-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================


DO
$$

DECLARE

    tbl TEXT;


BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'channels',

        'events',

        'templates',

        'user_preferences',

        'entity_notifications',

        'workflow_rules'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%s_updated
             ON notification.%I;',

            tbl,

            tbl

        );



        EXECUTE format(

            'CREATE TRIGGER trg_%s_updated
             BEFORE UPDATE
             ON notification.%I
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

ON SCHEMA notification

TO authenticated;



GRANT SELECT, INSERT, UPDATE

ON ALL TABLES IN SCHEMA notification

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

    35,

    '035_notifications.sql',

    '1.0.0',

    'COMPLETED',

    TRUE

);



COMMIT;