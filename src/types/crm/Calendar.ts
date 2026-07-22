export type CalendarEventType =
    | 'Meeting'
    | 'Call'
    | 'Demo'
    | 'Site Visit'
    | 'Installation'
    | 'Training'
    | 'Support'
    | 'Follow-up'
    | 'Deadline'
    | 'Reminder'
    | 'Internal'
    | 'Other';

export type CalendarStatus =
    | 'Scheduled'
    | 'In Progress'
    | 'Completed'
    | 'Cancelled'
    | 'Missed';

export type CalendarPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';

export interface CalendarEvent {

    id: string;

    eventNumber: string;

    companyId?: string;

    customerName?: string;

    projectId?: string;

    assignedTo?: string;

    title: string;

    description?: string;

    eventType: CalendarEventType;

    status: CalendarStatus;

    priority: CalendarPriority;

    startDate: string;

    endDate: string;

    allDay: boolean;

    location?: string;

    reminderMinutes?: number;

    recurring?: boolean;

    color?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface CalendarSummary {

    total: number;

    scheduled: number;

    inProgress: number;

    completed: number;

    cancelled: number;

    missed: number;

    today: number;

    upcoming: number;

}