'use client';

import { useCompanies } from '@/hooks/crm/useCompanies';
import { CompaniesDataTable } from '@/components/crm/companies';

export default function CompaniesPage() {
    const { data = [] } = useCompanies();

    const total = data.length;
    const active = data.filter((c) => c.status === 'ACTIVE').length;
    const prospect = data.filter((c) => c.status === 'PROSPECT').length;
    const inactive = data.filter((c) => c.status === 'INACTIVE').length;
    const archived = data.filter((c) => c.status === 'ARCHIVED').length;

    return (
        <main className="space-y-6">

            <section>

                <h1 className="text-3xl font-bold">
                    Companies
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage companies, customers and business accounts.
                </p>

            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Total Companies
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {total}
                    </p>
                </div>

                <div className="rounded-xl border bg-green-50 p-5">
                    <p className="text-sm text-green-700">
                        Active
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-700">
                        {active}
                    </p>
                </div>

                <div className="rounded-xl border bg-blue-50 p-5">
                    <p className="text-sm text-blue-700">
                        Prospects
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-700">
                        {prospect}
                    </p>
                </div>

                <div className="rounded-xl border bg-gray-50 p-5">
                    <p className="text-sm text-gray-700">
                        Inactive
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-700">
                        {inactive}
                    </p>
                </div>

                <div className="rounded-xl border bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        Archived
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-700">
                        {archived}
                    </p>
                </div>

            </section>

            <CompaniesDataTable />

        </main>
    );
}