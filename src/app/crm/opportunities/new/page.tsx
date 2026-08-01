import {
    redirect,
} from 'next/navigation';


import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';


import OpportunitiesForm from '@/components/crm/opportunities/OpportunitiesForm';


import {
    createOpportunity,
} from '../actions';


import type {
    CreateOpportunityInput,
} from '@/types/crm/Opportunities';



export default function NewOpportunityPage() {


    async function submit(

        values: CreateOpportunityInput,

    ) {

        'use server';


        await createOpportunity(

            values,

        );


        redirect(

            '/crm/opportunities',

        );

    }



    return (

        <CRMPageLayout>


            <CRMHeader

                title="New Opportunity"

                description="Create a new CRM sales opportunity."

                actions={[

                    {
                        label: "Back",
                        href: "/crm/opportunities",
                    },

                ]}

            />



            <OpportunitiesForm

                onSubmit={submit}

            />


        </CRMPageLayout>

    );

}