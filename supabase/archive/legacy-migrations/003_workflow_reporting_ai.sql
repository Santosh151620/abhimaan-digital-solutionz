BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- WORKFLOW • REPORTING • AI FOUNDATION
-- Migration : 003
-- ============================================================================
-- Purpose
-- Enterprise Workflow Engine
-- Approval Engine
-- Business Rules
-- Reporting Engine
-- AI Readiness
-- Notification Routing
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS workflow;

CREATE SCHEMA IF NOT EXISTS reporting;

CREATE SCHEMA IF NOT EXISTS ai;

-- ============================================================================
-- WORKFLOW DEFINITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow.workflow_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_code TEXT NOT NULL UNIQUE,

    workflow_name TEXT NOT NULL,

    description TEXT,

    entity_type TEXT NOT NULL,

    version INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    allow_parallel BOOLEAN DEFAULT FALSE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_workflow_definition_entity
ON workflow.workflow_definitions(entity_type);

-- ============================================================================
-- WORKFLOW STEPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow.workflow_steps (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID NOT NULL,

    sequence_no INTEGER NOT NULL,

    step_code TEXT NOT NULL,

    step_name TEXT NOT NULL,

    approval_role TEXT,

    approval_level INTEGER,

    allow_delegate BOOLEAN DEFAULT TRUE,

    auto_approve BOOLEAN DEFAULT FALSE,

    sla_hours INTEGER,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_workflow_step_definition
    FOREIGN KEY(workflow_id)
    REFERENCES workflow.workflow_definitions(id)

);

CREATE INDEX IF NOT EXISTS
idx_workflow_steps_workflow
ON workflow.workflow_steps(workflow_id);

CREATE INDEX IF NOT EXISTS
idx_workflow_steps_sequence
ON workflow.workflow_steps(
    workflow_id,
    sequence_no
);

-- ============================================================================
-- WORKFLOW INSTANCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow.workflow_instances (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    workflow_id UUID NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id UUID NOT NULL,

    current_step INTEGER DEFAULT 1,

    status TEXT DEFAULT 'Running',

    started_by UUID,

    started_at TIMESTAMPTZ DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT fk_workflow_instance_definition
    FOREIGN KEY(workflow_id)
    REFERENCES workflow.workflow_definitions(id)

);

CREATE INDEX IF NOT EXISTS
idx_workflow_instance_org
ON workflow.workflow_instances(organization_id);

CREATE INDEX IF NOT EXISTS
idx_workflow_instance_entity
ON workflow.workflow_instances(
    entity_type,
    entity_id
);

-- ============================================================================
-- WORKFLOW ACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow.workflow_actions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_instance_id UUID NOT NULL,

    workflow_step_id UUID,

    action_type TEXT NOT NULL,

    action_by UUID,

    action_at TIMESTAMPTZ DEFAULT NOW(),

    remarks TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT fk_workflow_action_instance
    FOREIGN KEY(workflow_instance_id)
    REFERENCES workflow.workflow_instances(id)

);

CREATE INDEX IF NOT EXISTS
idx_workflow_actions_instance
ON workflow.workflow_actions(workflow_instance_id);
-- ============================================================================
-- DELEGATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow.delegations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    delegator_user_id UUID NOT NULL,

    delegate_user_id UUID NOT NULL,

    delegation_scope TEXT NOT NULL,

    start_date TIMESTAMPTZ NOT NULL,

    end_date TIMESTAMPTZ NOT NULL,

    approval_required BOOLEAN DEFAULT TRUE,

    approved_by UUID,

    approved_at TIMESTAMPTZ,

    status TEXT DEFAULT 'Pending',

    reason TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_delegation_org
ON workflow.delegations(organization_id);

CREATE INDEX IF NOT EXISTS
idx_delegation_users
ON workflow.delegations(
    delegator_user_id,
    delegate_user_id
);

-- ============================================================================
-- REPORT DEFINITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS reporting.report_definitions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_code TEXT NOT NULL UNIQUE,

    report_name TEXT NOT NULL,

    report_category TEXT,

    entity_type TEXT,

    description TEXT,

    sql_template TEXT,

    is_system BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_report_category
ON reporting.report_definitions(report_category);

-- ============================================================================
-- REPORT EXECUTION HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS reporting.report_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    report_id UUID NOT NULL,

    generated_by UUID,

    execution_status TEXT,

    execution_time_ms INTEGER,

    file_url TEXT,

    parameters JSONB DEFAULT '{}'::jsonb,

    generated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_report_definition
    FOREIGN KEY(report_id)
    REFERENCES reporting.report_definitions(id)

);

CREATE INDEX IF NOT EXISTS
idx_report_history_org
ON reporting.report_history(organization_id);

CREATE INDEX IF NOT EXISTS
idx_report_history_generated
ON reporting.report_history(generated_at);

-- ============================================================================
-- AI PROMPTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai.prompt_library (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    prompt_code TEXT NOT NULL UNIQUE,

    prompt_name TEXT NOT NULL,

    module_name TEXT,

    description TEXT,

    prompt_template TEXT NOT NULL,

    model_name TEXT,

    version INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS
idx_ai_prompt_module
ON ai.prompt_library(module_name);

-- ============================================================================
-- AI EXECUTION HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai.execution_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    prompt_id UUID,

    entity_type TEXT,

    entity_id UUID,

    requested_by UUID,

    model_name TEXT,

    tokens_used INTEGER,

    execution_time_ms INTEGER,

    status TEXT,

    response_summary TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_ai_prompt
    FOREIGN KEY(prompt_id)
    REFERENCES ai.prompt_library(id)

);

CREATE INDEX IF NOT EXISTS
idx_ai_history_org
ON ai.execution_history(organization_id);

CREATE INDEX IF NOT EXISTS
idx_ai_history_entity
ON ai.execution_history(
    entity_type,
    entity_id
);
-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

DO
$$
DECLARE
    tbl TEXT;
BEGIN

    FOREACH tbl IN ARRAY ARRAY[
        'workflow_definitions',
        'workflow_steps',
        'workflow_instances',
        'workflow_actions',
        'delegations'
    ]
    LOOP

        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated ON workflow.%1$s;',
            tbl
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON workflow.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );

    END LOOP;

    FOREACH tbl IN ARRAY ARRAY[
        'report_definitions'
    ]
    LOOP

        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated ON reporting.%1$s;',
            tbl
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON reporting.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );

    END LOOP;

    FOREACH tbl IN ARRAY ARRAY[
        'prompt_library'
    ]
    LOOP

        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated ON ai.%1$s;',
            tbl
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated
             BEFORE UPDATE
             ON ai.%1$s
             FOR EACH ROW
             EXECUTE FUNCTION public.set_updated_at();',
            tbl
        );

    END LOOP;

END;
$$;

-- ============================================================================
-- DEFAULT WORKFLOWS
-- ============================================================================

INSERT INTO workflow.workflow_definitions
(
    workflow_code,
    workflow_name,
    entity_type,
    description
)
VALUES
('LEAD_APPROVAL','Lead Approval','Lead','Lead approval workflow'),
('CLIENT_APPROVAL','Client Approval','Client','Client approval workflow'),
('PROJECT_APPROVAL','Project Approval','Project','Project approval workflow'),
('PAYMENT_APPROVAL','Payment Approval','Payment','Payment approval workflow'),
('USER_APPROVAL','User Approval','User','User lifecycle workflow')
ON CONFLICT (workflow_code)
DO NOTHING;

-- ============================================================================
-- DEFAULT REPORTS
-- ============================================================================

INSERT INTO reporting.report_definitions
(
    report_code,
    report_name,
    report_category,
    is_system
)
VALUES
('EXEC_SUMMARY','Executive Summary','Executive',TRUE),
('CRM_PIPELINE','CRM Pipeline','CRM',TRUE),
('CRM_REVENUE','Revenue Analysis','Finance',TRUE),
('PROJECT_STATUS','Project Status','Projects',TRUE),
('USER_ACTIVITY','User Activity','Administration',TRUE),
('AUDIT_REPORT','Audit Report','Security',TRUE)
ON CONFLICT (report_code)
DO NOTHING;

-- ============================================================================
-- DEFAULT AI PROMPTS
-- ============================================================================

INSERT INTO ai.prompt_library
(
    prompt_code,
    prompt_name,
    module_name,
    prompt_template
)
VALUES
(
    'CRM_SUMMARY',
    'CRM Summary',
    'CRM',
    'Summarize current CRM status.'
),
(
    'LEAD_SCORE',
    'Lead Scoring',
    'CRM',
    'Evaluate lead quality.'
),
(
    'PROJECT_STATUS',
    'Project Health',
    'Projects',
    'Summarize project progress.'
),
(
    'EXEC_DASHBOARD',
    'Executive Dashboard',
    'Executive',
    'Generate executive insights.'
)
ON CONFLICT (prompt_code)
DO NOTHING;

-- ============================================================================
-- WORKFLOW / REPORTING / AI FOUNDATION COMPLETE
-- ============================================================================

COMMIT;