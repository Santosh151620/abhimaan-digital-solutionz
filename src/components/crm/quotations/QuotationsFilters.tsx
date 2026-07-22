'use client';

import type { QuotationStatus } from '@/types/crm/Quotations';

interface Props {
    search: string;
    status: QuotationStatus | 'ALL';
    onSearchChange: (value: string) => void;
    onStatusChange: (
        value: QuotationStatus | 'ALL'
    ) => void;
}

const statuses: (QuotationStatus | 'ALL')[] = [
    'ALL',
    'Draft',
    'Sent',
    'Accepted',
    'Rejected',
];

export default function QuotationsFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
}: Props) {

    return (

        <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row">

            <input
                value={search}
                onChange={(e) =>
                    onSearchChange(
                        e.target.value
                    )
                }
                placeholder="Search quotations..."
                className="flex-1 rounded-lg border px-3 py-2 outline-none"
            />

            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(
                        e.target.value as
                        QuotationStatus | 'ALL'
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