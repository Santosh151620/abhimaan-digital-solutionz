import type {
    Opportunity,
    OpportunityDetails,
} from "@/types/crm/Opportunities";

const opportunities: OpportunityDetails[] = [];

export class OpportunitiesRepository {

    async list() {
        return opportunities.filter(
            x => !x.isDeleted
        );
    }

    async listArchived() {
        return opportunities.filter(
            x => x.isDeleted
        );
    }

    async findById(id: string) {

        return (
            opportunities.find(
                x => x.id === id
            ) ?? null
        );

    }

    async create(
        data: Partial<OpportunityDetails>,
    ) {

        const item: OpportunityDetails = {

            id: Date.now().toString(),

            title: data.title ?? "",

            description:
                data.description,

            companyId:
                data.companyId,

            contactId:
                data.contactId,

            companyName:
                data.companyName,

            contactName:
                data.contactName,

            value:
                data.value ?? 0,

            probability:
                data.probability ?? 0,

            stage:
                data.stage ?? "LEAD",

            expectedCloseDate:
                data.expectedCloseDate,

            owner:
                data.owner,

            isDeleted: false,

            deletedAt: null,

            deletedBy: null,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

        };

        opportunities.push(item);

        return item;

    }

    async update(
        id: string,
        data: Partial<OpportunityDetails>,
    ) {

        const item =
            opportunities.find(
                x => x.id === id
            );

        if (!item) {
            return null;
        }

        Object.assign(item, data);

        item.updatedAt =
            new Date().toISOString();

        return item;

    }

    async delete(id: string) {

        const item =
            opportunities.find(
                x => x.id === id
            );

        if (!item) {
            return false;
        }

        item.isDeleted = true;

        item.deletedAt =
            new Date().toISOString();

        return true;

    }

    async restore(id: string) {

        const item =
            opportunities.find(
                x => x.id === id
            );

        if (!item) {
            return false;
        }

        item.isDeleted = false;

        item.deletedAt = null;

        item.deletedBy = null;

        item.updatedAt =
            new Date().toISOString();

        return true;

    }

}

export const OpportunitiesRepositoryInstance =
    new OpportunitiesRepository();