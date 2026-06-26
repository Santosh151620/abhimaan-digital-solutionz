export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface Project {
  id: string;

  // Relationship
  client_id: string;

  // Core details
  name: string;
  description?: string;

  // Status pipeline
  status: ProjectStatus;
  priority: ProjectPriority;

  // Timeline
  start_date?: string;
  end_date?: string;
  due_date?: string;

  // Progress tracking
  progress_percentage: number;

  // Financial (for future payment tracking module)
  budget?: number;
  currency?: string;

  // Metadata
  tags?: string[];
  created_at: string;
  updated_at: string;

  // Nested (UI layer only, not stored directly in DB ideally)
  milestones?: ProjectMilestone[];
}

export interface ProjectCreateInput {
  client_id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress_percentage?: number;
  budget?: number;
  currency?: string;
  tags?: string[];
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress_percentage?: number;
  budget?: number;
  currency?: string;
  tags?: string[];
}