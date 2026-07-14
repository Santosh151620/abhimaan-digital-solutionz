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

export interface TeamMemberPerformance {
  userId: string;
  name: string;
  assignedLeads: number;
  convertedLeads: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  revenue: number;
  productivityScore: number;
}

export interface TeamPerformanceReport {
  members: TeamMemberPerformance[];
  averageProductivity: number;
  workloadDistribution: number;
  totalAssignedTasks: number;
  completedTasks: number;
  leadConversionRate: number;
}

export interface ExecutiveReport {
  lead: LeadReport;
  revenue: RevenueReport;
  projects: ProjectReport;
  tasks: TaskReport;
  team: TeamPerformanceReport;
}

export interface DashboardReport {
  executive: ExecutiveReport;
  generatedAt: Date;
}