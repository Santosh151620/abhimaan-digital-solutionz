import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    PipelineColumn,
    PipelineStage,
    PipelineSummary,
    PipelineStageCode,
} from "@/types/crm/Pipeline";

import type {
    Opportunity,
    OpportunityStage,
    OpportunitySummary,
} from "@/types/crm/Opportunities";


interface PipelineStageRow {

    id: string;

    pipeline_id?: string | null;

    stage_code?: string | null;

    stage_name?: string | null;

    description?: string | null;

    display_order?: number | null;

    probability?: number | null;

    is_active?: boolean | null;

    metadata?: Record<string, unknown> | null;

}


interface OpportunityPipelineRow {

    id: string;

    entity_id?: string | null;

    opportunity_name?: string | null;

    company_id?: string | null;

    amount?: number | null;

    probability?: number | null;

    stage?: OpportunityStage | null;

    status?: Opportunity["status"] | null;

    is_deleted?: boolean | null;

}


class PipelineRepository
    extends BaseRepository<Opportunity> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "opportunities",
        );
    }


    async getStages(): Promise<PipelineStage[]> {

        const {
            data,
            error,
        } =
            await this.supabase
                .from("pipeline_stages")
                .select("*")
                .eq(
                    "is_active",
                    true,
                )
                .order(
                    "display_order",
                    {
                        ascending: true,
                    },
                );

        if (error) {
            throw error;
        }

        const rows =
            (data ?? []) as PipelineStageRow[];

        return rows.map(
            stage => ({

                id:
                    stage.id,

              pipelineId:
    stage.pipeline_id ??
    undefined,

                code:
                    (
                        stage.stage_code ??
                        ""
                    ).toUpperCase() as PipelineStageCode,

                name:
                    stage.stage_name ??
                    "",

                description:
                    stage.description ??
                    undefined,

                order:
                    stage.display_order ??
                    0,

                probability:
                    Number(
                        stage.probability ??
                        0,
                    ),

                isActive:
                    stage.is_active ??
                    false,

                metadata:
                    stage.metadata ??
                    {},

            }),
        );
    }


    async getPipeline(): Promise<PipelineColumn[]> {

        const stages =
            await this.getStages();

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "entity_id",
                        "opportunity_name",
                        "company_id",
                        "amount",
                        "probability",
                        "stage",
                        "status",
                        "is_deleted",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "is_deleted",
                    false,
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    },
                );

        if (error) {
            throw error;
        }

        const opportunities =
    (data ?? []) as unknown as OpportunityPipelineRow[];

        return stages.map(
            stage => {

                const items =
                    opportunities
                        .filter(
                            opportunity =>
                                (
                                    opportunity.stage ??
                                    ""
                                )
                                    .toString()
                                    .toUpperCase()
                                    .trim() ===
                                stage.code,
                        )
                        .map(
                            opportunity => ({

                                id:
                                    opportunity.id,

                                entityId:
                                    opportunity.entity_id ??
                                    opportunity.id,

                                entityType:
                                    "Opportunity" as const,

                                title:
                                    opportunity.opportunity_name ??
                                    "Untitled Opportunity",

                                companyId:
                                    opportunity.company_id ??
                                    undefined,

                                value:
                                    Number(
                                        opportunity.amount ??
                                        0,
                                    ),

                                probability:
                                    Number(
                                        opportunity.probability ??
                                        0,
                                    ),

                                stage:
                                    stage.code,

                            }),
                        );

                return {

                    stage,

                    opportunities:
                        items,

                    totalValue:
                        items.reduce(
                            (
                                total,
                                item,
                            ) =>
                                total +
                                item.value,
                            0,
                        ),

                };
            },
        );
    }


    async moveOpportunity(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity> {

        const normalizedId =
            id?.trim();

        if (!normalizedId) {
            throw new Error(
                "Opportunity id is required.",
            );
        }

        const status:
            | "Open"
            | "Won"
            | "Lost"
            | "On Hold" =
            stage === "Won"
                ? "Won"
                : stage === "Lost"
                    ? "Lost"
                    : "Open";

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .update({

                    stage,

                    status,

                    updated_at:
                        new Date()
                            .toISOString(),

                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .select("*")
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "Opportunity not found.",
            );
        }

        const row =
            data as OpportunityPipelineRow;

        return {

            id:
                row.id,

            entityType:
                "Opportunity",

            entityId:
                row.entity_id ??
                row.id,

            opportunityNumber:
                "",

            name:
                row.opportunity_name ??
                "Untitled Opportunity",

            title:
                row.opportunity_name ??
                "Untitled Opportunity",

            companyId:
                row.company_id ??
                undefined,

            value:
                Number(
                    row.amount ??
                    0,
                ),

            probability:
                Number(
                    row.probability ??
                    0,
                ),

            stage:
                row.stage ??
                "New",

            status:
                row.status ??
                "Open",

            metadata:
                {},

        } as Opportunity;
    }


    async opportunitySummary(): Promise<OpportunitySummary> {

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "amount",
                        "probability",
                        "status",
                        "is_deleted",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "is_deleted",
                    false,
                );

        if (error) {
            throw error;
        }

        const opportunities =
    (data ?? []) as unknown as Array<{
        id: string;
        amount?: number | null;
        probability?: number | null;
        status?: Opportunity["status"] | null;
    }>;
        const totalValue =
            opportunities.reduce(
                (
                    total,
                    opportunity,
                ) =>
                    total +
                    Number(
                        opportunity.amount ??
                        0,
                    ),
                0,
            );

        const open =
            opportunities.filter(
                opportunity =>
                    opportunity.status === "Open",
            ).length;

        const won =
            opportunities.filter(
                opportunity =>
                    opportunity.status === "Won",
            ).length;

        const lost =
            opportunities.filter(
                opportunity =>
                    opportunity.status === "Lost",
            ).length;

        const weightedValue =
            opportunities.reduce(
                (
                    total,
                    opportunity,
                ) =>
                    total +
                    (
                        Number(
                            opportunity.amount ??
                            0,
                        ) *
                        Number(
                            opportunity.probability ??
                            0,
                        ) /
                        100
                    ),
                0,
            );

        return {

            total:
                opportunities.length,

            open,

            won,

            lost,

            pipelineValue:
                totalValue,

            weightedValue,

            totalValue,

        };
    }


    async summary(): Promise<PipelineSummary> {

        const pipeline =
            await this.getPipeline();

        const totalOpportunities =
            pipeline.reduce(
                (
                    total,
                    column,
                ) =>
                    total +
                    column.opportunities.length,
                0,
            );

        const totalValue =
            pipeline.reduce(
                (
                    total,
                    column,
                ) =>
                    total +
                    column.totalValue,
                0,
            );

        const weightedValue =
            pipeline.reduce(
                (
                    total,
                    column,
                ) =>
                    total +
                    column.opportunities.reduce(
                        (
                            sum,
                            opportunity,
                        ) =>
                            sum +
                            (
                                opportunity.value *
                                opportunity.probability /
                                100
                            ),
                        0,
                    ),
                0,
            );

        return {

            stages:
                pipeline.length,

            totalOpportunities,

            total:
                totalOpportunities,

            pipelineValue:
                totalValue,

            totalValue,

            weightedValue,

        };
    }

}


export function createPipelineRepository(
    supabase: SupabaseClient,
) {

    return new PipelineRepository(
        supabase,
    );
}


const PipelineRepositoryInstance =
    createPipelineRepository;