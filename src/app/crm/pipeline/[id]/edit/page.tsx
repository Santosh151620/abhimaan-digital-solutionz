import {
    notFound,
    redirect,
} from 'next/navigation';


import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';


import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';


import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';


import {
    updateOpportunity,
} from '../../../opportunities/actions';


import type {
    Opportunity,
} from '@/types/crm/Opportunities';



interface Props {

    params: Promise<{
        id: string;
    }>;

}



export default async function EditPipelineOpportunityPage({
    params,
}: Props) {


    const {
        id,
    } = await params;


    const opportunity =
        await OpportunitiesServiceInstance.details(id);


    if (!opportunity) {
        notFound();
    }



    async function submit(
        values: Partial<Opportunity>,
    ) {

        'use server';


        await updateOpportunity(
            id,
            values,
        );


        redirect(
            `/crm/pipeline/${id}`,
        );

    }



    return (

        <CRMPageLayout>


            <CRMHeader

                title="Edit Opportunity"

                description="Update pipeline opportunity details."

                actions={[
                    {
                        label: "Back",
                        href: `/crm/pipeline/${id}`,
                    },
                ]}

            />


            <OpportunitiesForm

                initialValues={opportunity}

                onSubmit={submit}

            />


        </CRMPageLayout>

    );

}