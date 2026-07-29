BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM SERVICE FOUNDATION
-- Migration : 019
-- ============================================================================
-- Purpose
-- Enterprise customer service and support foundation.
--
-- Supports:
-- Customer Support Tickets
-- Service Queues
-- SLA Management
-- Customer Communication Tracking
-- Support Lifecycle
-- Service Analytics Foundation
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Future helpdesk extensible
-- No CRM capability removal
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- SERVICE QUEUES
-- ============================================================================
-- Support routing foundation.
--
-- Examples:
-- Customer Support
-- Technical Support
-- Billing Support
-- Priority Support
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.service_queues (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    queue_code TEXT NOT NULL,

    queue_name TEXT NOT NULL,

    description TEXT,

    queue_type TEXT DEFAULT 'SUPPORT',

    active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_service_queue

    UNIQUE(
        organization_id,
        queue_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_service_queue_org

ON crm.service_queues(organization_id);



-- ============================================================================
-- SERVICE QUEUE MEMBERS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.service_queue_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    queue_id UUID NOT NULL,

    user_id UUID NOT NULL,

    member_role TEXT DEFAULT 'AGENT',

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_service_queue_member_queue

    FOREIGN KEY(queue_id)

    REFERENCES crm.service_queues(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_service_queue_member

    UNIQUE(
        queue_id,
        user_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_service_queue_member_user

ON crm.service_queue_members(user_id);



-- ============================================================================
-- SERVICE TICKETS
-- ============================================================================
-- Core customer service entity.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.tickets (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    ticket_number TEXT NOT NULL,

    entity_type TEXT,

    entity_id UUID,

    company_id UUID,

    contact_id UUID,

    queue_id UUID,

    assigned_to UUID,

    ticket_type TEXT DEFAULT 'SUPPORT',

    ticket_priority TEXT DEFAULT 'MEDIUM',

    ticket_status TEXT DEFAULT 'OPEN',

    subject TEXT NOT NULL,

    description TEXT,

    resolution TEXT,

    first_response_at TIMESTAMPTZ,

    resolved_at TIMESTAMPTZ,

    closed_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_ticket_number

    UNIQUE(
        organization_id,
        ticket_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_ticket_org

ON crm.tickets(organization_id);



CREATE INDEX IF NOT EXISTS
idx_ticket_status

ON crm.tickets(ticket_status);



CREATE INDEX IF NOT EXISTS
idx_ticket_assignee

ON crm.tickets(assigned_to);



CREATE INDEX IF NOT EXISTS
idx_ticket_entity

ON crm.tickets(entity_type, entity_id);



-- ============================================================================
-- TICKET COMMENTS
-- ============================================================================
-- Customer/internal conversation history.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.ticket_comments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,

    comment_type TEXT DEFAULT 'INTERNAL',

    comment_text TEXT NOT NULL,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_ticket_comment_ticket

    FOREIGN KEY(ticket_id)

    REFERENCES crm.tickets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_ticket_comments_ticket

ON crm.ticket_comments(ticket_id);



-- ============================================================================
-- SLA DEFINITIONS
-- ============================================================================
-- Service response commitments.
--
-- Examples:
-- Critical: 1 hour
-- High: 4 hours
-- Normal: 24 hours
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.sla_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    sla_code TEXT NOT NULL,

    sla_name TEXT NOT NULL,

    priority_level TEXT NOT NULL,

    first_response_minutes INTEGER DEFAULT 1440,

    resolution_minutes INTEGER DEFAULT 4320,

    active BOOLEAN DEFAULT TRUE,

    configuration JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_sla_definition

    UNIQUE(
        organization_id,
        sla_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_sla_priority

ON crm.sla_definitions(priority_level);



-- ============================================================================
-- TICKET SLA TRACKING
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.ticket_sla_tracking (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,

    sla_id UUID NOT NULL,

    response_due_at TIMESTAMPTZ,

    resolution_due_at TIMESTAMPTZ,

    response_met BOOLEAN,

    resolution_met BOOLEAN,

    breached BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_ticket_sla_ticket

    FOREIGN KEY(ticket_id)

    REFERENCES crm.tickets(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_ticket_sla_definition

    FOREIGN KEY(sla_id)

    REFERENCES crm.sla_definitions(id)

);



CREATE INDEX IF NOT EXISTS
idx_ticket_sla_ticket

ON crm.ticket_sla_tracking(ticket_id);



-- ============================================================================
-- SERVICE COMMUNICATION EVENTS
-- ============================================================================
-- Unified customer interaction history.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.service_communication_events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    ticket_id UUID,

    entity_type TEXT,

    entity_id UUID,

    communication_type TEXT NOT NULL,

    direction TEXT DEFAULT 'OUTBOUND',

    subject TEXT,

    message TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_service_communication_entity

ON crm.service_communication_events(entity_type, entity_id);



CREATE INDEX IF NOT EXISTS
idx_service_communication_ticket

ON crm.service_communication_events(ticket_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'service_queues',

        'tickets',

        'sla_definitions'

    ]


    LOOP


        EXECUTE format(

            'DROP TRIGGER IF EXISTS trg_%1$s_updated
             ON crm.%1$s;',

            tbl

        );


        EXECUTE format(

            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON crm.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',

            tbl

        );


    END LOOP;


END;
$$;

BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM SERVICE FOUNDATION
-- Migration : 019
-- Part 2
-- ============================================================================
-- Purpose
-- Complete customer service intelligence layer.
--
-- Adds:
-- Default queues
-- Default SLA policies
-- Ticket lifecycle
-- Escalation management
-- Service analytics
-- Customer support health
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- DEFAULT SERVICE QUEUES
-- ============================================================================


INSERT INTO crm.service_queues
(
    queue_code,
    queue_name,
    queue_type
)

VALUES

(
    'CUSTOMER_SUPPORT',
    'Customer Support',
    'SUPPORT'
),

(
    'TECHNICAL_SUPPORT',
    'Technical Support',
    'TECHNICAL'
),

(
    'BILLING_SUPPORT',
    'Billing Support',
    'FINANCE'
),

(
    'CUSTOMER_SUCCESS',
    'Customer Success',
    'SUCCESS'
)

ON CONFLICT(
    organization_id,
    queue_code
)

DO NOTHING;



-- ============================================================================
-- DEFAULT SLA DEFINITIONS
-- ============================================================================


INSERT INTO crm.sla_definitions
(
    sla_code,
    sla_name,
    priority_level,
    first_response_minutes,
    resolution_minutes
)

VALUES

(
    'CRITICAL',
    'Critical Priority SLA',
    'CRITICAL',
    60,
    480
),

(
    'HIGH',
    'High Priority SLA',
    'HIGH',
    240,
    1440
),

(
    'MEDIUM',
    'Medium Priority SLA',
    'MEDIUM',
    480,
    2880
),

(
    'LOW',
    'Low Priority SLA',
    'LOW',
    1440,
    7200
)

ON CONFLICT(
    organization_id,
    sla_code
)

DO NOTHING;



-- ============================================================================
-- TICKET STATUS HISTORY
-- ============================================================================
-- Complete lifecycle audit.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.ticket_status_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,

    previous_status TEXT,

    new_status TEXT NOT NULL,

    changed_by UUID,

    change_reason TEXT,

    changed_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_ticket_status_history_ticket

    FOREIGN KEY(ticket_id)

    REFERENCES crm.tickets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_ticket_status_history_ticket

ON crm.ticket_status_history(ticket_id);



-- ============================================================================
-- TICKET ESCALATIONS
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.ticket_escalations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,

    escalation_level INTEGER DEFAULT 1,

    escalation_reason TEXT,

    escalated_to UUID,

    escalation_status TEXT DEFAULT 'OPEN',

    escalated_at TIMESTAMPTZ DEFAULT NOW(),

    resolved_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,


    CONSTRAINT fk_ticket_escalation_ticket

    FOREIGN KEY(ticket_id)

    REFERENCES crm.tickets(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_ticket_escalation_ticket

ON crm.ticket_escalations(ticket_id);



CREATE INDEX IF NOT EXISTS
idx_ticket_escalation_status

ON crm.ticket_escalations(escalation_status);



-- ============================================================================
-- SERVICE PERFORMANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_service_performance AS

SELECT

    t.organization_id,

    COUNT(*) AS total_tickets,

    COUNT(*) FILTER
    (
        WHERE t.ticket_status = 'OPEN'
    )
    AS open_tickets,


    COUNT(*) FILTER
    (
        WHERE t.ticket_status = 'RESOLVED'
    )
    AS resolved_tickets,


    COUNT(*) FILTER
    (
        WHERE t.ticket_status = 'CLOSED'
    )
    AS closed_tickets,


    ROUND(

        AVG(

            EXTRACT(

                EPOCH FROM

                (
                    COALESCE(
                        t.first_response_at,
                        NOW()
                    )
                    -
                    t.created_at
                )

            )
            /
            60

        ),

        2

    ) AS avg_response_minutes


FROM crm.tickets t


GROUP BY

t.organization_id;



-- ============================================================================
-- SLA COMPLIANCE VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_sla_compliance AS


SELECT

    t.organization_id,

    COUNT(ts.id) AS total_sla_records,


    COUNT(*) FILTER
    (
        WHERE ts.response_met = TRUE
    )
    AS response_success,


    COUNT(*) FILTER
    (
        WHERE ts.resolution_met = TRUE
    )
    AS resolution_success,


    COUNT(*) FILTER
    (
        WHERE ts.breached = TRUE
    )
    AS breached_cases


FROM crm.ticket_sla_tracking ts


JOIN crm.tickets t

ON t.id = ts.ticket_id


GROUP BY

t.organization_id;



-- ============================================================================
-- CUSTOMER SUPPORT HEALTH
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_customer_support_health AS


SELECT

    entity_type,

    entity_id,

    COUNT(*) AS total_interactions,

    COUNT(*) FILTER
    (
        WHERE ticket_status IN
        (
            'OPEN',
            'IN_PROGRESS'
        )
    )
    AS active_tickets,


    MAX(created_at)

    AS last_support_activity


FROM crm.tickets


GROUP BY

entity_type,

entity_id;



-- ============================================================================
-- SERVICE VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_service_health AS


SELECT

'SERVICE_QUEUES' AS check_name,

COUNT(*) AS total_records,

'PASS' AS status

FROM crm.service_queues



UNION ALL



SELECT

'TICKETS',

COUNT(*),

'PASS'

FROM crm.tickets



UNION ALL



SELECT

'SLA_DEFINITIONS',

COUNT(*),

'PASS'

FROM crm.sla_definitions;



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
    19,
    '019_crm_service.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;