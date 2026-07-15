'use client';

import { useRouter } from 'next/navigation';

import { OpportunitiesForm } from '@/components/crm/opportunities';
import type { Opportunity } from '@/types/crm/Opportunities';

interface Props {
    opportunity: Opportunity;
    updateOpportunity: (
        id: string,
        values: Partial<Opportunity>
    ) => Promise<unknown>;
}

export default function EditOpportunityClient({
    opportunity,
    updateOpportunity,
}: Props) {

    const router = useRouter();

    return (

        <OpportunitiesForm
            initialValues={opportunity}
            onSubmit={async values => {

                await updateOpportunity(
                    opportunity.id,
                    values,
                );

                router.push('/crm/opportunities');
                router.refresh();

            }}
            onCancel={() => router.back()}
        />

    );

}