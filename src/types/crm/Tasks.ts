/**
 * CRM Tasks Domain Contract
 *
 * Entity-driven architecture.
 *
 * Used by:
 * - TasksRepository
 * - TasksService
 * - CRM APIs
 * - CRM UI
 *
 * Rules:
 * - Universal entity model
 * - organization aware
 * - reusable across CRM modules
 */


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


export type TaskEntityType =
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Opportunity'
    | 'Project'
    | 'Quotation'
    | 'Activity'
    | 'Task'
    | 'Other';



export interface Task {

    id: string;


    /**
     * Universal entity identity
     */
    entityType: 'Task';

    entityId: string;


    /**
     * Multi tenant
     */
    organizationId?: string;



    /**
     * Business references
     */
    taskNumber: string;


    projectId?: string;

    companyId?: string;



    /**
     * Ownership
     */
    assignedTo?: string;

    ownerId?: string;



    /**
     * Task details
     */
    title: string;

    description?: string;



    /**
     * Lifecycle
     */
    status: TaskStatus;

    priority: TaskPriority;



    /**
     * Scheduling
     */
    startDate?: string;

    dueDate?: string;

    completedAt?: string;



    /**
     * Tracking
     */
    estimatedHours?: number;

    actualHours?: number;

    completionPercentage?: number;



    /**
     * Entity lifecycle
     */
    archived: boolean;

    deletedAt?: string | null;



    createdAt: string;

    updatedAt: string;

}



export interface CreateTaskInput {


    taskNumber?: string;


    title: string;

    description?: string;



    status?: TaskStatus;

    priority?: TaskPriority;



    entityType?: 'Task';

    entityId?: string;



    projectId?: string;

    companyId?: string;



    assignedTo?: string;

    ownerId?: string;



    startDate?: string;

    dueDate?: string;



    estimatedHours?: number;

    actualHours?: number;



    completionPercentage?: number;



    metadata?: Record<string, unknown>;

}



export type UpdateTaskInput =
    Partial<CreateTaskInput>
    & {

        completedAt?: string;

        archived?: boolean;

        deletedAt?: string | null;

    };



export interface TaskSearchFilters {


    search?: string;


    status?: TaskStatus;


    priority?: TaskPriority;



    entityType?: TaskEntityType;

    entityId?: string;



    companyId?: string;


    projectId?: string;



    assignedTo?: string;


    ownerId?: string;



    includeArchived?: boolean;

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