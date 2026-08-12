'use client';

import type { CompanyStatus } from '@/types/crm/Companies';

interface CompaniesFiltersProps {
    search: string;
    status: CompanyStatus | 'ALL';
    onSearchChange: (value: string) => void;
    onStatusChange: (value: CompanyStatus | 'ALL') => void;
}

const statuses: Array<CompanyStatus | 'ALL'> = [
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
        <section
            aria-label="Company filters"
            className="crm-card p-4"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                    <label
                        htmlFor="company-search"
                        className="mb-1.5 block text-sm font-medium"
                    >
                        Search
                    </label>

                    <input
                        id="company-search"
                        name="company-search"
                        type="search"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search companies..."
                        autoComplete="off"
                        className="
                            w-full
                            rounded-lg
                            border
                            bg-background
                            px-3
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            placeholder:text-muted-foreground
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    />
                </div>

                <div className="w-full md:w-56">
                    <label
                        htmlFor="company-status"
                        className="mb-1.5 block text-sm font-medium"
                    >
                        Status
                    </label>

                    <select
                        id="company-status"
                        name="company-status"
                        value={status}
                        onChange={(event) =>
                            onStatusChange(
                                event.target.value as CompanyStatus | 'ALL',
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            bg-background
                            px-3
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    >
                        {statuses.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item === 'ALL' ? 'All statuses' : item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}