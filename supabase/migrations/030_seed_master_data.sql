BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE MASTER DATA SEED
-- Migration : 030
-- ============================================================================
-- Purpose
-- Production-safe master data initialization.
--
-- Adds:
-- Default system roles
-- Permission catalog
-- CRM pipeline stages
-- Lead statuses
-- Opportunity stages
-- Task statuses
-- Workflow statuses
--
-- Principles:
-- Idempotent inserts
-- No duplicate master data
-- Extend existing architecture
-- Supabase compatible
-- ============================================================================



-- ============================================================================
-- SYSTEM ROLES
-- ============================================================================
-- Enterprise RBAC hierarchy.
-- ============================================================================


INSERT INTO security.roles
(
    role_code,
    role_name,
    description,
    active
)

VALUES

(
    'SUPER_ADMIN',
    'Super Administrator',
    'Complete platform administration access',
    TRUE
),


(
    'ADMIN',
    'Administrator',
    'Organization administration access',
    TRUE
),


(
    'MANAGER',
    'Manager',
    'Team and operational management access',
    TRUE
),


(
    'SALES',
    'Sales User',
    'Sales CRM access',
    TRUE
),


(
    'EMPLOYEE',
    'Employee',
    'Standard employee access',
    TRUE
),


(
    'CUSTOMER',
    'Customer',
    'Customer portal access',
    TRUE
)


ON CONFLICT(role_code)

DO UPDATE SET

role_name = EXCLUDED.role_name,

description = EXCLUDED.description;



-- ============================================================================
-- PERMISSION MASTER CATALOG
-- ============================================================================


INSERT INTO security.permissions
(
    permission_code,
    permission_name,
    module_name,
    description
)

VALUES


(
    'CRM_VIEW',
    'View CRM',
    'CRM',
    'Access CRM modules'
),


(
    'CRM_CREATE',
    'Create CRM Records',
    'CRM',
    'Create CRM entities'
),


(
    'CRM_UPDATE',
    'Update CRM Records',
    'CRM',
    'Modify CRM entities'
),


(
    'CRM_DELETE',
    'Delete CRM Records',
    'CRM',
    'Delete CRM entities'
),


(
    'REPORT_VIEW',
    'View Reports',
    'REPORTING',
    'Access business reports'
),


(
    'ADMIN_SETTINGS',
    'Manage Settings',
    'ADMIN',
    'Manage platform settings'
),


(
    'USER_MANAGEMENT',
    'Manage Users',
    'ADMIN',
    'Create and manage users'
),


(
    'WORKFLOW_MANAGE',
    'Manage Workflows',
    'WORKFLOW',
    'Configure automation workflows'
)


ON CONFLICT(permission_code)

DO UPDATE SET

permission_name = EXCLUDED.permission_name,

module_name = EXCLUDED.module_name,

description = EXCLUDED.description;



-- ============================================================================
-- CRM LEAD STATUS MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.lead_statuses

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    status_code TEXT UNIQUE NOT NULL,

    status_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.lead_statuses
(
    status_code,
    status_name,
    display_order
)

VALUES


(
    'NEW',
    'New Lead',
    1
),


(
    'CONTACTED',
    'Contacted',
    2
),


(
    'QUALIFIED',
    'Qualified',
    3
),


(
    'PROPOSAL',
    'Proposal Sent',
    4
),


(
    'CONVERTED',
    'Converted',
    5
),


(
    'LOST',
    'Lost',
    6
)


ON CONFLICT(status_code)

DO NOTHING;



-- ============================================================================
-- OPPORTUNITY STAGES
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.opportunity_stages

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    stage_code TEXT UNIQUE NOT NULL,

    stage_name TEXT NOT NULL,

    probability INTEGER DEFAULT 0,

    display_order INTEGER DEFAULT 0,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.opportunity_stages
(
    stage_code,
    stage_name,
    probability,
    display_order
)

VALUES


(
    'DISCOVERY',
    'Discovery',
    10,
    1
),


(
    'QUALIFICATION',
    'Qualification',
    25,
    2
),


(
    'PROPOSAL',
    'Proposal',
    50,
    3
),


(
    'NEGOTIATION',
    'Negotiation',
    75,
    4
),


(
    'WON',
    'Closed Won',
    100,
    5
),


(
    'LOST',
    'Closed Lost',
    0,
    6
)


ON CONFLICT(stage_code)

DO NOTHING;



-- ============================================================================
-- TASK STATUS MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.task_statuses

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    status_code TEXT UNIQUE NOT NULL,

    status_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.task_statuses
(
    status_code,
    status_name,
    display_order
)

VALUES


(
    'TODO',
    'To Do',
    1
),


(
    'IN_PROGRESS',
    'In Progress',
    2
),


(
    'BLOCKED',
    'Blocked',
    3
),


(
    'COMPLETED',
    'Completed',
    4
)


ON CONFLICT(status_code)

DO NOTHING;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- ENTERPRISE MASTER DATA SEED
-- Migration : 030
-- Part 2
-- ============================================================================
-- Purpose
-- Complete enterprise reference data initialization.
--
-- Adds:
-- Workflow templates
-- Notification types
-- Activity types
-- Document statuses
-- Industry masters
-- Country/region alignment
-- Default dashboard assignment
-- Validation framework
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- WORKFLOW TEMPLATE MASTER DATA
-- ============================================================================


INSERT INTO workflow.workflow_definitions
(
    workflow_code,
    workflow_name,
    description,
    active
)

VALUES


(
    'LEAD_FOLLOWUP',
    'Lead Follow Up Workflow',
    'Automated lead follow-up process',
    TRUE
),


(
    'OPPORTUNITY_APPROVAL',
    'Opportunity Approval Workflow',
    'Opportunity approval automation',
    TRUE
),


(
    'QUOTE_APPROVAL',
    'Quotation Approval Workflow',
    'Quotation review and approval process',
    TRUE
),


(
    'TASK_REMINDER',
    'Task Reminder Workflow',
    'Task deadline reminder automation',
    TRUE
),


(
    'CUSTOMER_ONBOARDING',
    'Customer Onboarding Workflow',
    'Customer onboarding automation',
    TRUE
)


ON CONFLICT(workflow_code)

DO UPDATE SET

workflow_name = EXCLUDED.workflow_name,

description = EXCLUDED.description;



-- ============================================================================
-- NOTIFICATION TYPES
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.notification_types

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type_code TEXT UNIQUE NOT NULL,

    type_name TEXT NOT NULL,

    description TEXT,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.notification_types
(
    type_code,
    type_name,
    description
)

VALUES


(
    'SYSTEM',
    'System Notification',
    'Platform generated notifications'
),


(
    'TASK',
    'Task Notification',
    'Task related alerts'
),


(
    'APPROVAL',
    'Approval Notification',
    'Approval workflow alerts'
),


(
    'REMINDER',
    'Reminder Notification',
    'Scheduled reminders'
),


(
    'SECURITY',
    'Security Notification',
    'Security related events'
)


ON CONFLICT(type_code)

DO NOTHING;



-- ============================================================================
-- ACTIVITY TYPES
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.activity_types

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    activity_code TEXT UNIQUE NOT NULL,

    activity_name TEXT NOT NULL,

    category TEXT,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.activity_types
(
    activity_code,
    activity_name,
    category
)

VALUES


(
    'CALL',
    'Phone Call',
    'COMMUNICATION'
),


(
    'EMAIL',
    'Email',
    'COMMUNICATION'
),


(
    'MEETING',
    'Meeting',
    'COMMUNICATION'
),


(
    'NOTE',
    'Internal Note',
    'DOCUMENTATION'
),


(
    'FOLLOWUP',
    'Follow Up',
    'SALES'
)



ON CONFLICT(activity_code)

DO NOTHING;



-- ============================================================================
-- DOCUMENT STATUS MASTER
-- ============================================================================


CREATE TABLE IF NOT EXISTS master.document_statuses

(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    status_code TEXT UNIQUE NOT NULL,

    status_name TEXT NOT NULL,

    category TEXT,

    active BOOLEAN DEFAULT TRUE

);



INSERT INTO master.document_statuses
(
    status_code,
    status_name,
    category
)

VALUES


(
    'DRAFT',
    'Draft',
    'GENERAL'
),


(
    'SUBMITTED',
    'Submitted',
    'GENERAL'
),


(
    'APPROVED',
    'Approved',
    'APPROVAL'
),


(
    'REJECTED',
    'Rejected',
    'APPROVAL'
),


(
    'ARCHIVED',
    'Archived',
    'GENERAL'
)



ON CONFLICT(status_code)

DO NOTHING;



-- ============================================================================
-- INDUSTRY MASTER DATA
-- ============================================================================


INSERT INTO master.industries
(
    industry_code,
    industry_name,
    active
)

VALUES


(
    'IT',
    'Information Technology',
    TRUE
),


(
    'HEALTHCARE',
    'Healthcare',
    TRUE
),


(
    'FINANCE',
    'Banking and Finance',
    TRUE
),


(
    'MANUFACTURING',
    'Manufacturing',
    TRUE
),


(
    'RETAIL',
    'Retail',
    TRUE
),


(
    'EDUCATION',
    'Education',
    TRUE
),


(
    'REAL_ESTATE',
    'Real Estate',
    TRUE
)



ON CONFLICT(industry_code)

DO UPDATE SET

industry_name = EXCLUDED.industry_name;



-- ============================================================================
-- DEFAULT DASHBOARD ASSIGNMENT RULES
-- ============================================================================


INSERT INTO dashboard.dashboard_role_assignments
(
    dashboard_id,
    role_code,
    access_level
)

SELECT

    d.id,

    r.role_code,

    'VIEW'


FROM dashboard.dashboard_definitions d


CROSS JOIN

(

    VALUES

    ('SUPER_ADMIN'),

    ('ADMIN'),

    ('MANAGER')

)

AS r(role_code)



WHERE d.dashboard_code = 'EXECUTIVE_OVERVIEW'



ON CONFLICT(

    dashboard_id,

    role_code

)

DO NOTHING;



-- ============================================================================
-- MASTER DATA VALIDATION VIEW
-- ============================================================================


CREATE OR REPLACE VIEW validation.v_master_data_health AS


SELECT

'ROLES' AS master_type,

COUNT(*) AS total_records

FROM security.roles



UNION ALL



SELECT

'PERMISSIONS',

COUNT(*)

FROM security.permissions



UNION ALL



SELECT

'LEAD_STATUSES',

COUNT(*)

FROM master.lead_statuses



UNION ALL



SELECT

'OPPORTUNITY_STAGES',

COUNT(*)

FROM master.opportunity_stages



UNION ALL



SELECT

'TASK_STATUSES',

COUNT(*)

FROM master.task_statuses;



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
    30,
    '030_seed_master_data.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;

