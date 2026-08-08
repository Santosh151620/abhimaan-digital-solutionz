import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createOpportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';


interface Props {

    params: Promise<{
        id: string;
    }>;

}


export const dynamic = 'force-dynamic';


export default async function OpportunityDetailsPage({
    params,
}: Props) {

    const {
        id,
    } =
        await params;


    if (!id?.trim()) {

        notFound();

    }


    const supabase =
        await createClient();


    const repository =
        createOpportunitiesRepository(
            supabase,
        );


    const opportunity =
        await repository.details(
            id,
        );


    if (!opportunity) {

        notFound();

    }


    const value =
        Number(
            opportunity.value ?? 0,
        );


    const probability =
        Number(
            opportunity.probability ?? 0,
        );


    const weightedValue =
        value *
        probability /
        100;


    return (

        <div className="space-y-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>

                    <div className="mb-2 text-sm text-muted-foreground">

                        <Link
                            href="/crm/opportunities"
                            className="hover:underline"
                        >
                            Opportunities
                        </Link>

                        {' / '}

                        {opportunity.opportunityNumber || opportunity.id}

                    </div>


                    <h1 className="text-3xl font-bold tracking-tight">

                        {opportunity.name}

                    </h1>


                    {opportunity.title &&
                        opportunity.title !== opportunity.name && (

                            <p className="mt-1 text-muted-foreground">

                                {opportunity.title}

                            </p>

                        )}

                </div>


                <div className="flex gap-2">

                    <Link
                        href={`/crm/opportunities/${opportunity.id}/edit`}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Edit
                    </Link>


                    <Link
                        href="/crm/opportunities"
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Back
                    </Link>

                </div>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border p-5">

                    <div className="text-sm text-muted-foreground">
                        Deal Value
                    </div>

                    <div className="mt-1 text-2xl font-semibold">
                        {value.toLocaleString()}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                        {opportunity.currency ?? 'INR'}
                    </div>

                </div>


                <div className="rounded-xl border p-5">

                    <div className="text-sm text-muted-foreground">
                        Probability
                    </div>

                    <div className="mt-1 text-2xl font-semibold">
                        {probability}%
                    </div>

                </div>


                <div className="rounded-xl border p-5">

                    <div className="text-sm text-muted-foreground">
                        Weighted Value
                    </div>

                    <div className="mt-1 text-2xl font-semibold">
                        {weightedValue.toLocaleString()}
                    </div>

                </div>


                <div className="rounded-xl border p-5">

                    <div className="text-sm text-muted-foreground">
                        Expected Close
                    </div>

                    <div className="mt-1 text-lg font-semibold">
                        {opportunity.expectedCloseDate ?? '-'}
                    </div>

                </div>

            </div>


            <div className="grid gap-6 lg:grid-cols-3">

                <div className="space-y-6 lg:col-span-2">

                    <section className="rounded-xl border p-6">

                        <h2 className="text-lg font-semibold">
                            Opportunity Details
                        </h2>


                        <dl className="mt-5 grid gap-5 sm:grid-cols-2">

                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Stage
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.stage}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Status
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.status}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Opportunity Number
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.opportunityNumber || '-'}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Currency
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.currency ?? 'INR'}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Company
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.companyId ?? '-'}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Contact
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.contactId ?? '-'}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Owner
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.owner ??
                                        opportunity.ownerId ??
                                        '-'}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Created
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.createdAt
                                        ? new Date(
                                            opportunity.createdAt,
                                        ).toLocaleDateString()
                                        : '-'}
                                </dd>

                            </div>

                        </dl>

                    </section>


                    <section className="rounded-xl border p-6">

                        <h2 className="text-lg font-semibold">
                            Description
                        </h2>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {opportunity.description ||
                                'No description provided.'}
                        </p>

                    </section>


                    <section className="rounded-xl border p-6">

                        <h2 className="text-lg font-semibold">
                            Notes
                        </h2>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {opportunity.notes ||
                                'No notes provided.'}
                        </p>

                    </section>

                </div>


                <aside className="space-y-6">

                    <section className="rounded-xl border p-6">

                        <h2 className="text-lg font-semibold">
                            Forecast
                        </h2>


                        <div className="mt-5 space-y-4">

                            <div>

                                <div className="text-sm text-muted-foreground">
                                    Forecast Revenue
                                </div>

                                <div className="mt-1 font-medium">
                                    {opportunity.forecastRevenue !==
                                    undefined &&
                                    opportunity.forecastRevenue !== null
                                        ? Number(
                                            opportunity.forecastRevenue,
                                        ).toLocaleString()
                                        : '-'}
                                </div>

                            </div>


                            <div>

                                <div className="text-sm text-muted-foreground">
                                    Recurring Revenue
                                </div>

                                <div className="mt-1 font-medium">
                                    {opportunity.recurringRevenue !==
                                    undefined &&
                                    opportunity.recurringRevenue !== null
                                        ? Number(
                                            opportunity.recurringRevenue,
                                        ).toLocaleString()
                                        : '-'}
                                </div>

                            </div>


                            <div>

                                <div className="text-sm text-muted-foreground">
                                    Weighted Pipeline
                                </div>

                                <div className="mt-1 font-medium">
                                    {weightedValue.toLocaleString()}
                                </div>

                            </div>

                        </div>

                    </section>


                    <section className="rounded-xl border p-6">

                        <h2 className="text-lg font-semibold">
                            Record Information
                        </h2>


                        <dl className="mt-5 space-y-4">

                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Entity Type
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.entityType}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Entity ID
                                </dt>

                                <dd className="mt-1 break-all font-mono text-xs">
                                    {opportunity.entityId}
                                </dd>

                            </div>


                            <div>

                                <dt className="text-sm text-muted-foreground">
                                    Updated
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {opportunity.updatedAt
                                        ? new Date(
                                            opportunity.updatedAt,
                                        ).toLocaleDateString()
                                        : '-'}
                                </dd>

                            </div>

                        </dl>

                    </section>

                </aside>

            </div>

        </div>

    );

}
