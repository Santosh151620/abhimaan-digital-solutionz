/*
|--------------------------------------------------------------------------
| Dashboard Types
|--------------------------------------------------------------------------
| These interfaces mirror the actual Supabase schema.
| They are shared across:
|
| - Dashboard
| - Leads
| - Clients
| - Analytics
| - Reports
| - Admin
|--------------------------------------------------------------------------
*/

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface DashboardLead {
  id: string;

  created_at: string;

  full_name: string;

  email: string;

  phone: string | null;

  company: string | null;

  service_interest: string | null;

  message: string | null;

  source: string;

  status: LeadStatus;

  client_id: string | null;
}

export interface DashboardClient {
  id: string;

  created_at: string;

  updated_at: string;

  status: string;

  full_name: string;

  company_name: string | null;

  email: string | null;

  phone: string | null;

  notes: string | null;

  converted_from_lead_id: string | null;
}

export interface DashboardProject {
  id: string;

  created_at: string;

  updated_at: string;

  client_id: string;

  name: string;

  service_type: string;

  status: string;

  project_cost: number;

  start_date: string | null;

  end_date: string | null;

  notes: string | null;
}

export interface DashboardPayment {
  id: string;

  created_at: string;

  project_id: string;

  amount: number;

  status: string;

  payment_date: string | null;

  notes: string | null;
}

export interface DashboardMetrics {
  totalLeads: number;

  newLeads: number;

  contactedLeads: number;

  qualifiedLeads: number;

  proposalLeads: number;

  wonLeads: number;

  lostLeads: number;

  activeClients: number;

  conversionRate: number;

  recentLeads: DashboardLead[];
}

export interface MonthlyLeads {
  month: string;

  total: number;
}

export interface RevenueSummary {
  totalRevenue: number;

  outstandingRevenue: number;
}

export interface DashboardOverview {
  metrics: DashboardMetrics;

  monthlyLeads: MonthlyLeads[];

  revenue: RevenueSummary;
}