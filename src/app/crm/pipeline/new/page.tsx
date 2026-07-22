import {
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';

import {
    createOpportunity,
} from '../../opportunities/actions';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';


export default function NewPipelineOpportunityPage() {


    async function submit(
        values: Partial<Opportunity>,
    ) {
        'use server';


        await createOpportunity(
            values,
        );


        redirect(
            '/crm/pipeline',
        );

    }


    return (

        <CRMPageLayout>

            <CRMHeader
                title="New Opportunity"
                description="Create a new sales pipeline opportunity."
                actions={[
                    {
                        label: "Back",
                        href: "/crm/pipeline",
                    },
                ]}
            />


            <OpportunitiesForm
                onSubmit={submit}
            />


        </CRMPageLayout>

    );

}