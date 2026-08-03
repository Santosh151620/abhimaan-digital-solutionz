-- ==========================================================
-- ADS ERP PLATFORM
-- Migration : 004_erp.sql
-- PART 1
-- PROCUREMENT FOUNDATION
-- ==========================================================

BEGIN;

-------------------------------------------------------------
-- VENDOR CATEGORIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendor_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255) NOT NULL,

description text,

is_active boolean DEFAULT true,

display_order integer DEFAULT 0,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
category_code
)

);

-------------------------------------------------------------
-- VENDORS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendors
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_code varchar(50) NOT NULL,

vendor_name varchar(255) NOT NULL,

legal_name varchar(255),

vendor_category_id uuid,

website text,

email varchar(255),

phone varchar(50),

mobile varchar(50),

gst_number varchar(100),

tax_number varchar(100),

registration_number varchar(100),

payment_terms varchar(100),

credit_limit numeric(18,2),

currency varchar(10),

vendor_rating numeric(5,2),

status varchar(50) DEFAULT 'active',

owner_id uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

created_by uuid,

updated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (vendor_category_id)
REFERENCES vendor_categories(id),

FOREIGN KEY (owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
vendor_code
)

);

-------------------------------------------------------------
-- VENDOR CONTACTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendor_contacts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

vendor_id uuid NOT NULL,

first_name varchar(150),

last_name varchar(150),

designation varchar(150),

email varchar(255),

phone varchar(50),

mobile varchar(50),

is_primary boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(vendor_id)
REFERENCES vendors(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- PURCHASE REQUISITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_requisitions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

requisition_number varchar(50) NOT NULL,

department varchar(150),

requested_by uuid,

approved_by uuid,

status varchar(50),

priority varchar(50),

required_date date,

description text,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (requested_by)
REFERENCES profiles(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
requisition_number
)

);

-------------------------------------------------------------
-- PURCHASE REQUISITION ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_requisition_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

requisition_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

estimated_unit_cost numeric(18,2),

required_date date,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(requisition_id)
REFERENCES purchase_requisitions(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- PURCHASE ORDERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

purchase_order_number varchar(50) NOT NULL,

vendor_id uuid NOT NULL,

requisition_id uuid,

status varchar(50),

order_date date,

expected_delivery_date date,

subtotal numeric(18,2),

discount_amount numeric(18,2),

tax_amount numeric(18,2),

grand_total numeric(18,2),

currency varchar(10),

approved_by uuid,

approved_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (vendor_id)
REFERENCES vendors(id),

FOREIGN KEY (requisition_id)
REFERENCES purchase_requisitions(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
purchase_order_number
)

);

-------------------------------------------------------------
-- PURCHASE ORDER ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS purchase_order_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

purchase_order_id uuid NOT NULL,

product_id uuid,

description text,

quantity numeric(18,2),

unit_cost numeric(18,2),

discount numeric(18,2),

tax numeric(18,2),

line_total numeric(18,2),

received_quantity numeric(18,2) DEFAULT 0,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(purchase_order_id)
REFERENCES purchase_orders(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- WAREHOUSES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS warehouses
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_code varchar(50) NOT NULL,

warehouse_name varchar(255) NOT NULL,

warehouse_type varchar(100),

address_line1 text,

address_line2 text,

city varchar(150),

state varchar(150),

postal_code varchar(30),

country varchar(100),

manager_id uuid,

status varchar(50) DEFAULT 'active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (manager_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
warehouse_code
)

);

-------------------------------------------------------------
-- BIN LOCATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS warehouse_bins
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

warehouse_id uuid NOT NULL,

bin_code varchar(100),

bin_name varchar(255),

zone varchar(100),

aisle varchar(100),

rack varchar(100),

shelf varchar(100),

capacity numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- INVENTORY
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid NOT NULL,

product_id uuid NOT NULL,

available_quantity numeric(18,2) DEFAULT 0,

reserved_quantity numeric(18,2) DEFAULT 0,

damaged_quantity numeric(18,2) DEFAULT 0,

minimum_stock numeric(18,2),

maximum_stock numeric(18,2),

reorder_level numeric(18,2),

average_cost numeric(18,2),

last_stock_update timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (product_id)
REFERENCES products(id)

);

-------------------------------------------------------------
-- STOCK MOVEMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS stock_movements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid,

product_id uuid,

movement_type varchar(50),

reference_type varchar(100),

reference_id uuid,

quantity numeric(18,2),

unit_cost numeric(18,2),

movement_date timestamptz,

performed_by uuid,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (performed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- GOODS RECEIPT NOTES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS goods_receipt_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

grn_number varchar(50),

purchase_order_id uuid,

warehouse_id uuid,

vendor_id uuid,

received_date date,

received_by uuid,

status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (purchase_order_id)
REFERENCES purchase_orders(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (vendor_id)
REFERENCES vendors(id),

FOREIGN KEY (received_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- GOODS ISSUE NOTES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS goods_issue_notes
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

gin_number varchar(50),

warehouse_id uuid,

issued_date date,

issued_to uuid,

issued_by uuid,

purpose varchar(255),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (issued_to)
REFERENCES profiles(id),

FOREIGN KEY (issued_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- INVENTORY ADJUSTMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory_adjustments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

warehouse_id uuid,

product_id uuid,

adjustment_type varchar(50),

old_quantity numeric(18,2),

new_quantity numeric(18,2),

adjustment_reason text,

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- INVENTORY TRANSFERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory_transfers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

transfer_number varchar(50),

from_warehouse_id uuid,

to_warehouse_id uuid,

transfer_date date,

status varchar(50),

approved_by uuid,

approved_at timestamptz,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (from_warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (to_warehouse_id)
REFERENCES warehouses(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- BILL OF MATERIALS (BOM)
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bill_of_materials
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

product_id uuid NOT NULL,

bom_code varchar(50),

bom_name varchar(255),

revision varchar(50),

status varchar(50) DEFAULT 'active',

effective_from date,

effective_to date,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (product_id)
REFERENCES products(id),

UNIQUE
(
organization_id,
bom_code
)

);

-------------------------------------------------------------
-- BOM ITEMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bom_items
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bom_id uuid NOT NULL,

component_product_id uuid NOT NULL,

quantity numeric(18,4),

unit_of_measure varchar(50),

wastage_percent numeric(8,2),

sort_order integer,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (bom_id)
REFERENCES bill_of_materials(id)
ON DELETE CASCADE,

FOREIGN KEY (component_product_id)
REFERENCES products(id)

);

-------------------------------------------------------------
-- WORK ORDERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS work_orders
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

work_order_number varchar(50),

bom_id uuid,

product_id uuid,

planned_quantity numeric(18,2),

completed_quantity numeric(18,2),

production_status varchar(50),

planned_start date,

planned_finish date,

actual_start timestamptz,

actual_finish timestamptz,

production_manager uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (bom_id)
REFERENCES bill_of_materials(id),

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (production_manager)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
work_order_number
)

);

-------------------------------------------------------------
-- PRODUCTION RUNS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS production_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

work_order_id uuid NOT NULL,

run_number integer,

machine_name varchar(255),

operator_id uuid,

planned_output numeric(18,2),

actual_output numeric(18,2),

start_time timestamptz,

end_time timestamptz,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (work_order_id)
REFERENCES work_orders(id)
ON DELETE CASCADE,

FOREIGN KEY (operator_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- MATERIAL CONSUMPTION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS material_consumption
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

planned_quantity numeric(18,2),

actual_quantity numeric(18,2),

variance_quantity numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id)

);

-------------------------------------------------------------
-- FINISHED GOODS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS finished_goods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

quantity numeric(18,2),

warehouse_id uuid,

received_date timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id)

);

-------------------------------------------------------------
-- QUALITY INSPECTIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quality_inspections
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

inspection_number varchar(50),

inspection_type varchar(100),

reference_type varchar(100),

reference_id uuid,

inspector_id uuid,

inspection_date timestamptz,

overall_result varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (inspector_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
inspection_number
)

);

-------------------------------------------------------------
-- QUALITY CHECKS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quality_checks
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

inspection_id uuid NOT NULL,

check_name varchar(255),

expected_value text,

actual_value text,

result varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (inspection_id)
REFERENCES quality_inspections(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- SCRAP MANAGEMENT
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS production_scrap
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

production_run_id uuid NOT NULL,

product_id uuid,

scrap_quantity numeric(18,2),

scrap_reason text,

scrap_cost numeric(18,2),

recorded_by uuid,

recorded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (production_run_id)
REFERENCES production_runs(id)
ON DELETE CASCADE,

FOREIGN KEY (product_id)
REFERENCES products(id),

FOREIGN KEY (recorded_by)
REFERENCES profiles(id)

);
-------------------------------------------------------------
-- FISCAL YEARS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS fiscal_years
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

fiscal_year_code varchar(50),

fiscal_year_name varchar(100),

start_date date NOT NULL,

end_date date NOT NULL,

status varchar(50) DEFAULT 'Open',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,fiscal_year_code)

);

-------------------------------------------------------------
-- ACCOUNTING PERIODS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS accounting_periods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

fiscal_year_id uuid NOT NULL,

period_number integer,

period_name varchar(100),

start_date date,

end_date date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(fiscal_year_id)
REFERENCES fiscal_years(id)
ON DELETE CASCADE

);

-------------------------------------------------------------
-- CHART OF ACCOUNTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS chart_of_accounts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_code varchar(50),

account_name varchar(255),

account_type varchar(100),

parent_account_id uuid,

normal_balance varchar(10),

allow_posting boolean DEFAULT true,

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(parent_account_id)
REFERENCES chart_of_accounts(id),

UNIQUE(organization_id,account_code)

);

-------------------------------------------------------------
-- COST CENTERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cost_centers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

cost_center_code varchar(50),

cost_center_name varchar(255),

manager_id uuid,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(manager_id)
REFERENCES profiles(id),

UNIQUE(organization_id,cost_center_code)

);

-------------------------------------------------------------
-- JOURNAL ENTRIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS journal_entries
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

journal_number varchar(50),

journal_date date,

journal_type varchar(100),

reference_type varchar(100),

reference_id uuid,

description text,

posting_status varchar(50),

posted_by uuid,

posted_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(posted_by)
REFERENCES profiles(id),

UNIQUE(organization_id,journal_number)

);

-------------------------------------------------------------
-- JOURNAL ENTRY LINES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS journal_entry_lines
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

journal_entry_id uuid NOT NULL,

account_id uuid NOT NULL,

cost_center_id uuid,

debit_amount numeric(18,2) DEFAULT 0,

credit_amount numeric(18,2) DEFAULT 0,

line_description text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(journal_entry_id)
REFERENCES journal_entries(id)
ON DELETE CASCADE,

FOREIGN KEY(account_id)
REFERENCES chart_of_accounts(id),

FOREIGN KEY(cost_center_id)
REFERENCES cost_centers(id)

);

-------------------------------------------------------------
-- GENERAL LEDGER
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS general_ledger
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_id uuid,

journal_line_id uuid,

transaction_date date,

debit_amount numeric(18,2),

credit_amount numeric(18,2),

running_balance numeric(18,2),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(account_id)
REFERENCES chart_of_accounts(id),

FOREIGN KEY(journal_line_id)
REFERENCES journal_entry_lines(id)

);

-------------------------------------------------------------
-- BANK ACCOUNTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bank_accounts
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

account_name varchar(255),

bank_name varchar(255),

account_number varchar(100),

ifsc_code varchar(50),

swift_code varchar(100),

currency varchar(10),

opening_balance numeric(18,2),

current_balance numeric(18,2),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

-------------------------------------------------------------
-- BANK TRANSACTIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bank_transactions
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

bank_account_id uuid NOT NULL,

transaction_date date,

transaction_type varchar(100),

reference_number varchar(255),

description text,

debit_amount numeric(18,2),

credit_amount numeric(18,2),

balance_after numeric(18,2),

reconciled boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(bank_account_id)
REFERENCES bank_accounts(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- ACCOUNTS RECEIVABLE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS accounts_receivable
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

invoice_id uuid NOT NULL,

company_id uuid NOT NULL,

due_date date,

original_amount numeric(18,2),

received_amount numeric(18,2) DEFAULT 0,

outstanding_amount numeric(18,2),

aging_bucket varchar(50),

collection_status varchar(50),

last_followup_at timestamptz,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (invoice_id) REFERENCES invoices(id),

FOREIGN KEY (company_id) REFERENCES companies(id)

);

-------------------------------------------------------------
-- ACCOUNTS PAYABLE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS accounts_payable
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_id uuid NOT NULL,

purchase_order_id uuid,

vendor_invoice_number varchar(100),

invoice_date date,

due_date date,

invoice_amount numeric(18,2),

paid_amount numeric(18,2) DEFAULT 0,

balance_amount numeric(18,2),

payment_status varchar(50),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (vendor_id) REFERENCES vendors(id),

FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id)

);

-------------------------------------------------------------
-- CUSTOMER STATEMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS customer_statements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

company_id uuid NOT NULL,

statement_period_from date,

statement_period_to date,

opening_balance numeric(18,2),

closing_balance numeric(18,2),

generated_at timestamptz,

generated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (company_id) REFERENCES companies(id),

FOREIGN KEY (generated_by) REFERENCES profiles(id)

);

-------------------------------------------------------------
-- VENDOR STATEMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vendor_statements
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

vendor_id uuid NOT NULL,

statement_period_from date,

statement_period_to date,

opening_balance numeric(18,2),

closing_balance numeric(18,2),

generated_at timestamptz,

generated_by uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (vendor_id) REFERENCES vendors(id),

FOREIGN KEY (generated_by) REFERENCES profiles(id)

);

-------------------------------------------------------------
-- PAYMENT RUNS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payment_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

payment_run_number varchar(50),

payment_date date,

payment_method varchar(100),

status varchar(50),

total_payments integer,

total_amount numeric(18,2),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (approved_by) REFERENCES profiles(id),

UNIQUE(organization_id,payment_run_number)

);

-------------------------------------------------------------
-- EXPENSE CATEGORIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS expense_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50),

category_name varchar(255),

requires_approval boolean DEFAULT true,

is_billable boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,category_code)

);

-------------------------------------------------------------
-- EXPENSE CLAIMS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS expense_claims
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

employee_id uuid,

expense_category_id uuid,

claim_number varchar(50),

expense_date date,

expense_amount numeric(18,2),

currency varchar(10),

description text,

receipt_url text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

reimbursed boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (employee_id)
REFERENCES profiles(id),

FOREIGN KEY (expense_category_id)
REFERENCES expense_categories(id),

FOREIGN KEY (approved_by)
REFERENCES profiles(id),

UNIQUE(organization_id,claim_number)

);

-------------------------------------------------------------
-- TAX CONFIGURATION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tax_configuration
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

tax_code varchar(50),

tax_name varchar(255),

tax_type varchar(100),

tax_percentage numeric(8,4),

country varchar(100),

state varchar(100),

effective_from date,

effective_to date,

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,tax_code)

);
-------------------------------------------------------------
-- DEPARTMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departments
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

department_code varchar(50) NOT NULL,

department_name varchar(255) NOT NULL,

parent_department_id uuid,

manager_id uuid,

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (parent_department_id) REFERENCES departments(id),

FOREIGN KEY (manager_id) REFERENCES profiles(id),

UNIQUE(organization_id,department_code)

);

-------------------------------------------------------------
-- DESIGNATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS designations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

designation_code varchar(50),

designation_name varchar(255),

job_level varchar(100),

status varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,designation_code)

);

-------------------------------------------------------------
-- EMPLOYEES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS employees
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

profile_id uuid,

employee_number varchar(50) NOT NULL,

department_id uuid,

designation_id uuid,

reporting_manager uuid,

employment_type varchar(100),

joining_date date,

confirmation_date date,

exit_date date,

employment_status varchar(50),

work_location varchar(255),

annual_ctc numeric(18,2),

currency varchar(10),

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id) REFERENCES organizations(id),

FOREIGN KEY (profile_id) REFERENCES profiles(id),

FOREIGN KEY (department_id) REFERENCES departments(id),

FOREIGN KEY (designation_id) REFERENCES designations(id),

FOREIGN KEY (reporting_manager) REFERENCES employees(id),

UNIQUE(organization_id,employee_number)

);

-------------------------------------------------------------
-- ATTENDANCE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attendance
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

attendance_date date,

check_in timestamptz,

check_out timestamptz,

worked_hours numeric(10,2),

attendance_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id)

);

-------------------------------------------------------------
-- LEAVE TYPES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leave_types
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

leave_code varchar(50),

leave_name varchar(255),

annual_quota numeric(10,2),

carry_forward boolean DEFAULT false,

requires_approval boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,leave_code)

);

-------------------------------------------------------------
-- LEAVE REQUESTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leave_requests
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

leave_type_id uuid,

from_date date,

to_date date,

total_days numeric(10,2),

reason text,

approval_status varchar(50),

approved_by uuid,

approved_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id),

FOREIGN KEY(leave_type_id)
REFERENCES leave_types(id),

FOREIGN KEY(approved_by)
REFERENCES employees(id)

);

-------------------------------------------------------------
-- PAYROLL PERIODS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payroll_periods
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

period_code varchar(50),

period_name varchar(100),

period_start date,

period_end date,

status varchar(50),

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,period_code)

);

-------------------------------------------------------------
-- PAYROLL COMPONENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payroll_components
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

component_code varchar(50),

component_name varchar(255),

component_type varchar(50),

taxable boolean,

formula text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE(organization_id,component_code)

);

-------------------------------------------------------------
-- PAYROLL RUNS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payroll_runs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

payroll_period_id uuid NOT NULL,

employee_id uuid,

gross_salary numeric(18,2),

deductions numeric(18,2),

net_salary numeric(18,2),

payment_status varchar(50),

processed_at timestamptz,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(payroll_period_id)
REFERENCES payroll_periods(id),

FOREIGN KEY(employee_id)
REFERENCES employees(id)

);

-------------------------------------------------------------
-- EMPLOYEE DOCUMENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS employee_documents
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

employee_id uuid NOT NULL,

document_type varchar(100),

document_name varchar(255),

storage_path text,

public_url text,

expiry_date date,

uploaded_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(employee_id)
REFERENCES employees(id)
ON DELETE CASCADE

);
-------------------------------------------------------------
-- ASSET CATEGORIES
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asset_categories
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

category_code varchar(50) NOT NULL,

category_name varchar(255) NOT NULL,

depreciation_method varchar(100),

default_life_months integer,

default_depreciation_rate numeric(10,4),

status varchar(50) DEFAULT 'Active',

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
category_code
)

);

-------------------------------------------------------------
-- ASSETS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS assets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

asset_number varchar(50) NOT NULL,

asset_name varchar(255) NOT NULL,

asset_category_id uuid,

serial_number varchar(255),

manufacturer varchar(255),

model_number varchar(255),

purchase_date date,

purchase_cost numeric(18,2),

current_book_value numeric(18,2),

salvage_value numeric(18,2),

useful_life_months integer,

status varchar(50),

warehouse_id uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (asset_category_id)
REFERENCES asset_categories(id),

FOREIGN KEY (warehouse_id)
REFERENCES warehouses(id),

UNIQUE
(
organization_id,
asset_number
)

);

-------------------------------------------------------------
-- ASSET ALLOCATION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asset_allocations
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

employee_id uuid,

department_id uuid,

allocated_date date,

expected_return_date date,

returned_date date,

allocation_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(employee_id)
REFERENCES employees(id),

FOREIGN KEY(department_id)
REFERENCES departments(id)

);

-------------------------------------------------------------
-- ASSET MAINTENANCE
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asset_maintenance
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

maintenance_type varchar(100),

vendor_id uuid,

scheduled_date date,

completed_date date,

maintenance_cost numeric(18,2),

maintenance_status varchar(50),

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(vendor_id)
REFERENCES vendors(id)

);

-------------------------------------------------------------
-- ASSET DEPRECIATION
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asset_depreciation
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

depreciation_period date,

opening_value numeric(18,2),

depreciation_amount numeric(18,2),

closing_value numeric(18,2),

journal_entry_id uuid,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(journal_entry_id)
REFERENCES journal_entries(id)

);

-------------------------------------------------------------
-- ASSET DISPOSAL
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asset_disposals
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

asset_id uuid NOT NULL,

disposal_date date,

disposal_method varchar(100),

sale_amount numeric(18,2),

gain_loss numeric(18,2),

approved_by uuid,

remarks text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(asset_id)
REFERENCES assets(id)
ON DELETE CASCADE,

FOREIGN KEY(approved_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- COMPLIANCE REGISTERS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compliance_registers
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

register_code varchar(50),

register_name varchar(255),

compliance_type varchar(100),

owner_id uuid,

status varchar(50),

review_frequency varchar(50),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_id)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
register_code
)

);

-------------------------------------------------------------
-- LICENSES & CERTIFICATIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS licenses_certifications
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

license_number varchar(100),

license_name varchar(255),

issuing_authority varchar(255),

issue_date date,

expiry_date date,

renewal_required boolean DEFAULT true,

owner_department uuid,

status varchar(50),

document_url text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(owner_department)
REFERENCES departments(id)

);
-------------------------------------------------------------
-- ERP REPORT DEFINITIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS erp_reports
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

report_code varchar(50) NOT NULL,

report_name varchar(255) NOT NULL,

report_category varchar(100),

description text,

query_definition text,

report_status varchar(50) DEFAULT 'Active',

created_by uuid,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY (organization_id)
REFERENCES organizations(id),

FOREIGN KEY (created_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
report_code
)

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

export_format varchar(50),

file_path text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(report_id)
REFERENCES erp_reports(id)
ON DELETE CASCADE,

FOREIGN KEY(executed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- APPROVAL WORKFLOWS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS approval_workflows
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

workflow_code varchar(50),

workflow_name varchar(255),

entity_name varchar(100),

minimum_amount numeric(18,2),

maximum_amount numeric(18,2),

is_active boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
workflow_code
)

);

-------------------------------------------------------------
-- APPROVAL STEPS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS approval_steps
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

workflow_id uuid NOT NULL,

step_order integer,

role_name varchar(100),

approver_id uuid,

approval_required boolean DEFAULT true,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(workflow_id)
REFERENCES approval_workflows(id)
ON DELETE CASCADE,

FOREIGN KEY(approver_id)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- ERP AUDIT LOG
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS erp_audit_logs
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

entity_name varchar(100),

entity_id uuid,

operation varchar(50),

performed_by uuid,

performed_at timestamptz DEFAULT now(),

old_values jsonb,

new_values jsonb,

ip_address inet,

user_agent text,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(performed_by)
REFERENCES profiles(id)

);

-------------------------------------------------------------
-- ERP SETTINGS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS erp_settings
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

setting_group varchar(100),

setting_key varchar(150),

setting_value jsonb,

updated_by uuid,

updated_at timestamptz DEFAULT now(),

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

FOREIGN KEY(updated_by)
REFERENCES profiles(id),

UNIQUE
(
organization_id,
setting_group,
setting_key
)

);

-------------------------------------------------------------
-- ERP DASHBOARD WIDGETS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS erp_dashboard_widgets
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

widget_code varchar(50),

widget_name varchar(255),

widget_category varchar(100),

default_position integer,

configuration jsonb,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id),

UNIQUE
(
organization_id,
widget_code
)

);

-------------------------------------------------------------
-- ERP SYSTEM EVENTS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS erp_system_events
(

id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

organization_id uuid NOT NULL,

event_name varchar(255),

event_source varchar(100),

severity varchar(50),

event_time timestamptz DEFAULT now(),

details jsonb,

resolved boolean DEFAULT false,

metadata jsonb DEFAULT '{}'::jsonb,

FOREIGN KEY(organization_id)
REFERENCES organizations(id)

);

COMMIT;