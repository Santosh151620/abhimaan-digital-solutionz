'use client';

import type { CompanyStatus } from '@/types/crm/Companies';

interface CompaniesFiltersProps {
    search: string;
    status: CompanyStatus | 'ALL';
    onSearchChange: (value: string) => void;
    onStatusChange: (value: CompanyStatus | 'ALL') => void;
}

const statuses: (CompanyStatus | 'ALL')[] = [
    'ALL',
    'ACTIVE',
    'PROSPECT',
    'INACTIVE',
    'ARCHIVED',
];

export function CompaniesFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
}: CompaniesFiltersProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row">
            <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search companies..."
                className="flex-1 rounded-lg border px-3 py-2 outline-none"
            />

            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(
                        e.target.value as CompanyStatus | 'ALL'
                    )
                }
                className="rounded-lg border px-3 py-2"
            >
                {statuses.map((item) => (
                    <option
                        key={item}
                        value={item}
                    >
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}