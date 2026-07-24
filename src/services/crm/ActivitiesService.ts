/**
 * CRM Activities Domain Contract
 *
 * Production Activity Model
 *
 * Supports:
 * - Legacy CRM activity workflows
 * - Entity-driven architecture
 * - ActivitiesRepository
 * - ActivitiesService
 * - CRM UI components
 * - Dashboard intelligence
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
     * CRM Identity
     */
    activityNumber: string;

    organizationId?: string;


    /**
     * Entity-driven CRM architecture
     */
    entityType?: string;

    entityId?: string;


    /**
     * Legacy relationships
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


    dueAt?: string;

    dueDate?: string;



    /**
     * Execution tracking
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
     * Location
     */
    location?: string;



    /**
     * Ownership
     */
    assignedTo?: string;

    ownerId?: string;



    /**
     * Lifecycle
     */
    archived: boolean;

    isArchived?: boolean;

    deletedAt?: string | null;



    /**
     * Extension metadata
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


    assignedTo?: string;

    ownerId?: string;

}




export type UpdateActivityInput =
    Partial<CreateActivityInput> & {

        outcome?: string;

        metadata?: Record<string, unknown>;

    };





export interface ActivityFilters {

    type?: ActivityType;

    status?: ActivityStatus;

    priority?: ActivityPriority;



    companyId?: string;

    contactId?: string;

    leadId?: string;

    opportunityId?: string;

    projectId?: string;



    entityType?: string;

    entityId?: string;



    assignedTo?: string;

    ownerId?: string;



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


    /**
     * Core metrics
     */
    total: number;

    planned: number;

    scheduled: number;

    pending: number;

    inProgress: number;

    completed: number;

    cancelled: number;

    missed: number;



    /**
     * Time intelligence
     */
    today: number;

    upcoming: number;

    overdue: number;



    /**
     * Priority intelligence
     */
    highPriority: number;



    /**
     * Lifecycle
     */
    archived: number;



    /**
     * Analytics
     */
    completionRate: number;

}
