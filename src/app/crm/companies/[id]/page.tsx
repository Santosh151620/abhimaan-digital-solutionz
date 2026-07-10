import Link from 'next/link';
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
        <main className="space-y-6">

            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {company.name}
                    </h1>

                    <p className="mt-1 text-muted-foreground">
                        Company Details
                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        href="/crm/companies"
                        className="rounded-lg border px-4 py-2 hover:bg-muted"
                    >
                        Back
                    </Link>

                    <Link
                        href={`/crm/companies/${company.id}/edit`}
                        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
                    >
                        Edit
                    </Link>

                </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Company Name
                    </p>

                    <p className="mt-1 font-medium">
                        {company.name}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Legal Name
                    </p>

                    <p className="mt-1">
                        {company.legalName ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Industry
                    </p>

                    <p className="mt-1">
                        {company.industry ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Status
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        {company.status}
                    </span>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Website
                    </p>

                    <p className="mt-1 break-all">
                        {company.website ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Email
                    </p>

                    <p className="mt-1">
                        {company.email ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Phone
                    </p>

                    <p className="mt-1">
                        {company.phone ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Employees
                    </p>

                    <p className="mt-1">
                        {company.employees ?? '—'}
                    </p>
                </div>

                <div className="rounded-xl border p-4 md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Address
                    </p>

                    <p className="mt-1">
                        {company.address ?? '—'}
                    </p>
                </div>

            </div>

        </main>
    );
}