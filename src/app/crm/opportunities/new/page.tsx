'use client';

import { useRouter } from 'next/navigation';

import { OpportunitiesForm } from '@/components/crm/opportunities';
import { createOpportunity } from '../actions';

export default function NewOpportunityPage() {

    const router = useRouter();

    return (
        <OpportunitiesForm
            onSubmit={async values => {
                await createOpportunity(values);
                router.push('/crm/opportunities');
                router.refresh();
            }}
            onCancel={() => router.back()}
        />
    );

}




