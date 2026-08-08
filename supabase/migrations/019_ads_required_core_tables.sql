-- ============================================================
-- ADS 018 - REQUIRED CORE TABLES
-- ============================================================
-- Purpose:
--   Create only the currently missing production core tables.
--
-- Source:
--   017_ads_missing_foundation.sql
--
-- Safety:
--   CREATE TABLE IF NOT EXISTS only
--   No DROP
--   No DELETE
--   No TRUNCATE
--   No schema destruction
-- ============================================================

BEGIN;


-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

entity_type varchar(150) NOT NULL,

entity_id uuid,

action varchar(100) NOT NULL,

old_values jsonb,

new_values jsonb,

ip_address inet,

user_agent text,

performed_at timestamptz NOT NULL DEFAULT now(),

metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

CONSTRAINT fk_audit_org
FOREIGN KEY(organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE,

CONSTRAINT fk_audit_profile
FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);


-- ============================================================
-- TABLE: companies
-- ============================================================
CREATE TABLE IF NOT EXISTS companies
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_code varchar(50),

company_name varchar(255) NOT NULL,

legal_name varchar(255),

display_name varchar(255),

industry_id uuid,

company_type varchar(100),

website text,

email varchar(255),

phone varchar(50),

mobile varchar(50),

gst_number varchar(100),

tax_number varchar(100),

registration_number varchar(100),

employee_count integer,

annual_revenue numeric(18,2),

currency varchar(10),

timezone varchar(100),

status crm_status DEFAULT 'active',

owner_id uuid,

description text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
company_code
)

);


-- ============================================================
-- TABLE: contacts
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_id uuid,

contact_code varchar(50),

first_name varchar(150),

middle_name varchar(150),

last_name varchar(150),

display_name varchar(255),

job_title varchar(150),

department varchar(150),

email varchar(255),

phone varchar(50),

mobile varchar(50),

whatsapp varchar(50),

linkedin_url text,

date_of_birth date,

anniversary date,

owner_id uuid,

status crm_status DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
contact_code
)

);


-- ============================================================
-- TABLE: opportunities
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

opportunity_number varchar(50),

lead_id uuid,

company_id uuid,

contact_id uuid,

pipeline_stage_id uuid,

owner_id uuid,

title varchar(255) NOT NULL,

expected_revenue numeric(18,2),

forecast_revenue numeric(18,2),

currency varchar(10),

probability numeric(5,2),

expected_close_date date,

actual_close_date date,

priority varchar(50),

description text,

status varchar(50) DEFAULT 'open',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (lead_id)
REFERENCES leads(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (contact_id)
REFERENCES contacts(id),

FOREIGN KEY (pipeline_stage_id)
REFERENCES pipeline_stages(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
opportunity_number
)

);


-- ============================================================
-- TABLE: report_executions
-- ============================================================
CREATE TABLE IF NOT EXISTS report_executions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

report_id uuid NOT NULL,

executed_by uuid,

started_at timestamptz,

completed_at timestamptz,

execution_status varchar(50),

execution_time_ms integer,

result_location text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(report_id)
REFERENCES reports(id)
ON DELETE CASCADE,

FOREIGN KEY(executed_by)
REFERENCES profiles(id)

);


-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

COMMIT;
