export type CompanyStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'PROSPECT'
    | 'ARCHIVED';

export interface Company {
    id: string;

    name: string;
    legalName?: string;

    industry?: string;

    website?: string;
    phone?: string;
    email?: string;

    status: CompanyStatus;

    address?: string;
    city?: string;
    state?: string;
    country?: string;

    employees?: number;
    annualRevenue?: number;

    /**
     * Platform Standard
     * Soft Delete
     */
    isDeleted?: boolean;
    deletedAt?: string | null;
    deletedBy?: string | null;

    /**
     * Audit
     */
    createdAt: string;
    updatedAt: string;
}

export interface CompanyContact {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
}

export interface CompanyOpportunity {
    id: string;
    title: string;
    value: number;
    stage: string;
    probability: number;
}

export interface CompanyActivity {
    id: string;
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK';
    title: string;
    description?: string;
    createdAt: string;
}

export interface CompanyDetails extends Company {
    contacts: CompanyContact[];
    opportunities: CompanyOpportunity[];
    activities: CompanyActivity[];
}




