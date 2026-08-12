import type { Company } from '@/types/crm/Companies';

export interface CompanyColumn {
    key:
        | keyof Company
        | 'select'
        | 'actions';

    label: string;

    sortable?: boolean;

    className?: string;

    /**
     * Optional accessibility label for column-specific controls.
     */
    ariaLabel?: string;
}

export const CompaniesColumns: CompanyColumn[] = [
    {
        key: 'select',
        label: '',
        className: 'w-12',
        ariaLabel: 'Select company',
    },

    {
        key: 'name',
        label: 'Company',
        sortable: true,
        className: 'min-w-[220px]',
    },

    {
        key: 'industry',
        label: 'Industry',
        sortable: true,
        className: 'min-w-[180px]',
    },

    {
        key: 'website',
        label: 'Website',
        className: 'min-w-[220px]',
    },

    {
        key: 'phone',
        label: 'Phone',
        className: 'min-w-[160px]',
    },

    {
        key: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-40',
    },

    {
        key: 'actions',
        label: 'Actions',
        className: 'w-44 text-right',
    },
];