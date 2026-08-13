import type {
    BaseEntity,
} from '@/types/platform/BaseEntity';


export type CompanyStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'PROSPECT'
    | 'ARCHIVED';



export interface Company extends BaseEntity {

    entityType: 'Company';

    companyNumber?: string;

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

    postalCode?: string;

    employees?: number;

    annualRevenue?: number;

    taxId?: string;

    description?: string;

}



export interface CompanyContact {

    id: string;

    firstName?: string;

    lastName?: string;

    name: string;

    email?: string;

    phone?: string;

    role?: string;

}



export interface CompanyOpportunity {

    id: string;

    title: string;

    value: number;

    currency?: string;

    stage: string;

    probability: number;

}



export type CompanyActivityType =
    | 'CALL'
    | 'EMAIL'
    | 'MEETING'
    | 'NOTE'
    | 'TASK';



export interface CompanyActivity {

    id: string;

    type: CompanyActivityType;

    title: string;

    description?: string;

    createdAt: string;

}



export interface CompanyDetails extends Company {

    contacts: CompanyContact[];

    opportunities: CompanyOpportunity[];

    activities: CompanyActivity[];

}


export interface CreateCompanyInput {

    name: string;

    legalName?: string;

    industry?: string;

    website?: string;

    phone?: string;

    email?: string;

    status?: CompanyStatus;

    address?: string;

    city?: string;

    state?: string;

    country?: string;

    postalCode?: string;

    employees?: number;

    annualRevenue?: number;

    taxId?: string;

    description?: string;

}


export type UpdateCompanyInput =
    Partial<CreateCompanyInput>;


export interface CompanySearchFilters {

    status?: CompanyStatus;

    industry?: string;

    search?: string;

}



export interface CompaniesSummary {

    total: number;

    active: number;

    inactive: number;

    prospects: number;

    archived: number;

}