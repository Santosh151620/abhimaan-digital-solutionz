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

export interface PaymentSummary {

    total: number;

    pending: number;

    paid: number;

    overdue: number;

    cancelled: number;

    refunded: number;

    totalAmount: number;

    totalReceived: number;

    totalOutstanding: number;

}