import { notFound } from 'next/navigation';

import EditOpportunityClient from './EditOpportunityClient';

import { updateOpportunity } from '../../actions';
import { OpportunitiesServiceInstance } from '@/services/crm/OpportunitiesService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditOpportunityPage({
    params,
}: Props) {

    const { id } = await params;

    const opportunity =
        await OpportunitiesServiceInstance.details(id);

    if (!opportunity) {
        notFound();
    }

    return (
        <EditOpportunityClient
            opportunity={opportunity}
            updateOpportunity={updateOpportunity}
        />
    );

}