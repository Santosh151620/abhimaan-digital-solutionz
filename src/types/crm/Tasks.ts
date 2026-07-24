export type TaskStatus =
    | 'Todo'
    | 'In Progress'
    | 'Blocked'
    | 'Completed'
    | 'Cancelled';

export type TaskPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';

export interface Task {

    id: string;

    taskNumber: string;

    projectId?: string;

    companyId?: string;

    assignedTo?: string;

    title: string;

    description?: string;

    status: TaskStatus;

    priority: TaskPriority;

    startDate?: string;

    dueDate?: string;

    completedAt?: string;

    estimatedHours?: number;

    actualHours?: number;

    completionPercentage?: number;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface TaskSearchFilters {

    search?: string;

    status?: TaskStatus;

    priority?: TaskPriority;

    companyId?: string;

    projectId?: string;

    assignedTo?: string;

}

export interface TaskSummary {

    total: number;

    todo: number;

    inProgress: number;

    blocked: number;

    completed: number;

    cancelled: number;

    critical: number;

    highPriority: number;

    overdue: number;

    archived: number;

    averageCompletion: number;

}
