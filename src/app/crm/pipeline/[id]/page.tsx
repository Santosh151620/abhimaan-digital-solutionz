import Link from 'next/link';
import {
    notFound,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import EntityOverviewGrid from '@/components/entities/EntityOverviewGrid';
import EntityWorkspace from '@/components/entities/EntityWorkspace';

import {
    PipelineServiceInstance,
} from '@/services/crm/PipelineService';


interface Props {

    params: Promise<{
        id: string;
    }>;

}


export default async function PipelineOpportunityPage({
    params,
}: Props) {

    const {
        id,
    } = await params;


    const opportunity =
        await PipelineServiceInstance.list()
            .then(items =>
                items
                    .flatMap(
                        column => column.opportunities
                    )
                    .find(
                        item => item.id === id
                    )
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
                        Pipeline Opportunity Details
                    </p>

                </div>


                <div className="flex gap-2">

                    <Link
                        href="/crm/pipeline"
                        className="rounded-lg border px-4 py-2"
                    >
                        Back
                    </Link>


                    <Link
                        href={`/crm/pipeline/${id}/edit`}
                        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
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
                                title: "Stage",
                                value: opportunity.stage,
                            },
                            {
                                title: "Company",
                                value: opportunity.companyId,
                            },
                            {
                                title: "Value",
                                value: `₹ ${opportunity.value}`,
                            },
                            {
                                title: "Probability",
                                value: `${opportunity.probability}%`,
                            },
                        ]}

                    />

                }

            />


        </CRMPageLayout>

    );

}