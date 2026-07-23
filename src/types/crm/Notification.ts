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



    createdAt: string;



    updatedAt: string;


}