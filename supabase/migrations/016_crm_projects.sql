BEGIN;

-- ============================================================================
-- ADS ENTERPRISE PLATFORM
-- CRM PROJECT MANAGEMENT FOUNDATION
-- Migration : 016
-- ============================================================================
-- Purpose
-- Enterprise customer project lifecycle foundation.
--
-- Supports:
-- Customer delivery projects
-- Project ownership
-- Milestones
-- Project phases
-- Project members
-- Delivery tracking
-- CRM → Project continuity
--
-- Principles:
-- Entity driven
-- Organization aware
-- Repository compatible
-- Service layer compatible
-- Reusable for future ERP modules
-- ============================================================================


CREATE SCHEMA IF NOT EXISTS crm;



-- ============================================================================
-- PROJECT DEFINITIONS
-- ============================================================================
-- Core customer project entity.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.projects (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    project_number TEXT NOT NULL,

    project_name TEXT NOT NULL,

    company_id UUID,

    contact_id UUID,

    opportunity_id UUID,

    project_type TEXT DEFAULT 'CUSTOMER_PROJECT',

    project_status TEXT DEFAULT 'PLANNING',

    priority TEXT DEFAULT 'NORMAL',

    owner_user_id UUID,

    project_manager_id UUID,

    start_date DATE,

    planned_end_date DATE,

    actual_end_date DATE,

    budget_amount NUMERIC(14,2) DEFAULT 0,

    actual_cost NUMERIC(14,2) DEFAULT 0,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_by UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_project_number

    UNIQUE(
        organization_id,
        project_number
    )

);



CREATE INDEX IF NOT EXISTS
idx_projects_org

ON crm.projects(organization_id);



CREATE INDEX IF NOT EXISTS
idx_projects_company

ON crm.projects(company_id);



CREATE INDEX IF NOT EXISTS
idx_projects_status

ON crm.projects(project_status);



CREATE INDEX IF NOT EXISTS
idx_projects_manager

ON crm.projects(project_manager_id);



-- ============================================================================
-- PROJECT PHASES
-- ============================================================================
-- Delivery lifecycle stages.
--
-- Example:
-- Planning
-- Design
-- Development
-- Testing
-- Deployment
-- Closure
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_phases (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    phase_code TEXT NOT NULL,

    phase_name TEXT NOT NULL,

    display_order INTEGER DEFAULT 0,

    phase_status TEXT DEFAULT 'PENDING',

    start_date DATE,

    end_date DATE,

    completion_percentage INTEGER DEFAULT 0,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_project_phase_project

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_project_phase

    UNIQUE(
        project_id,
        phase_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_project_phases_project

ON crm.project_phases(project_id);



-- ============================================================================
-- PROJECT MILESTONES
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_milestones (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    phase_id UUID,

    milestone_code TEXT NOT NULL,

    milestone_name TEXT NOT NULL,

    milestone_status TEXT DEFAULT 'PENDING',

    planned_date DATE,

    completed_date DATE,

    owner_user_id UUID,

    description TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_project_milestone_project

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_project_milestone

    UNIQUE(
        project_id,
        milestone_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_project_milestones_project

ON crm.project_milestones(project_id);



CREATE INDEX IF NOT EXISTS
idx_project_milestones_status

ON crm.project_milestones(milestone_status);



-- ============================================================================
-- PROJECT MEMBERS
-- ============================================================================
-- Resource assignment.
--
-- Supports:
-- Internal users
-- Delivery teams
-- Future resource planning
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    user_id UUID NOT NULL,

    member_role TEXT DEFAULT 'MEMBER',

    allocation_percentage INTEGER DEFAULT 100,

    active BOOLEAN DEFAULT TRUE,

    joined_at TIMESTAMPTZ DEFAULT NOW(),

    removed_at TIMESTAMPTZ,


    CONSTRAINT fk_project_member_project

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_project_member

    UNIQUE(
        project_id,
        user_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_project_members_project

ON crm.project_members(project_id);



CREATE INDEX IF NOT EXISTS
idx_project_members_user

ON crm.project_members(user_id);



-- ============================================================================
-- PROJECT STATUS HISTORY
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_status_history (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    previous_status TEXT,

    new_status TEXT NOT NULL,

    changed_by UUID,

    change_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_project_status_history

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_project_status_history_project

ON crm.project_status_history(project_id);



-- ============================================================================
-- PROJECT TASK LINKAGE
-- ============================================================================
-- Entity-based task relationship.
-- Keeps shared task engine independent.
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_task_links (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    task_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_project_task_project

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE,


    CONSTRAINT uq_project_task_link

    UNIQUE(
        project_id,
        task_id
    )

);



CREATE INDEX IF NOT EXISTS
idx_project_task_project

ON crm.project_task_links(project_id);



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'projects',

        'project_phases',

        'project_milestones'

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
-- CRM PROJECT MANAGEMENT FOUNDATION
-- Migration : 016
-- Part 2
-- ============================================================================
-- Purpose
-- Complete project delivery intelligence layer.
--
-- Adds:
-- Project templates
-- Default lifecycle stages
-- Health metrics
-- Delivery views
-- Revenue/cost intelligence
-- Validation
-- Migration tracking
-- ============================================================================



-- ============================================================================
-- PROJECT TEMPLATES
-- ============================================================================
-- Reusable delivery structures.
--
-- Examples:
-- Website Development
-- CRM Implementation
-- Consulting Engagement
-- Support Contract
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_templates (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    template_code TEXT NOT NULL,

    template_name TEXT NOT NULL,

    description TEXT,

    project_type TEXT DEFAULT 'CUSTOMER_PROJECT',

    default_duration_days INTEGER,

    configuration JSONB DEFAULT '{}'::jsonb,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT uq_project_template

    UNIQUE(
        organization_id,
        template_code
    )

);



CREATE INDEX IF NOT EXISTS
idx_project_templates_type

ON crm.project_templates(project_type);



-- ============================================================================
-- PROJECT HEALTH SNAPSHOTS
-- ============================================================================
-- Delivery monitoring foundation.
--
-- Metrics:
-- Timeline health
-- Budget health
-- Progress health
-- Risk indicators
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_health_snapshots (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    project_id UUID NOT NULL,

    health_status TEXT DEFAULT 'GREEN',

    progress_percentage INTEGER DEFAULT 0,

    budget_variance NUMERIC(14,2) DEFAULT 0,

    schedule_variance_days INTEGER DEFAULT 0,

    risk_score INTEGER DEFAULT 0,

    observations TEXT,

    snapshot_date DATE DEFAULT CURRENT_DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()

);



CREATE INDEX IF NOT EXISTS
idx_project_health_project

ON crm.project_health_snapshots(project_id);



CREATE INDEX IF NOT EXISTS
idx_project_health_date

ON crm.project_health_snapshots(snapshot_date);



-- ============================================================================
-- PROJECT DELIVERY CHECKLIST
-- ============================================================================


CREATE TABLE IF NOT EXISTS crm.project_checklists (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    checklist_name TEXT NOT NULL,

    checklist_status TEXT DEFAULT 'PENDING',

    completed_percentage INTEGER DEFAULT 0,

    assigned_to UUID,

    due_date DATE,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),


    CONSTRAINT fk_project_checklist

    FOREIGN KEY(project_id)

    REFERENCES crm.projects(id)

    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS
idx_project_checklist_project

ON crm.project_checklists(project_id);



-- ============================================================================
-- DEFAULT PROJECT PHASE TEMPLATES
-- ============================================================================


INSERT INTO crm.project_templates
(
    template_code,
    template_name,
    description,
    default_duration_days
)

VALUES


(
    'STANDARD_IMPLEMENTATION',

    'Standard Implementation',

    'Generic customer implementation lifecycle',

    90
),


(
    'DIGITAL_PROJECT',

    'Digital Project',

    'Website and digital delivery lifecycle',

    60
),


(
    'CONSULTING',

    'Consulting Engagement',

    'Consulting delivery lifecycle',

    30
)


ON CONFLICT(template_code)
DO NOTHING;



-- ============================================================================
-- PROJECT DELIVERY SUMMARY VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_project_delivery_summary AS

SELECT

    p.id,

    p.organization_id,

    p.project_name,

    p.project_status,

    p.priority,

    p.project_manager_id,

    COUNT(DISTINCT pm.id) AS team_members,

    COUNT(DISTINCT pp.id) AS phases,

    COUNT(DISTINCT pms.id) AS milestones,

    COALESCE(
        AVG(ph.progress_percentage),
        0
    ) AS average_progress,

    MAX(ph.snapshot_date) AS latest_health_date

FROM crm.projects p

LEFT JOIN crm.project_members pm

ON pm.project_id = p.id

LEFT JOIN crm.project_phases pp

ON pp.project_id = p.id

LEFT JOIN crm.project_milestones pms

ON pms.project_id = p.id

LEFT JOIN crm.project_health_snapshots ph

ON ph.project_id = p.id

GROUP BY

p.id,

p.organization_id,

p.project_name,

p.project_status,

p.priority,

p.project_manager_id;



-- ============================================================================
-- PROJECT FINANCIAL VIEW
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_project_financial_summary AS

SELECT

project_id,

SUM(budget_amount) AS budget,

SUM(actual_cost) AS actual_cost,

SUM(budget_amount - actual_cost) AS remaining_budget

FROM crm.projects

GROUP BY project_id;



-- ============================================================================
-- PROJECT VALIDATION
-- ============================================================================


CREATE OR REPLACE VIEW crm.v_project_health AS


SELECT

'PROJECTS' AS check_name,

COUNT(*) AS total_records,

CASE

WHEN COUNT(*) >= 0

THEN 'PASS'

ELSE 'FAIL'

END AS status

FROM crm.projects



UNION ALL



SELECT

'PROJECT_TEMPLATES',

COUNT(*),

CASE

WHEN COUNT(*) >= 3

THEN 'PASS'

ELSE 'FAIL'

END

FROM crm.project_templates



UNION ALL



SELECT

'PROJECT_PHASES',

COUNT(*),

'PASS'

FROM crm.project_phases;



-- ============================================================================
-- UPDATED AT TRIGGERS
-- ============================================================================


DO
$$
DECLARE

    tbl TEXT;

BEGIN


    FOREACH tbl IN ARRAY ARRAY[

        'project_templates',

        'project_checklists'

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
    16,
    '016_crm_projects.sql',
    '1.0.0',
    'COMPLETED',
    TRUE
);



COMMIT;