import { CompaniesDataTable } from '@/components/crm/companies';

export default function CompaniesPage() {
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

            <CompaniesDataTable />

        </main>
    );
}