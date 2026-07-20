import { redirect } from 'next/navigation';

import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';

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

        await createOpportunity(
            values,
        );

        redirect(
            '/crm/opportunities',
        );
    }

    return (

        <OpportunitiesForm
            onSubmit={submit}
        />

    );

}