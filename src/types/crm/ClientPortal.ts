export type ClientPortalStatus =
    | 'Active'
    | 'Inactive'
    | 'Pending'
    | 'Archived';



export interface ClientPortal {


    id:string;


    organizationId?:string;


    portalNumber:string;


    clientId?:string;


    name:string;


    email?:string;


    status:ClientPortalStatus;


    accessEnabled:boolean;


    entityType?:string;


    entityId?:string;


    isDeleted:boolean;


    deletedAt:string | null;


    deletedBy:string | null;


    createdAt:string;


    updatedAt:string;

}



export interface ClientPortalSummary {


    total:number;


    active:number;


    inactive:number;


    archived:number;

}
