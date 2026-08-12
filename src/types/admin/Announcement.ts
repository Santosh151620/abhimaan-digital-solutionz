type AnnouncementStatus =

    | "DRAFT"

    | "PUBLISHED"

    | "ARCHIVED";





type AnnouncementPriority =

    | "LOW"

    | "NORMAL"

    | "HIGH"

    | "URGENT";





export interface Announcement {



    id: string;





    organizationId?: string;





    title: string;





    content: string;





    status: AnnouncementStatus;





    priority: AnnouncementPriority;





    publishDate?: string | null;





    expiryDate?: string | null;





    createdBy?: string | null;





    metadata?: Record<string, unknown>;





    createdAt?: string;





    updatedAt?: string;



}