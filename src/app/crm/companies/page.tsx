import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';
import {
CompaniesDataTable,
    CompaniesSummaryCards,
} from '@/components/crm/companies';

export default async function CompaniesPage() {
    const companies =
        await CompaniesServiceInstance.list();

    const total = companies.length;

    const active = companies.filter(
        (company) => company.status === 'ACTIVE'
    ).length;

    const prospect = companies.filter(
        (company) => company.status === 'PROSPECT'
    ).length;

    const inactive = companies.filter(
        (company) => company.status === 'INACTIVE'
    ).length;

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

            <section className="grid gap-4 md:grid-cols-4">

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Total Companies
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {total}
                    </h2>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Active
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        {active}
                    </h2>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Prospects
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {prospect}
                    </h2>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">
                        Inactive
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-600">
                        {inactive}
                    </h2>
                </div>

            </section>
<CompaniesSummaryCards />
            <CompaniesDataTable />

        </main>
    );
}