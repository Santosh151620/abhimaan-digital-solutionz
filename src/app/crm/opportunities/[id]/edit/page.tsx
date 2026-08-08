import {
    notFound,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import EditOpportunityClient from './EditOpportunityClient';

import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';

import {
    updateOpportunity,
} from '../../actions';


interface Props {

    params: Promise<{
        id: string;
    }>;

}


export const dynamic = 'force-dynamic';


export default async function EditOpportunityPage({

    params,

}: Props) {


    const {
        id,
    } =
        await params;


    if (!id?.trim()) {

        notFound();

    }


    const opportunity =
        await OpportunitiesServiceInstance.details(
            id,
        );


    if (!opportunity) {

        notFound();

    }


    return (

        <CRMPageLayout>

            <CRMHeader

                title="Edit Opportunity"

                description="Update CRM opportunity details."

                actions={[

                    {
                        label: 'Back',

                        href:
                            `/crm/opportunities/${id}`,
                    },

                ]}

            />


            <EditOpportunityClient

                opportunity={
                    opportunity
                }

                updateOpportunity={
                    updateOpportunity
                }

            />

        </CRMPageLayout>

    );

}
