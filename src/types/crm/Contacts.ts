/**
 * CRM Contacts Domain Contract
 *
 * Single source of truth for:
 * - ContactsRepository
 * - ContactsService
 * - CRM UI
 * - API routes
 *
 * Entity-driven CRM architecture.
 */


export type ContactStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'LEAD'
    | 'CUSTOMER'
    | 'ARCHIVED';



export interface Contact {


    id: string;



    /**
     * Universal entity identity
     */
    entityType: 'Contact';

    entityId: string;



    /**
     * Multi tenant ownership
     */
    organizationId?: string;



    /**
     * CRM relationships
     */
    companyId?: string;



    /**
     * Contact information
     */
    firstName: string;

    lastName: string;

    fullName?: string;



    email?: string;

    phone?: string;

    mobile?: string;



    designation?: string;

    department?: string;



    status: ContactStatus;



    /**
     * Ownership
     */
    ownerId?: string;

    assignedTo?: string;



    /**
     * Address
     */
    city?: string;

    state?: string;

    country?: string;



    /**
     * Extension
     */
    notes?: string;

    metadata?: Record<string, unknown>;



    /**
     * Lifecycle
     */
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

export interface CreateContactInput {


    firstName: string;

    lastName: string;


    companyId?: string;


    email?: string;

    phone?: string;

    mobile?: string;


    designation?: string;

    department?: string;


    status?: ContactStatus;


    ownerId?: string;

    assignedTo?: string;


    city?: string;

    state?: string;

    country?: string;


    notes?: string;


    metadata?: Record<string, unknown>;


    /**
     * Entity lifecycle fields
     */
    entityType?: 'Contact';

    entityId?: string;


    isDeleted?: boolean;

    deletedAt?: string | null;

    deletedBy?: string | null;

}


export type UpdateContactInput =
    Partial<CreateContactInput>;


export interface ContactSearchFilters {


    search?: string;


    status?: ContactStatus;


    companyId?: string;


    ownerId?: string;


    assignedTo?: string;


    includeArchived?: boolean;


}





export interface ContactsSummary {


    total: number;


    active: number;


    inactive: number;


    leads: number;


    customers: number;


    archived: number;


}