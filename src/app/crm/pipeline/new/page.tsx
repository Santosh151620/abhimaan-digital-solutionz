import {
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';

import {
    createOpportunity,
} from '../../opportunities/actions';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';

export default function NewPipelineOpportunityPage() {

    async function submit(
        values: Partial<Opportunity>,
    ) {

        'use server';

        const now =
            new Date().toISOString();

        const opportunity: Opportunity = {
entityType: 'Opportunity',
            id:
                crypto.randomUUID(),

            opportunityNumber:
                `OPP-${Date.now()}`,

            name:
                values.name ??
                values.title ??
                'New Opportunity',

            title:
                values.title ??
                values.name ??
                'New Opportunity',

            description:
                values.description,

            companyId:
                values.companyId,

            contactId:
                values.contactId,

            leadId:
                values.leadId,

            stage:
                values.stage ??
                'New',

            status:
                values.status ??
                'Open',

            value:
                values.value ??
                0,

            probability:
                values.probability ??
                0,

            expectedCloseDate:
                values.expectedCloseDate,

            ownerId:
                values.ownerId,

            createdAt:
                now,

            updatedAt:
                now,

        };

        await createOpportunity(
            opportunity,
        );

        redirect(
            '/crm/pipeline',
        );

    }

    return (

        <CRMPageLayout>

            <CRMHeader
                title="New Opportunity"
                description="Create a new sales pipeline opportunity."
                actions={[
                    {
                        label: 'Back',
                        href: '/crm/pipeline',
                    },
                ]}
            />

            <OpportunitiesForm
                onSubmit={submit}
            />

        </CRMPageLayout>

    );

}

