import {
    createClient,
} from '@/lib/supabase/server';

import {
    createOpportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';

import type {
    CreateOpportunityInput,
    Opportunity,
    OpportunitySearchFilters,
    OpportunitySummary,
    UpdateOpportunityInput,
} from '@/types/crm/Opportunities';


export class OpportunitiesService {


    private async repository() {

        const supabase =
            await createClient();

        return createOpportunitiesRepository(
            supabase,
        );

    }


    async list(): Promise<Opportunity[]> {

        const repository =
            await this.repository();

        return repository.list();

    }


    async details(
        id: string,
    ): Promise<Opportunity | null> {

        const repository =
            await this.repository();

        return repository.details(
            id,
        );

    }


    async create(
        values: CreateOpportunityInput,
    ): Promise<Opportunity> {

        const repository =
            await this.repository();


        const name =
            (
                values.name ??
                values.title
            )
                ?.trim();


        if (!name) {

            throw new Error(
                'Opportunity name is required.',
            );

        }


        const value =
            Number(
                values.value ??
                0,
            );


        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            throw new Error(
                'Opportunity value must be zero or greater.',
            );

        }


        const probability =
            Number(
                values.probability ??
                0,
            );


        if (
            !Number.isFinite(probability) ||
            probability < 0 ||
            probability > 100
        ) {

            throw new Error(
                'Opportunity probability must be between 0 and 100.',
            );

        }


        return repository.create({

            ...values,

            name,

            title:
                values.title?.trim()
                ||
                name,

            value,

            probability,

        });

    }


    async update(
        id: string,
        values: UpdateOpportunityInput,
    ): Promise<Opportunity> {

        const repository =
            await this.repository();


        if (!id?.trim()) {

            throw new Error(
                'Opportunity id is required.',
            );

        }


        if (
            values.name !== undefined ||
            values.title !== undefined
        ) {

            const name =
                (
                    values.name ??
                    values.title
                )
                    ?.trim();


            if (!name) {

                throw new Error(
                    'Opportunity name cannot be empty.',
                );

            }

        }


        if (
            values.value !== undefined
        ) {

            const value =
                Number(
                    values.value,
                );


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                throw new Error(
                    'Opportunity value must be zero or greater.',
                );

            }

        }


        if (
            values.probability !== undefined
        ) {

            const probability =
                Number(
                    values.probability,
                );


            if (
                !Number.isFinite(probability) ||
                probability < 0 ||
                probability > 100
            ) {

                throw new Error(
                    'Opportunity probability must be between 0 and 100.',
                );

            }

        }


        return repository.update(

            id,

            values,

        );

    }


    async delete(
        id: string,
    ): Promise<void> {

        if (!id?.trim()) {

            throw new Error(
                'Opportunity id is required.',
            );

        }


        const repository =
            await this.repository();


        await repository.delete(
            id,
        );

    }


    async search(
        filters?: OpportunitySearchFilters,
    ): Promise<Opportunity[]> {

        const repository =
            await this.repository();


        const normalizedFilters:
            OpportunitySearchFilters =
            {

                ...filters,

                search:
                    filters?.search?.trim()
                    ||
                    undefined,

                keyword:
                    filters?.keyword?.trim()
                    ||
                    undefined,

                companyId:
                    filters?.companyId?.trim()
                    ||
                    undefined,

                contactId:
                    filters?.contactId?.trim()
                    ||
                    undefined,

                leadId:
                    filters?.leadId?.trim()
                    ||
                    undefined,

                ownerId:
                    filters?.ownerId?.trim()
                    ||
                    undefined,

                assignedTo:
                    filters?.assignedTo?.trim()
                    ||
                    undefined,

            };


        return repository.search(
            normalizedFilters,
        );

    }


    async summary(): Promise<OpportunitySummary> {

        const repository =
            await this.repository();

        return repository.summary();

    }

}


export const opportunitiesService =
    new OpportunitiesService();


export const OpportunitiesServiceInstance =
    opportunitiesService;