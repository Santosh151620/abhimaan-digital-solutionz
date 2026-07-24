import type {
    Opportunity,
    OpportunitySummary,
} from '@/types/crm/Opportunities';



class OpportunitiesRepository {


    private opportunities =
        new Map<string, Opportunity>();



    async list(): Promise<Opportunity[]> {

        return [
            ...this.opportunities.values(),
        ];

    }



    async findById(
        id: string,
    ): Promise<Opportunity | null> {

        return (
            this.opportunities.get(id)
            ?? null
        );

    }



    async details(
        id: string,
    ): Promise<Opportunity | null> {

        return this.findById(id);

    }



    async create(
        data: Opportunity,
    ): Promise<Opportunity> {

        const opportunity: Opportunity = {

            ...data,

            title:
                data.title ||
                data.name,

            owner:
                data.owner ??
                data.ownerId,

            createdAt:
                data.createdAt ||
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

        };


        this.opportunities.set(
            opportunity.id,
            opportunity,
        );


        return opportunity;

    }



    async update(
        id: string,
        data: Partial<Opportunity>,
    ): Promise<Opportunity | null> {

        const existing =
            this.opportunities.get(id);


        if (!existing) {

            return null;

        }


        const updated: Opportunity = {

            ...existing,

            ...data,

            id,

            title:
                data.title ??
                data.name ??
                existing.title,

            owner:
                data.owner ??
                data.ownerId ??
                existing.owner,

            updatedAt:
                new Date().toISOString(),

        };


        this.opportunities.set(
            id,
            updated,
        );


        return updated;

    }



    async delete(
        id: string,
    ): Promise<boolean> {

        return this.opportunities.delete(id);

    }



    async summary(): Promise<OpportunitySummary> {


        const items =
            [
                ...this.opportunities.values(),
            ];


        const totalValue =
            items.reduce(
                (
                    sum,
                    item,
                ) =>
                    sum +
                    item.value,
                0,
            );


        return {

            total:
                items.length,

            open:
                items.filter(
                    item =>
                        item.status ===
                        'Open',
                ).length,

            won:
                items.filter(
                    item =>
                        item.status ===
                        'Won',
                ).length,

            lost:
                items.filter(
                    item =>
                        item.status ===
                        'Lost',
                ).length,

            pipelineValue:
                totalValue,

            weightedValue:
                items.reduce(
                    (
                        sum,
                        item,
                    ) =>
                        sum +
                        (
                            item.value *
                            item.probability /
                            100
                        ),
                    0,
                ),

            totalValue,

        };

    }


}



export const opportunitiesRepository =
    new OpportunitiesRepository();



export const OpportunitiesRepositoryInstance =
    opportunitiesRepository;
