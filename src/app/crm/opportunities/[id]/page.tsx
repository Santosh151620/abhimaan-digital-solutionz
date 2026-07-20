import Link from 'next/link';
import { notFound } from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import EntityOverviewGrid from '@/components/entities/EntityOverviewGrid';
import EntityWorkspace from '@/components/entities/EntityWorkspace';

import {
    listOpportunities,
} from '../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function OpportunityDetailsPage({
    params,
}: Props) {

    const { id } = await params;

    const opportunities =
        await listOpportunities();

    const opportunity =
        opportunities.find(
            item => item.id === id,
        );

    if (!opportunity) {
        notFound();
    }

    return (

        <CRMPageLayout>

            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {opportunity.title}
                    </h1>

                    <p className="text-muted-foreground">
                        Opportunity Details
                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        href="/crm/opportunities"
                        className="rounded-lg border px-4 py-2 hover:bg-muted"
                    >
                        Back
                    </Link>

                    <Link
                        href={`/crm/opportunities/${opportunity.id}/edit`}
                        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
                    >
                        Edit
                    </Link>

                </div>

            </div>

            <EntityWorkspace
                entityType="Opportunity"
                entityId={opportunity.id}
                overview={
                    <EntityOverviewGrid
                        items={[
                            {
                                title: 'Stage',
                                value: opportunity.stage,
                            },
                            {
                                title: 'Company',
                                value: opportunity.companyId,
                            },
                            {
                                title: 'Value',
                                value: `₹ ${opportunity.value}`,
                            },
                            {
                                title: 'Probability',
                                value: `${opportunity.probability}%`,
                            },
                            {
                                title: 'Expected Close',
                                value:
                                    opportunity.expectedCloseDate ??
                                    '—',
                            },
                            {
                                title: 'Owner',
                                value:
                                    opportunity.owner ??
                                    '—',
                            },
                            {
                                title: 'Created',
                                value: new Date(
                                    opportunity.createdAt,
                                ).toLocaleDateString(),
                            },
                            {
                                title: 'Last Updated',
                                value: new Date(
                                    opportunity.updatedAt,
                                ).toLocaleDateString(),
                            },
                        ]}
                    />
                }
            />

        </CRMPageLayout>

    );

}