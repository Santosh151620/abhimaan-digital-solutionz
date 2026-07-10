import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CompanyDetailsPage({
    params,
}: PageProps) {
    const { id } = await params;

    const company = await CompaniesServiceInstance.details(id);

    if (!company) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-semibold">
                    Company not found
                </h1>
            </div>
        );
    }

    return (
        <main className="space-y-6 p-6">

            <section className="rounded-xl border bg-background p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">
                            {company.name}
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            {company.industry ?? 'Industry not specified'}
                        </p>

                    </div>

                    <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        {company.status}
                    </span>

                </div>

            </section>

            <div className="grid gap-6 lg:grid-cols-3">

                <section className="rounded-xl border p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Company Information
                    </h2>

                    <dl className="space-y-3 text-sm">

                        <div className="flex justify-between">
                            <dt>Name</dt>
                            <dd>{company.name}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt>Website</dt>
                            <dd>{company.website ?? '—'}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt>Email</dt>
                            <dd>{company.email ?? '—'}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt>Phone</dt>
                            <dd>{company.phone ?? '—'}</dd>
                        </div>

                    </dl>

                </section>

                <section className="rounded-xl border p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Contacts
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Contacts will appear here.
                    </p>

                </section>

                <section className="rounded-xl border p-6">

                    <h2 className="mb-4 text-lg font-semibold">
                        Opportunities
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Opportunities will appear here.
                    </p>

                </section>

            </div>

            <section className="rounded-xl border p-6">

                <h2 className="mb-4 text-lg font-semibold">
                    Activity Timeline
                </h2>

                <p className="text-sm text-muted-foreground">
                    Activity history will appear here.
                </p>

            </section>

        </main>
    );
}