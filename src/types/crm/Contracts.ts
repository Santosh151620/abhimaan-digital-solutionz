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

    title: string;

    customerName: string;

    status: ContractStatus;

    startDate: string;

    endDate: string;

    value: number;

    currency: string;

    notes?: string;

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}