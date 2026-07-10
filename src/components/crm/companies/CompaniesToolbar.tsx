'use client';

import Link from 'next/link';

interface CompaniesToolbarProps {
    total: number;
    selected: number;
    onDeleteSelected?: () => void;
}

export function CompaniesToolbar({
    total,
    selected,
    onDeleteSelected,
}: CompaniesToolbarProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between">

            <div>
                <h2 className="text-lg font-semibold">
                    Companies
                </h2>

                <p className="text-sm text-muted-foreground">
                    {total} companies
                    {selected > 0 && ` • ${selected} selected`}
                </p>
            </div>

            <div className="flex gap-2">

                {selected > 0 && (
                    <button
                        type="button"
                        onClick={onDeleteSelected}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                    >
                        Delete Selected
                    </button>
                )}

                <Link
                    href="/crm/companies/new"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    + New Company
                </Link>

            </div>

        </div>
    );
}