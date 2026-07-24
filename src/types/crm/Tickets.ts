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

    id: string;

    ticketNumber: string;

    companyId?: string;

    contactId?: string;

    subject: string;

    description?: string;

    status: TicketStatus;

    priority: TicketPriority;

    assignedTo?: string;

    category?: string;

    resolution?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface TicketSummary {

    total: number;

    open: number;

    inProgress: number;

    resolved: number;

    closed: number;

    critical: number;

}