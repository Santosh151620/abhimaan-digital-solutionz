export type NotificationType =
    | 'Info'
    | 'Success'
    | 'Warning'
    | 'Error';

export type NotificationPriority =
    | 'Low'
    | 'Medium'
    | 'High';

export interface Notification {

    id: string;

    organizationId?: string;

    userId?: string;

    entityType?: string;

    entityId?: string;

    title: string;

    message: string;

    type: NotificationType;

    priority: NotificationPriority;

    read: boolean;

    archived: boolean;

    readAt?: string;

    createdAt: string;

    updatedAt: string;

}

export interface NotificationSummary {

    total: number;

    unread: number;

    read: number;

    highPriority: number;

    warning: number;

    error: number;

    success: number;

    info: number;

    archived: number;

}
