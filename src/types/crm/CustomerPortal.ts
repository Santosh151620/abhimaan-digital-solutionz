export type CustomerPortalStatus =
    | 'Active'
    | 'Inactive'
    | 'Pending'
    | 'Archived';



export interface CustomerPortal {

    id:string;

    organizationId?:string;

    customerPortalNumber:string;

    customerId?:string;

    name:string;

    email?:string;

    status:CustomerPortalStatus;

    accessEnabled:boolean;

    entityType?:string;

    entityId?:string;

    isDeleted:boolean;

    deletedAt:string | null;

    deletedBy:string | null;

    createdAt:string;

    updatedAt:string;

}



export interface CustomerPortalSummary {

    total:number;

    active:number;

    inactive:number;

    archived:number;

}