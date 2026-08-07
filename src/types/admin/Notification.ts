export type NotificationType =

    | "INFO"

    | "SUCCESS"

    | "WARNING"

    | "ERROR";





export type NotificationStatus =

    | "READ"

    | "UNREAD";





export interface Notification {



    id: string;





    organizationId?: string;





    userId?: string | null;





    title: string;





    message: string;





    type: NotificationType;





    status: NotificationStatus;





    entityType?: string | null;





    entityId?: string | null;





    actionUrl?: string | null;





    metadata?: Record<string, unknown>;





    createdAt?: string;





    readAt?: string | null;



}