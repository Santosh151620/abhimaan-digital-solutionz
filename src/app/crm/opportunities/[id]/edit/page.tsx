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
} from '../../actions';


import type {
    Opportunity,
} from '@/types/crm/Opportunities';



interface Props {

    params:Promise<{
        id:string;
    }>;

}




export default async function EditOpportunityPage({

    params,

}:Props) {



    const {
        id,
    } = await params;




    const opportunity =

        await OpportunitiesServiceInstance.details(
            id
        );




    if (!opportunity) {

        notFound();

    }




    async function submit(

        values:Partial<Opportunity>

    ) {

        'use server';



        await updateOpportunity(

            id,

            values

        );



        redirect(

            `/crm/opportunities/${id}`

        );

    }




    return (


        <CRMPageLayout>



            <CRMHeader

                title="Edit Opportunity"

                description="Update CRM opportunity details."

                actions={[
                    {
                        label:"Back",
                        href:`/crm/opportunities/${id}`,
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