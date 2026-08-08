import {
    notFound,
    redirect,
} from "next/navigation";

import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import CRMHeader from "@/components/crm/shared/layout/CRMHeader";

import {
    OpportunitiesForm,
} from "@/components/crm/opportunities";

import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";

import {
    updateOpportunity,
} from "../../../opportunities/actions";

import type {
    UpdateOpportunityInput,
} from "@/types/crm/Opportunities";


interface Props {
    params: Promise<{
        id: string;
    }>;
}


export default async function EditPipelineOpportunityPage({
    params,
}: Props) {

    const {
        id,
    } = await params;

    const normalizedId =
        id?.trim();

    if (!normalizedId) {
        notFound();
    }

    const opportunity =
        await OpportunitiesServiceInstance.details(
            normalizedId,
        );

    if (!opportunity) {
        notFound();
    }


    async function submit(
        values: UpdateOpportunityInput,
    ) {

        "use server";

        await updateOpportunity(
            normalizedId,
            values,
        );

        redirect(
            `/crm/pipeline/${normalizedId}`,
        );
    }


    return (

        <CRMPageLayout>

            <CRMHeader
                title="Edit Opportunity"
                description="Update pipeline opportunity details."
                actions={[
                    {
                        label: "Back",
                        href:
                            `/crm/pipeline/${normalizedId}`,
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