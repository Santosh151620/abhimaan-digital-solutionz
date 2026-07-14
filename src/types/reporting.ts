export interface LeadReport {
  total: number;
  new: number;
  qualified: number;
  won: number;
  lost: number;
  conversionRate: number;
}

export interface RevenueReport {
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  monthlyRevenue: number;
}

export interface ProjectReport {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  completionRate: number;
}

export interface TaskReport {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export interface ExecutiveReport {
  lead: LeadReport;
  revenue: RevenueReport;
  projects: ProjectReport;
  tasks: TaskReport;
}

export interface DashboardReport {
  executive: ExecutiveReport;
  generatedAt: Date;
}