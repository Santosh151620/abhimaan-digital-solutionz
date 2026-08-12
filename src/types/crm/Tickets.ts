/**
 * CRM Tickets Domain Contract
 *
 * Single source of truth for:
 * - TicketsRepository
 * - TicketsService
 * - CRM UI
 * - API Actions
 *
 * Entity-driven CRM architecture.
 */


export type TicketStatus =
    | 'Open'
    | 'In Progress'
    | 'Resolved'
    | 'Closed';


export type TicketPriority =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';



export interface Ticket {

    /**
     * Entity identity
     */
    entityType: 'Ticket';

    id: string;

    organizationId?: string;


    /**
     * Business identity
     */
    ticketNumber: string;


    /**
     * CRM relationships
     */
    companyId?: string;

    contactId?: string;

    entityId?: string;



    /**
     * Ticket details
     */
    subject: string;

    description?: string;



    /**
     * Lifecycle
     */
    status: TicketStatus;

    priority: TicketPriority;



    /**
     * Ownership
     */
    assignedTo?: string;



    /**
     * Classification
     */
    category?: string;



    /**
     * Resolution
     */
    resolution?: string;



    /**
     * Lifecycle controls
     */
    archived: boolean;

    createdAt: string;

    updatedAt: string;

}



interface CreateTicketInput {

    ticketNumber?: string;

    companyId?: string;

    contactId?: string;

    entityId?: string;

    subject: string;

    description?: string;

    status?: TicketStatus;

    priority?: TicketPriority;

    assignedTo?: string;

    category?: string;

    resolution?: string;

}



type UpdateTicketInput =
    Partial<CreateTicketInput>;



export interface TicketSearchFilters {

    status?: TicketStatus;

    priority?: TicketPriority;

    companyId?: string;

    assignedTo?: string;

    search?: string;

}



export interface TicketSummary {

    total: number;

    open: number;

    inProgress: number;

    resolved: number;

    closed: number;

    critical: number;

}