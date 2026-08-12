type ActivityType =
    | 'Call'
    | 'Meeting'
    | 'Email'
    | 'Task'
    | 'Follow-up'
    | 'Note'
    | 'Demo'
    | 'Visit'
    | 'Other';


type ActivityStatus =
    | 'Planned'
    | 'In Progress'
    | 'Completed'
    | 'Cancelled'
    | 'Missed';


type ActivityPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';


export interface Activity {

    id: string;


    activityNumber: string;


    entityType?: string;

    entityId?: string;


    companyId?: string;

    contactId?: string;

    projectId?: string;

    assignedTo?: string;


    title: string;

    description?: string;


    type: ActivityType;

    status: ActivityStatus;

    priority: ActivityPriority;


    startDate?: string;

    endDate?: string;


    location?: string;


    reminderMinutes?: number;


    completedAt?: string;


    archived: boolean;


    createdAt: string;

    updatedAt: string;

}



interface ActivitySummary {

    total: number;

    planned: number;

    inProgress: number;

    completed: number;

    cancelled: number;

    missed: number;

}

