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

        <section className="flex flex-col gap-4 rounded-xl border bg-background p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

                <h2 className="text-xl font-semibold">

                    Companies

                </h2>

                <p className="text-sm text-muted-foreground">

                    {total} Companies

                    {

                        selected > 0 &&

                        ` • ${selected} Selected`

                    }

                </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

                <button
                    type="button"
                    onClick={onRefresh}
                    className="rounded-lg border px-4 py-2 transition hover:bg-muted"
                >
                    Refresh
                </button>

                <button
                    type="button"
                    onClick={onExport}
                    className="rounded-lg border px-4 py-2 transition hover:bg-muted"
                >
                    Export CSV
                </button>

                <button
                    type="button"
                    onClick={onAdd}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
                >
                    + New Company
                </button>

            </div>

        </section>

    );

}
