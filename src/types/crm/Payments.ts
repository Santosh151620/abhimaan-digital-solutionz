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

    id: string;

    paymentNumber: string;

    organizationId?: string;

    invoiceId?: string;

    companyId?: string;

    customerName: string;

    description?: string;

    amount: number;

    paidAmount: number;

    balanceAmount: number;

    currency: string;

    paymentMethod: PaymentMethod;

    status: PaymentStatus;

    paymentDate?: string;

    dueDate?: string;

    referenceNumber?: string;

    notes?: string;

    archived: boolean;

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
     * Active (non-archived) payments
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
     * Gross invoiced/payment amount
     */
    totalAmount: number;

    /**
     * Amount already collected
     */
    totalReceived: number;

    /**
     * Remaining receivable
     */
    totalOutstanding: number;

    /**
     * Average payment value
     */
    averagePayment: number;

    /**
     * Collection percentage
     * (0 - 100)
     */
    collectionRate: number;

}
