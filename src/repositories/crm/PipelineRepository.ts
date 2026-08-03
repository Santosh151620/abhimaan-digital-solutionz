import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    PipelineColumn,
    PipelineStage,
    PipelineSummary,
    PipelineStageCode,
} from '@/types/crm/Pipeline';


import type {
    Opportunity,
} from '@/types/crm/Opportunities';



interface OpportunityPipelineRow {
    id: string;
    entity_id?: string | null;

    title?: string | null;
    name?: string | null;

    companyId?: string | null;

    value?: number | null;
    probability?: number | null;

    stage?: string | null;

    is_deleted?: boolean;
}

export class PipelineRepository
    extends BaseRepository<Opportunity> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'opportunities',
        );

    }





    async getStages(): Promise<PipelineStage[]> {


        const {
            data,
            error,
        } =
            await this.supabase
                .from('pipeline_stages')
                .select('*')
                .eq('is_active', true)
                .order('display_order', {
                    ascending: true,
                });


        if (error) {

            throw error;

        }



        return (
            data ?? []
        ).map(
            stage => ({

                id:
                    stage.id,

                pipelineId:
                    stage.pipeline_id,

                code:
                    stage.stage_code
                        ?.toUpperCase() as PipelineStageCode,

                name:
                    stage.stage_name,

                description:
                    stage.description,

                order:
                    stage.display_order,

                probability:
                    stage.probability,

                isActive:
                    stage.is_active,

                metadata:
                    stage.metadata,

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
            await this.tableRef()
                .select('*')
                .eq('organization_id', this.organizationId)
                .eq('is_deleted', false)
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        const opportunities: OpportunityPipelineRow[] =
            data ?? [];

        return stages.map(
            stage => {


                const items =
                    opportunities
                        .filter(
                            opportunity =>
                                (opportunity.stage ?? '')
                                    .toUpperCase()
                                    .trim() === stage.code
                        )
                        .map(opportunity => ({

                            id:
                                opportunity.id,

                            entityId:
                                opportunity.entity_id ??
                                opportunity.id,

                            entityType:
                                'Opportunity' as const,

                            title:
                                opportunity.title ??
                                opportunity.name ??
                                'Untitled Opportunity',

                            companyId:
                                opportunity.companyId ?? undefined,

                            value:
                                Number(opportunity.value ?? 0),

                            probability:
                                Number(opportunity.probability ?? 0),

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


    async summary(): Promise<PipelineSummary> {

        const pipeline =
            await this.getPipeline();

        const totalOpportunities =
            pipeline.reduce(

                (total, item) =>
                    total +
                    item.opportunities.length,

                0,

            );

        const totalValue =
            pipeline.reduce(

                (total, item) =>
                    total +
                    item.totalValue,

                0,

            );

        const weightedValue =
            pipeline.reduce(

                (total, item) =>

                    total +

                    item.opportunities.reduce(

                        (sum, opportunity) =>

                            sum +

                            (
                                Number(opportunity.value ?? 0) *
                                Number(opportunity.probability ?? 0) /
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

export const PipelineRepositoryInstance =
    createPipelineRepository;