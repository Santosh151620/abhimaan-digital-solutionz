import type {
    Opportunity,
} from '@/types/crm/Opportunities';


class OpportunitiesRepository {


    private opportunities =
        new Map<string, Opportunity>();



    async list(): Promise<Opportunity[]> {

        return Array.from(
            this.opportunities.values()
        )
        .filter(
            opportunity =>
                !opportunity.isDeleted
        );

    }




    async listArchived(): Promise<Opportunity[]> {

        return Array.from(
            this.opportunities.values()
        )
        .filter(
            opportunity =>
                opportunity.isDeleted
        );

    }




    async findById(
        id: string
    ): Promise<Opportunity | null> {

        return (
            this.opportunities.get(id)
            ??
            null
        );

    }




    async details(
        id: string
    ): Promise<Opportunity | null> {

        return this.findById(id);

    }




    async search(
        filters?: {

            stage?: Opportunity['stage'];

            companyId?: string;

            search?: string;

        }
    ): Promise<Opportunity[]> {


        let opportunities =
            await this.list();




        if (
            filters?.stage
        ) {

            opportunities =
                opportunities.filter(

                    opportunity =>

                        opportunity.stage ===
                        filters.stage

                );

        }





        if (
            filters?.companyId
        ) {

            opportunities =
                opportunities.filter(

                    opportunity =>

                        opportunity.companyId ===
                        filters.companyId

                );

        }





        if (
            filters?.search
        ) {

            const keyword =
                filters.search.toLowerCase();



            opportunities =
                opportunities.filter(

                    opportunity =>


                        opportunity.title
                            .toLowerCase()
                            .includes(keyword)


                        ||

                        opportunity.description
                            ?.toLowerCase()
                            .includes(keyword)

                );

        }



        return opportunities;

    }





    async create(
        data: Partial<Opportunity>
    ): Promise<Opportunity> {


        const now =
            new Date().toISOString();



        const opportunity: Opportunity = {


            id:
                crypto.randomUUID(),



            companyId:
                data.companyId
                ??
                '',



            title:
                data.title
                ??
                '',



            description:
                data.description,



            value:
                data.value
                ??
                0,



            probability:
                data.probability
                ??
                0,



            stage:
                data.stage
                ??
                'LEAD',



            expectedCloseDate:
                data.expectedCloseDate,



            owner:
                data.owner,



            isDeleted:
                false,



            deletedAt:
                null,



            deletedBy:
                null,



            createdAt:
                now,



            updatedAt:
                now,


        };



        this.opportunities.set(

            opportunity.id,

            opportunity

        );



        return opportunity;


    }





    async update(
        id: string,
        data: Partial<Opportunity>
    ): Promise<Opportunity | null> {


        const existing =
            this.opportunities.get(id);



        if (!existing) {

            return null;

        }




        const updated: Opportunity = {


            ...existing,


            ...data,



            updatedAt:
                new Date().toISOString(),


        };



        this.opportunities.set(

            id,

            updated

        );



        return updated;


    }





    async delete(
        id: string,
        deletedBy = 'system'
    ): Promise<boolean> {


        const opportunity =
            this.opportunities.get(id);



        if (!opportunity) {

            return false;

        }




        opportunity.isDeleted =
            true;



        opportunity.deletedAt =
            new Date().toISOString();



        opportunity.deletedBy =
            deletedBy;



        opportunity.updatedAt =
            new Date().toISOString();



        this.opportunities.set(

            id,

            opportunity

        );



        return true;


    }





    async restore(
        id: string
    ): Promise<boolean> {


        const opportunity =
            this.opportunities.get(id);



        if (!opportunity) {

            return false;

        }




        opportunity.isDeleted =
            false;



        opportunity.deletedAt =
            null;



        opportunity.deletedBy =
            null;



        opportunity.updatedAt =
            new Date().toISOString();



        this.opportunities.set(

            id,

            opportunity

        );



        return true;


    }





    async summary() {


        const opportunities =
            await this.list();



        return {


            total:
                opportunities.length,



            pipelineValue:
                opportunities.reduce(

                    (
                        total,
                        opportunity
                    ) =>
                        total +
                        opportunity.value,

                    0

                ),



            won:
                opportunities.filter(

                    opportunity =>
                        opportunity.stage ===
                        'WON'

                ).length,



            lost:
                opportunities.filter(

                    opportunity =>
                        opportunity.stage ===
                        'LOST'

                ).length,


        };


    }


}



export const OpportunitiesRepositoryInstance =
    new OpportunitiesRepository();