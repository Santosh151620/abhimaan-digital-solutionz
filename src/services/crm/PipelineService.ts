import {
    createClient,
} from '@/lib/supabase/server';


import {
    createPipelineRepository,
} from '@/repositories/crm/PipelineRepository';


import type {
    Opportunity,
    OpportunityStage,
    OpportunitySummary,
} from '@/types/crm/Opportunities';


import type {
        PipelineSummary,
} from '@/types/crm/Pipeline';





class PipelineService {



    private async repository() {


        const supabase =
            await createClient();



        return createPipelineRepository(
            supabase,
        );

    }







    async list() {


        const repository =
            await this.repository();


        return repository.getPipeline();

    }






    async getPipeline() {


        return this.list();

    }






    async getStages() {


        const repository =
            await this.repository();



        return repository.getStages();

    }







    async summary(): Promise<PipelineSummary> {


        const repository =
            await this.repository();



        return repository.summary();

    }







    async moveOpportunity(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity> {



        const supabase =
            await createClient();



        let status:
            | 'Open'
            | 'Won'
            | 'Lost'
            | 'On Hold';



        switch(stage) {


            case 'Won':

                status =
                    'Won';

                break;



            case 'Lost':

                status =
                    'Lost';

                break;



            default:

                status =
                    'Open';

        }



        const {
            data,
            error,
        } =
            await supabase
                .from('opportunities')
                .update({

                    stage,

                    status,

                    updated_at:
                        new Date()
                            .toISOString(),

                })
                .eq(
                    'id',
                    id,
                )
                .select()
                .single();




        if(error) {

            throw error;

        }



        return data as Opportunity;

    }







    async opportunitySummary(): Promise<OpportunitySummary> {


        const supabase =
            await createClient();



        const repository =
            createPipelineRepository(
                supabase,
            );



        const pipeline =
            await repository.summary();



        return {

            total:
                pipeline.totalOpportunities,


            open:
                pipeline.totalOpportunities,


            won:
                0,


            lost:
                0,


            pipelineValue:
                pipeline.totalValue,


            weightedValue:
                pipeline.weightedValue,


            totalValue:
                pipeline.totalValue,

        };

    }




}




const pipelineService =
    new PipelineService();




/**
 * Backward compatibility alias.
 */
export const PipelineServiceInstance =
    pipelineService;