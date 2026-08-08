import {
    notFound,
} from "next/navigation";

import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import CRMHeader from "@/components/crm/shared/layout/CRMHeader";

import EntityOverviewGrid from "@/components/entities/EntityOverviewGrid";
import EntityWorkspace from "@/components/entities/EntityWorkspace";

import {
    OpportunitiesServiceInstance,
} from "@/services/crm/OpportunitiesService";


interface Props {
    params: Promise<{
        id: string;
    }>;
}


export default async function PipelineOpportunityPage({
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

    const formattedValue =
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency:
                    opportunity.currency ??
                    "INR",
                maximumFractionDigits: 0,
            },
        ).format(
            opportunity.value,
        );

    return (

        <CRMPageLayout>

            <CRMHeader
                title={
                    opportunity.title ||
                    opportunity.name
                }
                description="Pipeline opportunity workspace."
                actions={[
                    {
                        label: "Back",
                        href: "/crm/pipeline",
                    },
                    {
                        label: "Edit",
                        href:
                            `/crm/pipeline/${opportunity.id}/edit`,
                    },
                ]}
            />

            <EntityWorkspace
                entityType="Opportunity"
                entityId={opportunity.id}
                overview={

                    <EntityOverviewGrid
                        items={[
                            {
                                title: "Stage",
                                value:
                                    opportunity.stage,
                            },
                            {
                                title: "Status",
                                value:
                                    opportunity.status,
                            },
                            {
                                title: "Company",
                                value:
                                    opportunity.companyId ??
                                    "-",
                            },
                            {
                                title: "Value",
                                value:
                                    formattedValue,
                            },
                            {
                                title: "Probability",
                                value:
                                    `${opportunity.probability}%`,
                            },
                            {
                                title: "Expected Close",
                                value:
                                    opportunity.expectedCloseDate ??
                                    "-",
                            },
                            {
                                title: "Owner",
                                value:
                                    opportunity.ownerId ??
                                    "-",
                            },
                            {
                                title: "Created",
                                value:
                                    new Date(
                                        opportunity.createdAt,
                                    ).toLocaleDateString(),
                            },
                            {
                                title: "Updated",
                                value:
                                    new Date(
                                        opportunity.updatedAt,
                                    ).toLocaleDateString(),
                            },
                        ]}
                    />

                }
            />

        </CRMPageLayout>
    );
}