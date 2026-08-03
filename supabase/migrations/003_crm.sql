-- ==========================================================
-- ADS CRM PLATFORM
-- Migration: 003_crm.sql
-- PART 1
-- CRM FOUNDATION
-- ==========================================================

BEGIN;

-------------------------------------------------------------
-- ENUMS
-------------------------------------------------------------

DO $$ BEGIN
CREATE TYPE crm_status AS ENUM
(
'active',
'inactive',
'archived'
);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE TYPE lead_source AS ENUM
(
'website',
'manual',
'email',
'phone',
'social',
'campaign',
'partner',
'referral',
'api',
'import'
);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-------------------------------------------------------------
-- COMPANIES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- CONTACTS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- CONTACT ADDRESSES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_addresses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

address_type varchar(50),

address_line1 text,

address_line2 text,

city varchar(150),

state varchar(150),

postal_code varchar(30),

country varchar(100),

latitude numeric(12,8),

longitude numeric(12,8),

is_primary boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CONTACT COMMUNICATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_communications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

communication_type varchar(50),

communication_value text,

is_primary boolean DEFAULT false,

is_verified boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CONTACT RELATIONSHIPS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_relationships
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contact_id uuid NOT NULL,

related_contact_id uuid NOT NULL,

relationship_type varchar(100),

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE,

FOREIGN KEY(related_contact_id)
REFERENCES contacts(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- LEAD SOURCES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_sources
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

description text,

is_default boolean DEFAULT false,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

-------------------------------------------------------------
-- LEAD STATUSES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_statuses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

stage_order integer DEFAULT 0,

is_closed boolean DEFAULT false,

is_won boolean DEFAULT false,

color varchar(20),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

-------------------------------------------------------------
-- LEADS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leads
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

lead_number varchar(50),

company_id uuid,

contact_id uuid,

source_id uuid,

status_id uuid,

owner_id uuid,

title varchar(255),

expected_value numeric(18,2),

currency varchar(10),

probability numeric(5,2),

priority varchar(50),

lead_temperature varchar(50),

estimated_close_date date,

last_contact_date timestamptz,

next_followup_date timestamptz,

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

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (contact_id)
REFERENCES contacts(id),

FOREIGN KEY (source_id)
REFERENCES lead_sources(id),

FOREIGN KEY (status_id)
REFERENCES lead_statuses(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
lead_number
)

);

-------------------------------------------------------------
-- LEAD ASSIGNMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_assignments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

assigned_to uuid NOT NULL,

assigned_by uuid,

assigned_at timestamptz DEFAULT now(),

reason text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE,

FOREIGN KEY (assigned_to)
REFERENCES profiles(id),

FOREIGN KEY (assigned_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- LEAD QUALIFICATION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_qualification
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

budget boolean,

authority boolean,

need_identified boolean,

timeline boolean,

score integer DEFAULT 0,

qualified_by uuid,

qualified_at timestamptz,

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE,

FOREIGN KEY (qualified_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- LEAD STATUS HISTORY
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_status_history
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

old_status uuid,

new_status uuid,

changed_by uuid,

changed_at timestamptz DEFAULT now(),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- LEAD SCORING
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_scoring
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

lead_id uuid NOT NULL,

engagement_score integer DEFAULT 0,

behavior_score integer DEFAULT 0,

fit_score integer DEFAULT 0,

ai_score integer DEFAULT 0,

total_score integer DEFAULT 0,

last_calculated timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (lead_id)
REFERENCES leads(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- PIPELINE STAGES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pipeline_stages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

name varchar(150) NOT NULL,

code varchar(100) NOT NULL,

stage_order integer NOT NULL,

default_probability numeric(5,2),

color varchar(20),

is_closed boolean DEFAULT false,

is_won boolean DEFAULT false,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE (organization_id, code)

);

-------------------------------------------------------------
-- OPPORTUNITIES
-------------------------------------------------------------

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

-------------------------------------------------------------
-- OPPORTUNITY HISTORY
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS opportunity_history
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

old_stage_id uuid,

new_stage_id uuid,

old_probability numeric(5,2),

new_probability numeric(5,2),

changed_by uuid,

changed_at timestamptz DEFAULT now(),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- SALES FORECAST
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sales_forecasts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

forecast_period date NOT NULL,

forecast_type varchar(50),

expected_revenue numeric(18,2),

committed_revenue numeric(18,2),

best_case_revenue numeric(18,2),

worst_case_revenue numeric(18,2),

generated_by uuid,

generated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (generated_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- REVENUE PIPELINE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS revenue_pipeline
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

pipeline_stage_id uuid,

expected_amount numeric(18,2),

weighted_amount numeric(18,2),

probability numeric(5,2),

forecast_month date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE,

FOREIGN KEY(pipeline_stage_id)
REFERENCES pipeline_stages(id)

);

-------------------------------------------------------------
-- OPPORTUNITY COMPETITORS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS opportunity_competitors
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

competitor_name varchar(255),

strengths text,

weaknesses text,

win_probability numeric(5,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- OPPORTUNITY PRODUCTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS opportunity_products
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

opportunity_id uuid NOT NULL,

product_id uuid,

quantity numeric(18,2),

unit_price numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(opportunity_id)
REFERENCES opportunities(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- ACTIVITIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100) NOT NULL,

entity_id uuid NOT NULL,

activity_type varchar(100) NOT NULL,

subject varchar(255),

description text,

activity_datetime timestamptz,

duration_minutes integer,

status varchar(50),

owner_id uuid,

completed_by uuid,

completed_at timestamptz,

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
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- ACTIVITY TIMELINE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activity_timeline
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

timeline_type varchar(100),

timeline_title varchar(255),

timeline_description text,

event_datetime timestamptz DEFAULT now(),

performed_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE,

FOREIGN KEY(performed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- MEETINGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS meetings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

meeting_mode varchar(50),

meeting_link text,

meeting_location text,

agenda text,

minutes text,

recording_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CALLS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS calls
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

call_direction varchar(50),

phone_number varchar(50),

call_duration integer,

call_result varchar(100),

recording_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- EMAILS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS emails
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

activity_id uuid NOT NULL,

from_email varchar(255),

to_email text,

cc_email text,

bcc_email text,

subject varchar(500),

body text,

email_status varchar(100),

sent_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(activity_id)
REFERENCES activities(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- NOTES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100) NOT NULL,

entity_id uuid NOT NULL,

title varchar(255),

note text NOT NULL,

is_private boolean DEFAULT false,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- ATTACHMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attachments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100) NOT NULL,

entity_id uuid NOT NULL,

file_name varchar(255),

original_name varchar(255),

mime_type varchar(100),

file_size bigint,

storage_path text,

public_url text,

uploaded_by uuid,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(uploaded_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- TASKS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tasks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

parent_task_id uuid,

title varchar(255) NOT NULL,

description text,

priority varchar(50),

status varchar(50),

assigned_to uuid,

assigned_by uuid,

start_date timestamptz,

due_date timestamptz,

completed_at timestamptz,

estimated_hours numeric(10,2),

actual_hours numeric(10,2),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

deleted_at timestamptz,

is_deleted boolean DEFAULT false,

is_active boolean DEFAULT true,

version integer DEFAULT 1,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(parent_task_id)
REFERENCES tasks(id),

FOREIGN KEY(assigned_to)
REFERENCES profiles(id),

FOREIGN KEY(assigned_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- QUOTATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quotations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

quotation_number varchar(50) NOT NULL,

opportunity_id uuid,

company_id uuid NOT NULL,

contact_id uuid,

owner_id uuid,

status varchar(50) DEFAULT 'draft',

issue_date date,

expiry_date date,

subtotal numeric(18,2) DEFAULT 0,

discount_amount numeric(18,2) DEFAULT 0,

tax_amount numeric(18,2) DEFAULT 0,

shipping_amount numeric(18,2) DEFAULT 0,

grand_total numeric(18,2) DEFAULT 0,

currency varchar(10),

terms_conditions text,

notes text,

approved_by uuid,

approved_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),
FOREIGN KEY (owner_id) REFERENCES profiles(id),

UNIQUE(organization_id, quotation_number)

);

-------------------------------------------------------------
-- QUOTATION ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quotation_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

quotation_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount_percent numeric(8,2),

discount_amount numeric(18,2),

tax_percent numeric(8,2),

tax_amount numeric(18,2),

line_total numeric(18,2),

sort_order integer DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (quotation_id)
REFERENCES quotations(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- SALES ORDERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sales_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

sales_order_number varchar(50) NOT NULL,

quotation_id uuid,

company_id uuid NOT NULL,

contact_id uuid,

status varchar(50) DEFAULT 'draft',

order_date date,

delivery_date date,

subtotal numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

grand_total numeric(18,2),

currency varchar(10),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (quotation_id) REFERENCES quotations(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),

UNIQUE(organization_id,sales_order_number)

);

-------------------------------------------------------------
-- SALES ORDER ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sales_order_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

sales_order_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (sales_order_id)
REFERENCES sales_orders(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CONTRACTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contracts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

contract_number varchar(50) NOT NULL,

sales_order_id uuid,

company_id uuid NOT NULL,

contract_title varchar(255),

contract_type varchar(100),

contract_status varchar(50),

effective_date date,

expiry_date date,

renewal_date date,

contract_value numeric(18,2),

currency varchar(10),

signed_by_customer boolean DEFAULT false,

signed_by_company boolean DEFAULT false,

document_url text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),
FOREIGN KEY (company_id) REFERENCES companies(id),

UNIQUE(organization_id,contract_number)

);

-------------------------------------------------------------
-- CONTRACT MILESTONES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contract_milestones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id uuid NOT NULL,

title varchar(255),

description text,

planned_date date,

completed_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CONTRACT RENEWALS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contract_renewals
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id uuid NOT NULL,

renewal_number integer,

renewal_date date,

new_expiry_date date,

renewal_amount numeric(18,2),

status varchar(50),

notes text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (contract_id)
REFERENCES contracts(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- PRODUCT CATEGORIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

parent_category_id uuid,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (parent_category_id)
REFERENCES product_categories(id)

);

-------------------------------------------------------------
-- PRODUCTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS products
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_id uuid,

product_code varchar(50) NOT NULL,

product_name varchar(255) NOT NULL,

product_type varchar(100),

sku varchar(100),

barcode varchar(100),

description text,

short_description text,

unit_of_measure varchar(50),

standard_cost numeric(18,2),

list_price numeric(18,2),

currency varchar(10),

tax_percentage numeric(8,2),

is_sellable boolean DEFAULT true,

is_service boolean DEFAULT false,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (category_id)
REFERENCES product_categories(id),

UNIQUE
(
organization_id,
product_code
)

);

-------------------------------------------------------------
-- PRICE BOOKS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS price_books
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

price_book_name varchar(255),

description text,

currency varchar(10),

effective_from date,

effective_to date,

is_default boolean DEFAULT false,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- PRODUCT PRICING
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_pricing
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

price_book_id uuid NOT NULL,

product_id uuid NOT NULL,

unit_price numeric(18,2),

minimum_price numeric(18,2),

maximum_discount_percent numeric(8,2),

effective_from date,

effective_to date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (price_book_id)
REFERENCES price_books(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- PRODUCT INVENTORY
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_inventory
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

product_id uuid NOT NULL,

warehouse_name varchar(255),

quantity_on_hand numeric(18,2),

quantity_reserved numeric(18,2),

reorder_level numeric(18,2),

reorder_quantity numeric(18,2),

last_stock_update timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (product_id)
REFERENCES products(id)

);

-------------------------------------------------------------
-- PRODUCT BUNDLES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_bundles
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bundle_product_id uuid NOT NULL,

child_product_id uuid NOT NULL,

quantity numeric(18,2),

sort_order integer DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(bundle_product_id)
REFERENCES products(id)
ON DELETE CASCADE,

FOREIGN KEY(child_product_id)
REFERENCES products(id)

);

-------------------------------------------------------------
-- PRODUCT ATTACHMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_attachments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

product_id uuid NOT NULL,

attachment_name varchar(255),

attachment_type varchar(100),

storage_path text,

public_url text,

file_size bigint,

mime_type varchar(100),

uploaded_by uuid,

uploaded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(product_id)
REFERENCES products(id)
ON DELETE CASCADE,

FOREIGN KEY(uploaded_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- INVOICES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS invoices
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

invoice_number varchar(50) NOT NULL,

company_id uuid NOT NULL,

contact_id uuid,

contract_id uuid,

sales_order_id uuid,

invoice_date date NOT NULL,

due_date date,

status varchar(50) DEFAULT 'draft',

subtotal numeric(18,2) DEFAULT 0,

discount_amount numeric(18,2) DEFAULT 0,

tax_amount numeric(18,2) DEFAULT 0,

grand_total numeric(18,2) DEFAULT 0,

balance_due numeric(18,2) DEFAULT 0,

currency varchar(10),

notes text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),
FOREIGN KEY (company_id) REFERENCES companies(id),
FOREIGN KEY (contact_id) REFERENCES contacts(id),
FOREIGN KEY (contract_id) REFERENCES contracts(id),
FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),

UNIQUE(organization_id,invoice_number)

);

-------------------------------------------------------------
-- INVOICE ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS invoice_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

invoice_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_price numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

line_total numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(invoice_id)
REFERENCES invoices(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- PAYMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

payment_number varchar(50),

invoice_id uuid,

company_id uuid,

payment_date date,

payment_method varchar(100),

payment_status varchar(50),

reference_number varchar(255),

amount numeric(18,2),

currency varchar(10),

received_by uuid,

notes text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (invoice_id)
REFERENCES invoices(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (received_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- PAYMENT TRANSACTIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payment_transactions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

payment_id uuid NOT NULL,

gateway varchar(100),

gateway_transaction_id varchar(255),

authorization_code varchar(255),

transaction_status varchar(100),

gateway_response jsonb,

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(payment_id)
REFERENCES payments(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CREDIT NOTES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS credit_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

credit_note_number varchar(50),

invoice_id uuid,

credit_date date,

reason text,

credit_amount numeric(18,2),

status varchar(50),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(invoice_id)
REFERENCES invoices(id)

);

-------------------------------------------------------------
-- REFUNDS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS refunds
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

payment_id uuid,

refund_date date,

refund_amount numeric(18,2),

refund_reason text,

refund_status varchar(50),

processed_by uuid,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(payment_id)
REFERENCES payments(id),

FOREIGN KEY(processed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- REVENUE RECOGNITION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS revenue_recognition
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

contract_id uuid,

invoice_id uuid,

recognition_period date,

recognized_amount numeric(18,2),

recognition_type varchar(100),

recognized_at timestamptz,

recognized_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(contract_id)
REFERENCES contracts(id),

FOREIGN KEY(invoice_id)
REFERENCES invoices(id),

FOREIGN KEY(recognized_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- PROJECTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

project_number varchar(50) NOT NULL,

company_id uuid,

contract_id uuid,

project_name varchar(255) NOT NULL,

project_code varchar(100),

project_type varchar(100),

project_status varchar(50),

priority varchar(50),

start_date date,

planned_end_date date,

actual_end_date date,

budget_amount numeric(18,2),

estimated_cost numeric(18,2),

actual_cost numeric(18,2),

progress_percent numeric(5,2) DEFAULT 0,

project_manager uuid,

description text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (company_id) REFERENCES companies(id),

FOREIGN KEY (contract_id) REFERENCES contracts(id),

FOREIGN KEY (project_manager) REFERENCES profiles(id),

UNIQUE (organization_id, project_number)

);

-------------------------------------------------------------
-- PROJECT MEMBERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_members
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

profile_id uuid NOT NULL,

role_name varchar(100),

allocation_percent numeric(5,2),

joined_on date,

left_on date,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- PROJECT PHASES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_phases
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

phase_name varchar(255),

phase_order integer,

phase_status varchar(50),

planned_start date,

planned_end date,

actual_start date,

actual_end date,

progress_percent numeric(5,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- PROJECT MILESTONES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_milestones
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

phase_id uuid,

milestone_name varchar(255),

description text,

planned_date date,

completed_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(phase_id)
REFERENCES project_phases(id)

);

-------------------------------------------------------------
-- PROJECT DELIVERABLES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_deliverables
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

milestone_id uuid,

deliverable_name varchar(255),

description text,

delivery_status varchar(50),

delivery_date date,

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(milestone_id)
REFERENCES project_milestones(id),

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- TIME ENTRIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS time_entries
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

task_id uuid,

profile_id uuid NOT NULL,

work_date date,

hours numeric(10,2),

billable_hours numeric(10,2),

hourly_rate numeric(18,2),

description text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(task_id)
REFERENCES tasks(id),

FOREIGN KEY(profile_id)
REFERENCES profiles(id),

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- RESOURCE ALLOCATION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS resource_allocations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

profile_id uuid NOT NULL,

allocation_start date,

allocation_end date,

allocation_percent numeric(5,2),

planned_hours numeric(10,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(profile_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- PROJECT RISKS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_risks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

project_id uuid NOT NULL,

risk_title varchar(255),

risk_category varchar(100),

probability varchar(50),

impact varchar(50),

severity varchar(50),

mitigation_plan text,

owner_id uuid,

status varchar(50),

identified_on date,

closed_on date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(project_id)
REFERENCES projects(id)
ON DELETE CASCADE,

FOREIGN KEY(owner_id)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- TICKET CATEGORIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

display_order integer DEFAULT 0,

is_active boolean DEFAULT true,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,category_code)

);

-------------------------------------------------------------
-- TICKET PRIORITIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_priorities
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

priority_code varchar(50),

priority_name varchar(100),

response_hours integer,

resolution_hours integer,

color varchar(20),

display_order integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,priority_code)

);

-------------------------------------------------------------
-- SUPPORT TICKETS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS support_tickets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

ticket_number varchar(50) NOT NULL,

company_id uuid,

contact_id uuid,

project_id uuid,

category_id uuid,

priority_id uuid,

assigned_to uuid,

ticket_subject varchar(255),

ticket_description text,

ticket_status varchar(50),

opened_at timestamptz,

closed_at timestamptz,

first_response_at timestamptz,

resolution_due_at timestamptz,

customer_satisfaction integer,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (company_id)
REFERENCES companies(id),

FOREIGN KEY (contact_id)
REFERENCES contacts(id),

FOREIGN KEY (project_id)
REFERENCES projects(id),

FOREIGN KEY (category_id)
REFERENCES ticket_categories(id),

FOREIGN KEY (priority_id)
REFERENCES ticket_priorities(id),

FOREIGN KEY (assigned_to)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
ticket_number
)

);

-------------------------------------------------------------
-- TICKET COMMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_comments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

comment_type varchar(50),

comment_text text,

is_internal boolean DEFAULT false,

commented_by uuid,

commented_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(commented_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- SLA DEFINITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sla_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

sla_name varchar(255),

priority_id uuid,

response_time_hours integer,

resolution_time_hours integer,

business_hours_only boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(priority_id)
REFERENCES ticket_priorities(id)

);

-------------------------------------------------------------
-- SLA TRACKING
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_sla_tracking
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

sla_definition_id uuid,

response_due timestamptz,

resolution_due timestamptz,

response_met boolean,

resolution_met boolean,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(sla_definition_id)
REFERENCES sla_definitions(id)

);

-------------------------------------------------------------
-- TICKET ESCALATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_escalations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

escalation_level integer,

escalated_to uuid,

reason text,

escalated_at timestamptz,

resolved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(escalated_to)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- KNOWLEDGE BASE LINKS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_knowledge_links
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

ticket_id uuid NOT NULL,

knowledge_article_id uuid,

linked_by uuid,

linked_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(ticket_id)
REFERENCES support_tickets(id)
ON DELETE CASCADE,

FOREIGN KEY(linked_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- AI ASSISTANTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_assistants
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

assistant_code varchar(100),

assistant_name varchar(255) NOT NULL,

assistant_type varchar(100),

model_name varchar(150),

system_prompt text,

temperature numeric(4,2),

max_tokens integer,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,assistant_code)

);

-------------------------------------------------------------
-- AI CONVERSATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_conversations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

assistant_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

conversation_title varchar(255),

started_by uuid,

started_at timestamptz DEFAULT now(),

ended_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (assistant_id)
REFERENCES ai_assistants(id),

FOREIGN KEY (started_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- AI MESSAGES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_messages
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

conversation_id uuid NOT NULL,

message_role varchar(50),

message_content text,

token_count integer,

response_time_ms integer,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(conversation_id)
REFERENCES ai_conversations(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- AI PROMPTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_prompts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

prompt_name varchar(255),

prompt_category varchar(100),

prompt_template text,

version integer DEFAULT 1,

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- AI RECOMMENDATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_recommendations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

recommendation_type varchar(100),

recommendation text,

confidence_score numeric(5,2),

accepted boolean,

accepted_by uuid,

accepted_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(accepted_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- WORKFLOW DEFINITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

workflow_code varchar(100),

workflow_name varchar(255),

module_name varchar(100),

trigger_type varchar(100),

workflow_definition jsonb,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,workflow_code)

);

-------------------------------------------------------------
-- WORKFLOW EXECUTIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_executions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

execution_status varchar(50),

started_at timestamptz,

completed_at timestamptz,

execution_log jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- WORKFLOW CONDITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_conditions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

condition_order integer,

field_name varchar(255),

operator varchar(50),

comparison_value text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- WORKFLOW ACTIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_actions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

action_order integer,

action_type varchar(100),

action_configuration jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES workflow_definitions(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- DASHBOARDS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dashboards
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

dashboard_code varchar(100),

dashboard_name varchar(255) NOT NULL,

dashboard_type varchar(100),

description text,

is_default boolean DEFAULT false,

visibility varchar(50),

owner_id uuid,

layout jsonb,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE(organization_id,dashboard_code)

);

-------------------------------------------------------------
-- DASHBOARD WIDGETS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dashboard_widgets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

dashboard_id uuid NOT NULL,

widget_code varchar(100),

widget_type varchar(100),

widget_title varchar(255),

widget_configuration jsonb,

position_x integer,

position_y integer,

width integer,

height integer,

refresh_interval integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(dashboard_id)
REFERENCES dashboards(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- KPI DEFINITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS kpi_definitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

kpi_code varchar(100),

kpi_name varchar(255),

category varchar(100),

calculation_method text,

display_format varchar(50),

target_value numeric(18,4),

warning_threshold numeric(18,4),

critical_threshold numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,kpi_code)

);

-------------------------------------------------------------
-- KPI VALUES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS kpi_values
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

kpi_definition_id uuid NOT NULL,

calculation_date date,

period_type varchar(50),

actual_value numeric(18,4),

target_value numeric(18,4),

variance numeric(18,4),

variance_percent numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(kpi_definition_id)
REFERENCES kpi_definitions(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- REPORTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS reports
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

report_code varchar(100),

report_name varchar(255),

module_name varchar(100),

report_type varchar(100),

query_definition jsonb,

chart_definition jsonb,

is_scheduled boolean DEFAULT false,

owner_id uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id),

UNIQUE(organization_id,report_code)

);

-------------------------------------------------------------
-- REPORT EXECUTIONS
-------------------------------------------------------------

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

-------------------------------------------------------------
-- EXECUTIVE SNAPSHOTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS executive_snapshots
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

snapshot_date date,

snapshot_type varchar(100),

snapshot_data jsonb,

generated_by uuid,

generated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(generated_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- FORECAST MODELS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS forecast_models
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

model_code varchar(100),

model_name varchar(255),

forecast_type varchar(100),

algorithm varchar(150),

training_period varchar(100),

forecast_period varchar(100),

model_accuracy numeric(8,4),

last_trained_at timestamptz,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,model_code)

);

-------------------------------------------------------------
-- FORECAST RESULTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS forecast_results
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

forecast_model_id uuid NOT NULL,

forecast_period date,

predicted_value numeric(18,4),

confidence_score numeric(8,4),

actual_value numeric(18,4),

prediction_error numeric(18,4),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(forecast_model_id)
REFERENCES forecast_models(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- NOTIFICATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

recipient_id uuid NOT NULL,

notification_type varchar(100),

title varchar(255),

message text,

entity_type varchar(100),

entity_id uuid,

priority varchar(50),

is_read boolean DEFAULT false,

read_at timestamptz,

expires_at timestamptz,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (recipient_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- AUDIT LOGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

entity_id uuid,

action varchar(100),

old_values jsonb,

new_values jsonb,

performed_by uuid,

performed_at timestamptz DEFAULT now(),

ip_address inet,

user_agent text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (performed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- SYSTEM EVENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS system_events
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid,

event_name varchar(255),

event_category varchar(100),

severity varchar(50),

payload jsonb,

processed boolean DEFAULT false,

processed_at timestamptz,

created_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb

);

-------------------------------------------------------------
-- TAGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

tag_name varchar(150),

tag_color varchar(20),

tag_category varchar(100),

metadata jsonb DEFAULT '{}'::jsonb,

UNIQUE(organization_id,tag_name),

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- ENTITY TAGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS entity_tags
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

entity_type varchar(100),

entity_id uuid,

tag_id uuid,

created_at timestamptz DEFAULT now(),

FOREIGN KEY(tag_id)
REFERENCES tags(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- SAVED FILTERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS saved_filters
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

owner_id uuid,

module_name varchar(100),

filter_name varchar(255),

filter_definition jsonb,

is_shared boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- CUSTOM FIELDS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS custom_fields
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_type varchar(100),

field_name varchar(255),

field_label varchar(255),

field_type varchar(100),

validation_rules jsonb,

default_value text,

display_order integer,

is_required boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- CUSTOM FIELD VALUES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS custom_field_values
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

custom_field_id uuid,

entity_type varchar(100),

entity_id uuid,

field_value jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(custom_field_id)
REFERENCES custom_fields(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CORE INDEXES
-------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_company_name
ON companies(organization_id, company_name);

CREATE INDEX IF NOT EXISTS idx_contact_name
ON contacts(organization_id, display_name);

CREATE INDEX IF NOT EXISTS idx_lead_owner
ON leads(owner_id);

CREATE INDEX IF NOT EXISTS idx_opportunity_stage
ON opportunities(pipeline_stage_id);

CREATE INDEX IF NOT EXISTS idx_project_status
ON projects(project_status);

CREATE INDEX IF NOT EXISTS idx_ticket_status
ON support_tickets(ticket_status);

CREATE INDEX IF NOT EXISTS idx_activity_entity
ON activities(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notes_entity
ON notes(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_attachment_entity
ON attachments(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(recipient_id,is_read);

CREATE INDEX IF NOT EXISTS idx_audit_entity
ON audit_logs(entity_type,entity_id);

-------------------------------------------------------------
-- UPDATE TIMESTAMP FUNCTION
-------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS
$$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;

-------------------------------------------------------------
-- VALIDATION
-------------------------------------------------------------

DO $$
BEGIN

RAISE NOTICE 'ADS CRM Migration Completed Successfully';

END $$;

COMMIT;