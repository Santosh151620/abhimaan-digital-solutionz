-- ============================================================
-- 012_seed_data.sql
-- PART 1
-- PLATFORM SECURITY SEED DATA
-- ============================================================

BEGIN;


-- ============================================================
-- PLATFORM ROLES
-- ============================================================

INSERT INTO admin_roles

(

    id,

    role_key,

    role_name,

    description,

    is_system_role

)

VALUES


(

gen_random_uuid(),

'platform_owner',

'Platform Owner',

'Full platform administration access',

TRUE

),


(

gen_random_uuid(),

'organization_admin',

'Organization Administrator',

'Complete organization management access',

TRUE

),


(

gen_random_uuid(),

'sales_manager',

'Sales Manager',

'Manage sales operations and pipeline',

TRUE

),


(

gen_random_uuid(),

'sales_user',

'Sales User',

'Execute sales activities',

TRUE

),


(

gen_random_uuid(),

'project_manager',

'Project Manager',

'Manage projects and delivery',

TRUE

),


(

gen_random_uuid(),

'support_agent',

'Support Agent',

'Handle customer support operations',

TRUE

),


(

gen_random_uuid(),

'finance_manager',

'Finance Manager',

'Manage financial approvals',

TRUE

),


(

gen_random_uuid(),

'procurement_manager',

'Procurement Manager',

'Manage procurement operations',

TRUE

),


(

gen_random_uuid(),

'inventory_manager',

'Inventory Manager',

'Manage stock operations',

TRUE

),


(

gen_random_uuid(),

'hr_manager',

'HR Manager',

'Manage employee operations',

TRUE

),


(

gen_random_uuid(),

'asset_manager',

'Asset Manager',

'Manage enterprise assets',

TRUE

)



ON CONFLICT(role_key)

DO NOTHING;



-- ============================================================
-- CORE PERMISSIONS
-- ============================================================


INSERT INTO admin_permissions

(

permission_key,

permission_name,

module

)

VALUES


('system.full_access','System Full Access','platform'),


('crm.full_access','CRM Full Access','crm'),

('lead.view','View Leads','crm'),

('lead.create','Create Leads','crm'),

('lead.update','Update Leads','crm'),

('lead.delete','Delete Leads','crm'),


('contact.view','View Contacts','crm'),

('company.view','View Companies','crm'),


('opportunity.manage','Manage Opportunities','crm'),

('pipeline.manage','Manage Pipeline','crm'),


('quotation.approve','Approve Quotations','crm'),


('project.manage','Manage Projects','crm'),


('ticket.manage','Manage Tickets','crm'),


('vendor.view','View Vendors','erp'),

('purchase.approve','Approve Purchase Orders','erp'),


('stock.view','View Inventory','erp'),

('stock.adjust','Adjust Inventory','erp'),


('invoice.manage','Manage Invoices','finance'),

('payment.approve','Approve Payments','finance'),


('employee.manage','Manage Employees','hr'),


('asset.manage','Manage Assets','erp')



ON CONFLICT(permission_key)

DO NOTHING;



-- ============================================================
-- ROLE PERMISSION ASSIGNMENTS
-- ============================================================


INSERT INTO admin_role_permissions

(

role_id,

permission_id

)


SELECT

r.id,

p.id


FROM admin_roles r

JOIN admin_permissions p

ON

(

(r.role_key='platform_owner')

OR


(r.role_key='organization_admin')

OR


(r.role_key='sales_user'

AND p.permission_key IN

(

'lead.view',

'lead.create',

'lead.update',

'contact.view',

'company.view'

))


OR


(r.role_key='sales_manager'

AND p.permission_key IN

(

'lead.view',

'lead.create',

'lead.update',

'lead.delete',

'opportunity.manage',

'pipeline.manage',

'quotation.approve'

))


OR


(r.role_key='project_manager'

AND p.permission_key='project.manage')


OR


(r.role_key='support_agent'

AND p.permission_key='ticket.manage')


OR


(r.role_key='finance_manager'

AND p.permission_key IN

(

'invoice.manage',

'payment.approve'

))


OR


(r.role_key='procurement_manager'

AND p.permission_key IN

(

'vendor.view',

'purchase.approve'

))


OR


(r.role_key='inventory_manager'

AND p.permission_key IN

(

'stock.view',

'stock.adjust'

))


OR


(r.role_key='hr_manager'

AND p.permission_key='employee.manage')


OR


(r.role_key='asset_manager'

AND p.permission_key='asset.manage')

);



-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================


INSERT INTO admin_platform_settings

(

setting_key,

setting_value

)

VALUES


(

'default_timezone',

'"Asia/Kolkata"'::jsonb

),


(

'default_currency',

'"INR"'::jsonb

),


(

'platform_name',

'"Abhimaan Digital Solutionz"'::jsonb

),


(

'enable_audit',

'true'::jsonb

),


(

'enable_notifications',

'true'::jsonb

)



ON CONFLICT(setting_key)

DO NOTHING;



COMMIT;
-- ============================================================
-- 012_seed_data.sql
-- PART 2
-- CRM + PLATFORM DEFAULT DATA
-- ============================================================

BEGIN;


-- ============================================================
-- DEFAULT SALES PIPELINE
-- ============================================================

INSERT INTO sales_pipelines

(

    id,

    organization_id,

    name,

    description,

    is_default

)

VALUES

(

    gen_random_uuid(),

    NULL,

    'Standard Sales Pipeline',

    'Default CRM sales pipeline',

    TRUE

)

ON CONFLICT DO NOTHING;



-- ============================================================
-- DEFAULT PIPELINE STAGES
-- ============================================================

INSERT INTO pipeline_stages

(

    id,

    pipeline_id,

    name,

    sequence,

    probability

)

SELECT

gen_random_uuid(),

sp.id,

stage.name,

stage.sequence,

stage.probability


FROM sales_pipelines sp


CROSS JOIN

(

VALUES

('New Lead',1,10),

('Contacted',2,20),

('Qualified',3,40),

('Proposal Sent',4,60),

('Negotiation',5,80),

('Won',6,100),

('Lost',7,0)

)

AS stage

(

name,

sequence,

probability

)


WHERE sp.name='Standard Sales Pipeline';



-- ============================================================
-- DEFAULT WORKFLOW TEMPLATES
-- ============================================================

INSERT INTO workflow_templates

(

name,

module,

trigger_event,

action_type,

is_active

)

VALUES


(

'New Lead Notification',

'crm',

'lead.created',

'notification',

TRUE

),


(

'Opportunity Won',

'crm',

'opportunity.won',

'notification',

TRUE

),


(

'Invoice Paid',

'finance',

'invoice.paid',

'notification',

TRUE

),


(

'Task Reminder',

'crm',

'task.due',

'notification',

TRUE

)


ON CONFLICT DO NOTHING;



-- ============================================================
-- NOTIFICATION TEMPLATES
-- ============================================================

INSERT INTO notification_templates

(

template_key,

title,

message

)

VALUES


(

'lead_created',

'New Lead Created',

'A new lead has been created'

),


(

'opportunity_updated',

'Opportunity Updated',

'Opportunity information changed'

),


(

'task_completed',

'Task Completed',

'Assigned task completed'

),


(

'invoice_paid',

'Payment Received',

'Invoice payment received'

)



ON CONFLICT(template_key)

DO NOTHING;



-- ============================================================
-- FEATURE FLAGS
-- ============================================================

INSERT INTO admin_feature_flags

(

feature_key,

feature_name,

description,

enabled

)

VALUES


(

'ai_sales_assistant',

'AI Sales Assistant',

'AI assisted sales intelligence',

FALSE

),


(

'workflow_automation',

'Workflow Automation',

'Automated business workflows',

TRUE

),


(

'advanced_reporting',

'Advanced Reporting',

'Executive reporting dashboards',

TRUE

),


(

'customer_portal',

'Customer Portal',

'External customer access',

FALSE

),


(

'multi_currency',

'Multi Currency',

'Multiple currency support',

FALSE

)



ON CONFLICT(feature_key)

DO NOTHING;



-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================

INSERT INTO admin_license_plans

(

plan_key,

plan_name,

description

)

VALUES


(

'starter',

'Starter',

'Small business CRM plan'

),


(

'professional',

'Professional',

'Growing business plan'

),


(

'enterprise',

'Enterprise',

'Full business operating system'

)



ON CONFLICT(plan_key)

DO NOTHING;



-- ============================================================
-- DEFAULT LOOKUP VALUES
-- ============================================================

INSERT INTO lookup_values

(

category,

value,

label

)

VALUES


('lead_source','website','Website'),

('lead_source','referral','Referral'),

('lead_source','social','Social Media'),


('priority','low','Low'),

('priority','medium','Medium'),

('priority','high','High'),


('status','active','Active'),

('status','inactive','Inactive')



ON CONFLICT DO NOTHING;



COMMIT;
-- ============================================================
-- 012_seed_data.sql
-- PART 3 FINAL
-- DEMO TENANT + SAMPLE DATA
-- ============================================================

BEGIN;


-- ============================================================
-- DEMO ORGANIZATION
-- ============================================================

INSERT INTO organizations

(

    id,

    name,

    slug,

    status

)

VALUES

(

    '00000000-0000-0000-0000-000000000001',

    'ADS Demo Organization',

    'ads-demo',

    'active'

)

ON CONFLICT(id)

DO NOTHING;



-- ============================================================
-- DEMO ORGANIZATION SETTINGS
-- ============================================================

INSERT INTO admin_organization_settings

(

organization_id,

setting_key,

setting_value

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'default_currency',

'"INR"'::jsonb

),


(

'00000000-0000-0000-0000-000000000001',

'timezone',

'"Asia/Kolkata"'::jsonb

)


ON CONFLICT DO NOTHING;



-- ============================================================
-- DEMO COMPANIES
-- ============================================================

INSERT INTO companies

(

organization_id,

name,

industry,

status

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'Bharat Technologies Pvt Ltd',

'Technology',

'active'

),


(

'00000000-0000-0000-0000-000000000001',

'Global Manufacturing Solutions',

'Manufacturing',

'active'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- DEMO CONTACTS
-- ============================================================

INSERT INTO contacts

(

organization_id,

first_name,

last_name,

email

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'Rahul',

'Sharma',

'rahul@example.com'

),


(

'00000000-0000-0000-0000-000000000001',

'Priya',

'Patel',

'priya@example.com'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- DEMO LEADS
-- ============================================================

INSERT INTO leads

(

organization_id,

first_name,

last_name,

company_name,

source,

status

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'Arjun',

'Mehta',

'Digital Innovations',

'website',

'new'

),


(

'00000000-0000-0000-0000-000000000001',

'Kiran',

'Rao',

'Smart Systems',

'referral',

'qualified'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- DEMO OPPORTUNITIES
-- ============================================================

INSERT INTO opportunities

(

organization_id,

name,

amount,

status

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'CRM Implementation Project',

250000,

'open'

),


(

'00000000-0000-0000-0000-000000000001',

'Enterprise Digital Transformation',

750000,

'proposal'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- DEMO ERP MASTER DATA
-- ============================================================

INSERT INTO vendors

(

organization_id,

name,

status

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'Demo Vendor',

'active'

)



ON CONFLICT DO NOTHING;



INSERT INTO inventory_items

(

organization_id,

name,

sku

)

VALUES


(

'00000000-0000-0000-0000-000000000001',

'Demo Service Package',

'ADS-SERVICE-001'

)



ON CONFLICT DO NOTHING;



-- ============================================================
-- SEED VALIDATION
-- ============================================================

DO $$

BEGIN


IF NOT EXISTS

(

SELECT 1

FROM organizations

WHERE id='00000000-0000-0000-0000-000000000001'

)

THEN

RAISE EXCEPTION

'Demo organization seed failed';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM companies

WHERE organization_id='00000000-0000-0000-0000-000000000001'

)

THEN

RAISE EXCEPTION

'CRM seed failed';


END IF;



IF NOT EXISTS

(

SELECT 1

FROM admin_roles

WHERE role_key='platform_owner'

)

THEN

RAISE EXCEPTION

'RBAC seed failed';


END IF;



END $$;



COMMIT;