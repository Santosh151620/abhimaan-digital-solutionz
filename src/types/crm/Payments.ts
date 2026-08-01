export type PaymentStatus =
    | 'Pending'
    | 'Paid'
    | 'Partially Paid'
    | 'Overdue'
    | 'Cancelled'
    | 'Refunded';


export type PaymentMethod =
    | 'Cash'
    | 'Bank Transfer'
    | 'Cheque'
    | 'Credit Card'
    | 'Debit Card'
    | 'UPI'
    | 'Wallet'
    | 'Other';



export interface Payment {

    /**
     * Entity identity
     */
    entityType: 'Payment';

    id: string;

    organizationId?: string;



    /**
     * Business identity
     */
    paymentNumber: string;



    /**
     * Relationships
     */
    invoiceId?: string;

    companyId?: string;



    /**
     * Display compatibility
     */
    customerName: string;

    description?: string;



    /**
     * Financial
     */
    amount: number;

    paidAmount: number;

    balanceAmount: number;

    currency: string;



    /**
     * Lifecycle
     */
    paymentMethod: PaymentMethod;

    status: PaymentStatus;



    /**
     * Dates
     */
    paymentDate?: string;

    dueDate?: string;



    /**
     * Reference
     */
    referenceNumber?: string;



    /**
     * Content
     */
    notes?: string;



    /**
     * Archive
     */
    archived: boolean;



    /**
     * Audit
     */
    createdAt: string;

    updatedAt: string;

}



export interface PaymentSearchFilters {

    search?: string;

    status?: PaymentStatus;

    companyId?: string;

    invoiceId?: string;

    paymentMethod?: PaymentMethod;

}



export interface PaymentSummary {


    /**
     * Active payments
     */
    total: number;


    /**
     * Archived payments
     */
    archived: number;


    pending: number;

    partiallyPaid: number;

    paid: number;

    overdue: number;

    cancelled: number;

    refunded: number;



    /**
     * Financial metrics
     */
    totalAmount: number;

    totalReceived: number;

    totalOutstanding: number;



    /**
     * Analytics
     */
    averagePayment: number;

    collectionRate: number;

}