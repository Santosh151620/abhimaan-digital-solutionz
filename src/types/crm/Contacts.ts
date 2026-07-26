export type ContactStatus =

    | 'ACTIVE'
    | 'INACTIVE'
    | 'LEAD'
    | 'CUSTOMER'
    | 'ARCHIVED';





export interface Contact {


    id: string;


    /**
     * Universal CRM entity discriminator
     */
    entityType?: 'Contact';



    /**
     * Multi tenant ownership
     */
    organizationId?: string;



    companyId?: string;



    firstName: string;

    lastName: string;


    fullName?: string;



    email?: string;

    phone?: string;

    mobile?: string;



    designation?: string;

    department?: string;



    status: ContactStatus;



    city?: string;

    state?: string;

    country?: string;



    notes?: string;



    isDeleted?: boolean;


    deletedAt?: string | null;


    deletedBy?: string | null;



    createdAt: string;


    updatedAt: string;


}





export interface ContactDetails
    extends Contact {


    companyName?: string;



    opportunities?: number;



    lastActivity?: string;


}