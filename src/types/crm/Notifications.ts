export type NotificationType =
    | 'System'
    | 'Reminder'
    | 'Task'
    | 'Activity'
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Opportunity'
    | 'Project'
    | 'Invoice'
    | 'Quotation'
    | 'Payment'
    | 'Ticket'
    | 'Workflow'
    | 'Custom';

export type NotificationPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';

export type NotificationStatus =
    | 'Unread'
    | 'Read'
    | 'Archived';

export interface Notification {

    id: string;

    notificationNumber: string;

    organizationId?: string;

    entityType?: string;

    entityId?: string;

    ownerId?: string;

    userId?: string;

    title: string;

    message: string;

    type: NotificationType;

    priority: NotificationPriority;

    status: NotificationStatus;

    actionUrl?: string;

    actionLabel?: string;

    icon?: string;

    metadata?: Record<string, unknown>;

    readAt?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface NotificationSearchFilters {

    status?: NotificationStatus;

    type?: NotificationType;

    priority?: NotificationPriority;

    entityType?: string;

    entityId?: string;

    ownerId?: string;

    userId?: string;

    search?: string;

}

export interface NotificationSummary {

    total: number;

    unread: number;

    read: number;

    archived: number;

    lowPriority: number;

    mediumPriority: number;

    highPriority: number;

    criticalPriority: number;

}