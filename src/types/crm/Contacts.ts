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



/**
 * Core Contact Entity
 */
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
     * CRM relationship
     */
    companyId?: string;



    /**
     * Identity
     */
    firstName: string;

    lastName: string;

    fullName?: string;



    /**
     * Communication
     */
    email?: string;

    phone?: string;

    mobile?: string;



    /**
     * Professional
     */
    designation?: string;

    department?: string;



    /**
     * Lifecycle
     */
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
     * Soft delete
     */
    isDeleted?: boolean;

    deletedAt?: string | null;

    deletedBy?: string | null;



    /**
     * Audit
     */
    createdAt: string;

    updatedAt: string;

}



/**
 * CRM Detail View Model
 *
 * Used by:
 * - Contact detail page
 * - Tables
 * - Workspace views
 */
export interface ContactDetails
    extends Contact {


    companyName?: string;


    opportunities?: number;


    lastActivity?: string;


}



/**
 * Backward compatibility alias
 */
export type Contacts =
    ContactDetails;



/**
 * Create contract
 */
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



    entityType?: 'Contact';

    entityId?: string;



    isDeleted?: boolean;

    deletedAt?: string | null;

    deletedBy?: string | null;

}



/**
 * Update contract
 */
export type UpdateContactInput =
    Partial<CreateContactInput>;




/**
 * Search filters
 */
export interface ContactSearchFilters {


    search?: string;


    status?: ContactStatus;


    companyId?: string;


    ownerId?: string;


    assignedTo?: string;


    includeArchived?: boolean;

}




/**
 * Dashboard summary
 */
export interface ContactsSummary {


    total: number;


    active: number;


    inactive: number;


    leads: number;


    customers: number;


    archived: number;

}