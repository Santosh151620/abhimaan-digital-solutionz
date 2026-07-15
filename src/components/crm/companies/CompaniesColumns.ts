import type { Company } from '@/types/crm/Companies';

export interface CompanyColumn {
    key: keyof Company | 'select' | 'actions';
    label: string;
    className?: string;
    
}

export const CompaniesColumns: CompanyColumn[] = [
    {
        key: 'select',
        label: '',
        className: 'w-12',
    },
    {
        key: 'name',
        label: 'Company',
    },
    {
        key: 'industry',
        label: 'Industry',
    },
    {
        key: 'website',
        label: 'Website',
    },
    {
        key: 'phone',
        label: 'Phone',
    },
    {
        key: 'status',
        label: 'Status',
        className: 'w-36',
    },
    {
        key: 'actions',
        label: 'Actions',
        className: 'w-44',
    },
];




