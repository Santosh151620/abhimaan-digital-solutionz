import type { Opportunity } from '@/types/crm/Opportunities';

const opportunities: Opportunity[] = [];

export class OpportunitiesRepository {

    async list(): Promise<Opportunity[]> {
        return opportunities.filter(
            opportunity => !opportunity.isDeleted
        );
    }

    async listArchived(): Promise<Opportunity[]> {
        return opportunities.filter(
            opportunity => opportunity.isDeleted
        );
    }

    async findById(
        id: string
    ): Promise<Opportunity | null> {

        return (
            opportunities.find(
                opportunity => opportunity.id === id
            ) ?? null
        );

    }

    async create(
        data: Partial<Opportunity>
    ): Promise<Opportunity> {

        const opportunity: Opportunity = {

            id: Date.now().toString(),

            companyId: data.companyId ?? '',

            title: data.title ?? '',
            description: data.description,

            value: data.value ?? 0,
            probability: data.probability ?? 0,

            stage: data.stage ?? 'LEAD',

            expectedCloseDate: data.expectedCloseDate,
            owner: data.owner,

            isDeleted: false,
            deletedAt: null,
            deletedBy: null,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        opportunities.push(opportunity);

        return opportunity;

    }

    async update(
        id: string,
        data: Partial<Opportunity>
    ): Promise<Opportunity | null> {

        const opportunity =
            opportunities.find(
                item => item.id === id
            );

        if (!opportunity) {
            return null;
        }

        Object.assign(opportunity, data);

        opportunity.updatedAt =
            new Date().toISOString();

        return opportunity;

    }

    async delete(
        id: string,
        deletedBy = 'system'
    ): Promise<boolean> {

        const opportunity =
            opportunities.find(
                item => item.id === id
            );

        if (!opportunity) {
            return false;
        }

        opportunity.isDeleted = true;
        opportunity.deletedAt =
            new Date().toISOString();
        opportunity.deletedBy = deletedBy;

        return true;

    }

    async restore(
        id: string
    ): Promise<boolean> {

        const opportunity =
            opportunities.find(
                item => item.id === id
            );

        if (!opportunity) {
            return false;
        }

        opportunity.isDeleted = false;
        opportunity.deletedAt = null;
        opportunity.deletedBy = null;

        opportunity.updatedAt =
            new Date().toISOString();

        return true;

    }

}

export const OpportunitiesRepositoryInstance =
    new OpportunitiesRepository();