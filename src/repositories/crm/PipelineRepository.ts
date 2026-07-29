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
                .order(
                    'display_order',
                    {
                        ascending: true,
                    },
                );



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
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        const opportunities =
            (
                data ?? []
            ) as Opportunity[];




        return stages.map(
            stage => {


                const items =
                    opportunities
                        .filter(
                            opportunity =>
                                opportunity.stage
                                    ?.toUpperCase()
                                === stage.code,
                        )
                        .map(
                            opportunity => ({

                                id:
                                    opportunity.id,

                                entityType:
                                    'Opportunity' as const,

                                title:
                                    opportunity.title
                                    ??
                                    opportunity.name,

                                companyId:
                                    opportunity.companyId,

                                value:
                                    opportunity.value,

                                probability:
                                    opportunity.probability,

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
        return {


            stages:
                pipeline.length,


            totalOpportunities:

                pipeline.reduce(

                    (
                        total,
                        item,
                    ) =>
                        total +
                        item.opportunities.length,

                    0,

                ),
            total:
                pipeline.reduce(

                    (
                        total,
                        item,
                    ) =>
                        total +
                        item.opportunities.length,

                    0,

                ),

            pipelineValue:
                pipeline.reduce(

                    (
                        total,
                        item,
                    ) =>
                        total +
                        item.totalValue,

                    0,

                ),

            totalValue:

                pipeline.reduce(

                    (
                        total,
                        item,
                    ) =>
                        total +
                        item.totalValue,

                    0,

                ),



            weightedValue:

                pipeline.reduce(

                    (
                        total,
                        item,
                    ) =>

                        total +

                        item.opportunities.reduce(

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

                ),

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