import { notFound } from 'next/navigation';

import { CompaniesServiceInstance } from '@/services/crm/CompaniesService';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CompaniesDetailsPage({
    params,
}: PageProps) {
    const { id } = await params;

    const company =
        await CompaniesServiceInstance.details(id);

    if (!company) {
        notFound();
    }

    return (
        <section className="space-y-6 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    {company.name}
                </h1>

                <p className="text-muted-foreground">
                    Company Details
                </p>

            </div>

            <div className="grid gap-6 rounded-xl border p-6 md:grid-cols-2">

                <div>
                    <p className="text-sm text-muted-foreground">
                        Industry
                    </p>

                    <p>{company.industry ?? '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Status
                    </p>

                    <p>{company.status}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Website
                    </p>

                    <p>{company.website ?? '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Email
                    </p>

                    <p>{company.email ?? '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Phone
                    </p>

                    <p>{company.phone ?? '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Employees
                    </p>

                    <p>{company.employees ?? '—'}</p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Address
                    </p>

                    <p>
                        {company.address ?? '—'}
                    </p>
                </div>

            </div>

        </section>
    );
}