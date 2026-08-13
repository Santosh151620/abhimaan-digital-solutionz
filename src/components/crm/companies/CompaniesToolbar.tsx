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
        <section
            aria-label="Companies toolbar"
            className="crm-card p-5"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Companies
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {total} {total === 1 ? 'company' : 'companies'}
                        {selected > 0 && (
                            <>
                                {' • '}
                             {selected} selected
                            </>
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            border
                            bg-background
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition
                            hover:bg-muted
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={onExport}
                        disabled={total === 0}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            border
                            bg-background
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition
                            hover:bg-muted
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Export CSV
                    </button>

                    <button
                        type="button"
                        onClick={onAdd}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-primary-foreground
                            transition
                            hover:opacity-90
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    >
                        + New Company
                    </button>
                </div>
            </div>
        </section>
    );
}