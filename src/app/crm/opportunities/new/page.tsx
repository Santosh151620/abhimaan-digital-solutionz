import { redirect } from 'next/navigation';

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