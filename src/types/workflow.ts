export type WorkflowPriority = "low" | "medium" | "high" | "urgent";

export type WorkflowStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "blocked"
  | "cancelled";

export type WorkflowSource =
  | "manual"
  | "lead"
  | "client"
  | "system"
  | "automation";

export type WorkflowType =
  | "follow_up"
  | "call"
  | "meeting"
  | "proposal"
  | "email"
  | "task"
  | "reminder"
  | "internal_action";

export interface WorkflowActor {
  id: string;
  name: string;
  email?: string;
}

export interface WorkflowContext {
  leadId?: string;
  clientId?: string;
  dealId?: string;
  campaignId?: string;
}

export interface WorkflowTask {
  id: string;

  title: string;
  description?: string;

  type: WorkflowType;
  status: WorkflowStatus;
  priority: WorkflowPriority;

  source: WorkflowSource;

  context: WorkflowContext;

  assignedTo?: WorkflowActor;

  dueAt?: string; // ISO date
  createdAt: string;
  updatedAt: string;

  completedAt?: string;

  tags?: string[];
}

export interface WorkflowMetrics {
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
  completionRate: number;
}

export interface WorkflowSummary {
  tasks: WorkflowTask[];
  metrics: WorkflowMetrics;
}