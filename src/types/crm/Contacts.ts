/**
 * ============================================================================
 * ADS CRM Contact Domain Contract
 *
 * Single source of truth for:
 * - ContactsRepository
 * - ContactsService
 * - CRM UI
 * - Server Actions
 * - API routes
 *
 * Architecture:
 * - Entity-driven CRM contract.
 * - Mirrors the existing contacts database schema.
 * - Supports nullable database lifecycle fields.
 * - Preserves entityType/entityId for the shared entity engine.
 * ============================================================================
 */




/**
 * ============================================================================
 * CONTACT STATUS
 * ============================================================================
 */

export type ContactStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'LEAD'
    | 'CUSTOMER'
    | 'ARCHIVED';




/**
 * ============================================================================
 * CONTACT ENTITY
 * ============================================================================
 */

export interface Contact {

    /**
     * Primary identity.
     */
    id: string;

    entityType: 'Contact';

    entityId: string;


    /**
     * Tenant ownership.
     */
    organizationId?: string;


    /**
     * CRM relationship.
     */
    companyId?: string;


    /**
     * Contact numbering.
     */
    contactCode?: string;


    /**
     * Identity.
     */
    firstName: string;

    middleName?: string;

    lastName: string;

    fullName?: string;

    displayName?: string;


    /**
     * Professional information.
     */
    jobTitle?: string;

    designation?: string;

    department?: string;


    /**
     * Communication.
     */
    email?: string;

    phone?: string;

    mobile?: string;

    whatsapp?: string;

    linkedinUrl?: string;


    /**
     * Personal dates.
     */
    dateOfBirth?: string | null;

    anniversary?: string | null;


    /**
     * Lifecycle.
     */
    status: ContactStatus;

    isActive?: boolean;

    isDeleted?: boolean;


    /**
     * Soft deletion.
     *
     * Nullable because the database columns are nullable.
     */
    deletedAt?: string | null;

    deletedBy?: string | null;


    /**
     * Ownership.
     */
    ownerId?: string;

    assignedTo?: string;


    /**
     * Address.
     */
    address?: string;

    city?: string;

    state?: string;

    country?: string;

    postalCode?: string;


    /**
     * Extension.
     */
    notes?: string;

    metadata?: Record<string, unknown>;


    /**
     * Audit.
     */
    createdBy?: string;

    updatedBy?: string;

    createdAt: string;

    updatedAt: string;


    /**
     * Optimistic/version tracking.
     */
    version?: number;

}




/**
 * ============================================================================
 * CONTACT DETAILS
 * ============================================================================
 */

export interface ContactDetails
    extends Contact {

    companyName?: string;

    opportunities?: number;

    lastActivity?: string;

    ownerName?: string;

    assignedToName?: string;

}




/**
 * ============================================================================
 * BACKWARD COMPATIBILITY
 * ============================================================================
 */

type Contacts =
    ContactDetails;




/**
 * ============================================================================
 * CREATE CONTACT INPUT
 * ============================================================================
 */

export interface CreateContactInput {

    firstName: string;

    middleName?: string;

    lastName: string;


    companyId?: string;

    contactCode?: string;


    email?: string;

    phone?: string;

    mobile?: string;

    whatsapp?: string;

    linkedinUrl?: string;


    jobTitle?: string;

    designation?: string;

    department?: string;


    dateOfBirth?: string | null;

    anniversary?: string | null;


    status?: ContactStatus;


    ownerId?: string;

    assignedTo?: string;


    address?: string;

    city?: string;

    state?: string;

    country?: string;

    postalCode?: string;


    notes?: string;

    metadata?: Record<string, unknown>;


    entityType?: 'Contact';

    entityId?: string;


    isActive?: boolean;

    isDeleted?: boolean;

    deletedAt?: string | null;

    deletedBy?: string | null;


    createdBy?: string;

    updatedBy?: string;

}




/**
 * ============================================================================
 * UPDATE CONTACT INPUT
 * ============================================================================
 */

export type UpdateContactInput =
    Partial<CreateContactInput>;




/**
 * ============================================================================
 * CONTACT SEARCH FILTERS
 * ============================================================================
 */

export interface ContactSearchFilters {

    search?: string;

    status?: ContactStatus;

    companyId?: string;

    ownerId?: string;

    assignedTo?: string;

    includeArchived?: boolean;

    includeInactive?: boolean;

    page?: number;

    pageSize?: number;

}




/**
 * ============================================================================
 * CONTACT SUMMARY
 * ============================================================================
 */

export interface ContactsSummary {

    total: number;

    active: number;

    inactive: number;

    leads: number;

    customers: number;

    archived: number;

}




/**
 * ============================================================================
 * CONTACT ACTIVITY
 * ============================================================================
 */

type ContactActivityType =
    | 'CALL'
    | 'EMAIL'
    | 'MEETING'
    | 'NOTE'
    | 'TASK';


interface ContactActivity {

    id: string;

    type: ContactActivityType;

    title: string;

    description?: string;

    createdAt: string;

}




/**
 * ============================================================================
 * CONTACT OPPORTUNITY
 * ============================================================================
 */

interface ContactOpportunity {

    id: string;

    title: string;

    value?: number;

    stage?: string;

    probability?: number;

}




/**
 * ============================================================================
 * CONTACT RELATIONSHIP SUMMARY
 * ============================================================================
 */

interface ContactRelationshipSummary {

    companyName?: string;

    opportunities: number;

    activities: number;

    lastActivity?: string;

}