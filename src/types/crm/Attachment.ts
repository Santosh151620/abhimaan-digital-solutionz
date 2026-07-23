export type AttachmentEntityType =
    | 'Lead'
    | 'Company'
    | 'Contact'
    | 'Project'
    | 'Task'
    | 'Activity'
    | 'Ticket'
    | 'Invoice'
    | 'Quotation'
    | 'Contract'
    | 'Other';



export interface Attachment {


    id: string;


    entityType: AttachmentEntityType;


    entityId: string;


    fileName: string;


    fileUrl: string;


    fileType?: string;


    fileSize?: number;


    description?: string;


    uploadedBy?: string;


    archived: boolean;


    createdAt: string;


    updatedAt: string;


}



export interface AttachmentSummary {


    total: number;


    active: number;


    archived: number;


}
