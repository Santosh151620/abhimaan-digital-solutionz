/**
 * CRM Activities Domain Contract
 *
 * Single source of truth for:
 * - ActivitiesRepository
 * - ActivitiesService
 * - CRM UI
 * - API routes
 *
 * Entity-driven CRM architecture.
 */


export type ActivityType =
    | 'Call'
    | 'Meeting'
    | 'Email'
    | 'Note'
    | 'Task'
    | 'Follow Up'
    | 'Follow-up'
    | 'SMS'
    | 'WhatsApp'
    | 'LinkedIn'
    | 'Demo'
    | 'Visit'
    | 'Reminder'
    | 'Other';



export type ActivityStatus =
    | 'Planned'
    | 'Scheduled'
    | 'Pending'
    | 'In Progress'
    | 'Completed'
    | 'Cancelled'
    | 'Overdue'
    | 'Missed';



export type ActivityPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';




export interface Activity {

    id: string;


    /**
     * CRM identifier
     */
    activityNumber: string;


    organizationId?: string;



    /**
     * Entity driven model
     */
    entityType: 'Activity';

    entityId: string;



    /**
     * CRM relationships
     */
    leadId?: string;

    companyId?: string;

    contactId?: string;

    opportunityId?: string;

    projectId?: string;



    /**
     * Activity details
     */
    title: string;

    description?: string;



    type: ActivityType;

    status: ActivityStatus;

    priority: ActivityPriority;



    /**
     * Scheduling
     */
    scheduledAt?: string;

    startedAt?: string;

    startDate?: string;

    completedAt?: string;



    /**
     * Due tracking
     */
    dueAt?: string;

    dueDate?: string;



    /**
     * Execution
     */
    durationMinutes?: number;

    outcome?: string;

    nextAction?: string;



    /**
     * Reminder
     */
    reminderAt?: string;

    reminderMinutes?: number;



    /**
     * Ownership
     */
    ownerId?: string;

    assignedTo?: string;



    /**
     * Location
     */
    location?: string;



    /**
     * Lifecycle
     */
    archived: boolean;

    isArchived?: boolean;

    deletedAt?: string | null;



    /**
     * Extension
     */
    notes?: string;

    metadata?: Record<string, unknown>;



    createdAt: string;

    updatedAt: string;

}





export interface CreateActivityInput {


    activityNumber?: string;


    title: string;


    description?: string;


    type: ActivityType;


    status?: ActivityStatus;


    priority?: ActivityPriority;



    entityType?: string;

    entityId?: string;



    leadId?: string;

    companyId?: string;

    contactId?: string;

    opportunityId?: string;

    projectId?: string;



    scheduledAt?: string;

    startedAt?: string;

    completedAt?: string;



    dueAt?: string;

    dueDate?: string;



    durationMinutes?: number;



    reminderAt?: string;

    reminderMinutes?: number;



    outcome?: string;

    nextAction?: string;



    location?: string;



    ownerId?: string;

    assignedTo?: string;

}





export type UpdateActivityInput =
    Partial<CreateActivityInput>
    & {

        completedAt?: string;

        outcome?: string;

        metadata?: Record<string, unknown>;

    };





export interface ActivityFilters {


    type?: ActivityType;

    status?: ActivityStatus;

    priority?: ActivityPriority;



    entityType?: string;

    entityId?: string;



    leadId?: string;

    companyId?: string;

    contactId?: string;

    opportunityId?: string;

    projectId?: string;



    ownerId?: string;

    assignedTo?: string;



    fromDate?: string;

    toDate?: string;



    includeArchived?: boolean;

}





export interface ActivitySearchFilters
    extends ActivityFilters {


    search?: string;

    keyword?: string;


    page?: number;

    limit?: number;

}





export interface ActivitySummary {


    total: number;


    planned: number;


    inProgress: number;


    completed: number;


    cancelled: number;


    missed: number;


    overdue: number;


    today: number;


    upcoming: number;


    highPriority: number;


    archived: number;


    completionRate: number;

}
