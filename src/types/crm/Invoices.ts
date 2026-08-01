export type InvoiceStatus =
    | 'Draft'
    | 'Sent'
    | 'Paid'
    | 'Overdue'
    | 'Cancelled';



export interface Invoice {


    /**
     * Entity identity
     */

    entityType:
        'Invoice';

    entityId?: string;

    id:
        string;

    organizationId?: string;



    /**
     * Relationships
     */

    companyId?: string;

    contactId?: string;

    contractId?: string;

    quotationId?: string;

    ownerId?: string;



    /**
     * Business identity
     */

    invoiceNumber:
        string;

    title:
        string;

    description?: string;



    /**
     * Display compatibility
     */

    customerName?: string;



    /**
     * Lifecycle
     */

    status:
        InvoiceStatus;


    issueDate:
        string;


    dueDate:
        string;



    /**
     * Financial
     */

    currency:
        string;


    subtotal:
        number;


    tax:
        number;


    discount:
        number;


    total:
        number;



    /**
     * Payment tracking
     */

    paidAmount:
        number;


    balanceAmount:
        number;



    /**
     * Backward compatibility
     */

    amount:
        number;



    value:
        number;



    /**
     * Content
     */

    notes?: string;



    /**
     * Extension
     */

    metadata?: Record<string, unknown>;



    /**
     * Archive
     */

    archived:
        boolean;



    /**
     * Audit
     */

    createdBy?: string;

    updatedBy?: string;


    createdAt:
        string;


    updatedAt:
        string;

}




export interface InvoiceSearchFilters {


    status?:
        InvoiceStatus;


    companyId?:
        string;


    search?:
        string;

}




export interface InvoiceSummary {


    total:
        number;


    draft:
        number;


    sent:
        number;


    paid:
        number;


    overdue:
        number;


    cancelled:
        number;


    archived:
        number;



    totalValue:
        number;


    outstandingValue:
        number;



    /**
     * Backward compatibility
     */

    value?:
        number;

}