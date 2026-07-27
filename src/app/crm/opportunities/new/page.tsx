import { redirect } from 'next/navigation';

import OpportunitiesForm from '@/components/crm/opportunities/OpportunitiesForm';

import {
    createOpportunity,
} from '../actions';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';

export default function NewOpportunityPage() {

    async function submit(
        values: Partial<Opportunity>,
    ) {

        'use server';

        await createOpportunity(values as Opportunity);

        redirect('/crm/opportunities');

    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                New Opportunity
            </h1>

            <OpportunitiesForm
                onSubmit={submit}
            />

        </div>

    );

}

