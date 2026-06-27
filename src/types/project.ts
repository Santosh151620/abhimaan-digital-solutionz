export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

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

  // Service classification (existing DB field)
  service_type: string;

  // Status pipeline (strict)
  status: ProjectStatus;

  // Priority (new CRM enhancement)
  priority: ProjectPriority;

  // Financial
  project_cost: number;

  // Timeline
  start_date: string | null;
  end_date: string | null;

  // Tracking
  progress_percentage: number;

  // Notes
  notes: string | null;

  // Metadata
  created_at: string;
  updated_at: string;

  // Future UI layer only
  milestones?: ProjectMilestone[];
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | "All";
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProjects {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectCreateInput {
  client_id: string;
  name: string;
  service_type: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  project_cost?: number;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  progress_percentage?: number;
}

export interface ProjectUpdateInput {
  name?: string;
  service_type?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  project_cost?: number;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  progress_percentage?: number;
}