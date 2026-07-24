export type ContractStatus =
    | 'Draft'
    | 'Pending'
    | 'Active'
    | 'Completed'
    | 'Expired'
    | 'Terminated'
    | 'Cancelled';

export interface Contract {

    id: string;

    contractNumber: string;

    companyId: string;

    quotationId?: string;

    invoiceId?: string;

    title: string;

    customerName: string;

    status: ContractStatus;

    startDate: string;

    endDate: string;

    renewalDate?: string;

    autoRenew?: boolean;

    value: number;

    currency: string;

    subtotal?: number;

    tax?: number;

    discount?: number;

    total?: number;

    notes?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface ContractSummary {

    total: number;

    draft: number;

    pending: number;

    active: number;

    completed: number;

    expired: number;

    terminated: number;

    cancelled: number;

    archived: number;

    totalValue: number;

    activeValue: number;

}

export interface ContractSearchFilters {

    status?: ContractStatus;

    companyId?: string;

    search?: string;

}
