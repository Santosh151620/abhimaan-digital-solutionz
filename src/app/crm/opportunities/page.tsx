import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMToolbar from '@/components/crm/shared/toolbar/CRMToolbar';
import CRMTableContainer from '@/components/crm/shared/table/CRMTableContainer';
import CRMEmptyState from '@/components/crm/shared/table/CRMEmptyState';

import {
    listOpportunities,
} from './actions';


export default async function OpportunitiesPage() {


    const opportunities =
        await listOpportunities();



    return (

        <CRMPageLayout>


            <CRMHeader

                title="Opportunities"

                description="Manage CRM sales opportunities and revenue pipeline."

                actions={[
                    {
                        label: 'New Opportunity',
                        href: '/crm/opportunities/new',
                    },
                ]}

            />



            <CRMToolbar

                title="Opportunities"

                createHref="/crm/opportunities/new"

                createLabel="New Opportunity"

            />



            <CRMTableContainer

                title="Opportunities"

                description="Track sales opportunities and deal progress."

            >


                {
                    opportunities.length === 0 ? (

                        <CRMEmptyState

                            title="No opportunities found"

                            description="Create your first CRM opportunity to start tracking sales."

                            actionHref="/crm/opportunities/new"

                            actionLabel="Create Opportunity"

                        />

                    ) : (


                        <div className="rounded-lg border">

                            {
                                opportunities.map(
                                    opportunity => (

                                        <div

                                            key={opportunity.id}

                                            className="flex items-center justify-between border-b p-4 last:border-0"

                                        >

                                            <div>

                                                <p className="font-medium">

                                                    {opportunity.title}

                                                </p>


                                                <p className="text-sm text-muted-foreground">

                                                    {opportunity.stage}

                                                    {' • '}

                                                    ₹ {opportunity.value}

                                                </p>


                                            </div>



                                            <a

                                                href={`/crm/opportunities/${opportunity.id}`}

                                                className="text-sm text-primary"

                                            >

                                                View

                                            </a>


                                        </div>

                                    )

                                )
                            }


                        </div>


                    )
                }


            </CRMTableContainer>


        </CRMPageLayout>

    );

}