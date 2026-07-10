'use client';

interface CompaniesToolbarProps {
    total: number;
    selected: number;
    onAdd?: () => void;
    onRefresh?: () => void;
    onExport?: () => void;
}

export function CompaniesToolbar({
    total,
    selected,
    onAdd,
    onRefresh,
    onExport,
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

            <div className="flex flex-wrap gap-2">

                <button
                    type="button"
                    onClick={onRefresh}
                    className="rounded-lg border px-4 py-2 hover:bg-muted"
                >
                    Refresh
                </button>

                <button
                    type="button"
                    onClick={onExport}
                    className="rounded-lg border px-4 py-2 hover:bg-muted"
                >
                    Export CSV
                </button>

                <button
                    type="button"
                    onClick={onAdd}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Company
                </button>

            </div>

        </div>
    );
}