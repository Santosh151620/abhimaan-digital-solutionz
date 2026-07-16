export type InvoiceStatus =
    | 'Draft'
    | 'Sent'
    | 'Paid'
    | 'Overdue'
    | 'Cancelled';


export interface Invoice {

    id: string;

    invoiceNumber: string;

    companyId: string;

    customerName: string;

    contractId?: string;

    quotationId?: string;


    status: InvoiceStatus;


    issueDate: string;

    dueDate: string;


    subtotal: number;

    tax: number;

    total: number;


    currency: string;

    title?: string;

    amount?: number;
    paidAmount?: number;

    balanceAmount?: number;


    notes?: string;


    archived: boolean;


    createdAt: string;

    updatedAt: string;

}


export interface InvoiceSummary {

    title?: string;

    amount?: number;

    total: number;

    draft: number;

    sent: number;

    paid: number;

    overdue: number;

    cancelled: number;


    totalValue: number;

    outstandingValue: number;

}