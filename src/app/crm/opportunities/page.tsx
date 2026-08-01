import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMToolbar from '@/components/crm/shared/toolbar/CRMToolbar';
import CRMTableContainer from '@/components/crm/shared/table/CRMTableContainer';
import CRMEmptyState from '@/components/crm/shared/table/CRMEmptyState';

import {
    OpportunitiesSummary,
    OpportunitiesTable,
} from '@/components/crm/opportunities';

import {
    getOpportunities,
    getOpportunitySummary,
} from './actions';


export default async function OpportunitiesPage() {


    const opportunities =
        await getOpportunities();


    const summary =
        await getOpportunitySummary();



    return (

        <CRMPageLayout>


            <CRMHeader

                title="Opportunities"

                description="Manage sales opportunities and revenue pipeline."

                actions={[

                    {
                        label: "New Opportunity",
                        href: "/crm/opportunities/new",
                    },

                ]}

            />



            <CRMToolbar

                title="Opportunities"

                createHref="/crm/opportunities/new"

                createLabel="New Opportunity"

            />



            <OpportunitiesSummary

                summary={summary}

            />



            <CRMTableContainer

                title="Opportunities"

                description="All CRM sales opportunities."

            >


                {
                    opportunities.length === 0 ? (

                        <CRMEmptyState

                            title="No opportunities found"

                            description="Create your first sales opportunity to start tracking revenue."

                            actionHref="/crm/opportunities/new"

                            actionLabel="Create Opportunity"

                        />

                    ) : (

                        <OpportunitiesTable

                            opportunities={opportunities}

                        />

                    )
                }


            </CRMTableContainer>



        </CRMPageLayout>

    );

}