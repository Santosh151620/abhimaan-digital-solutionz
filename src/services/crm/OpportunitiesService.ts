import type { SupabaseClient } from "@supabase/supabase-js";

import {
    createOpportunitiesRepository,
    type OpportunitiesRepository,
} from "@/repositories/crm/OpportunitiesRepository";

import { createClient } from "@/lib/supabase/server";

import type {
    Opportunity,
    OpportunitySearchFilters,
    OpportunitySummary,
    CreateOpportunityInput,
    UpdateOpportunityInput,
    OpportunityStage,
    OpportunityStatus,
} from "@/types/crm/Opportunities";


/**
 * CRM Opportunities Service
 *
 * Production service layer for the Opportunities module.
 *
 * Responsibilities:
 * - Coordinate repository operations
 * - Validate business-level inputs
 * - Preserve entity-driven CRM architecture
 * - Keep API/UI layers independent from persistence
 * - Preserve tenant isolation through the repository
 *
 * IMPORTANT:
 * The service itself is request-scoped.
 * Do not create a global Supabase client or global repository instance.
 */
class OpportunitiesService {

    private readonly repository: OpportunitiesRepository;


    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createOpportunitiesRepository(
                supabase,
            );

    }


    /**
     * List active opportunities.
     */
    async list(): Promise<Opportunity[]> {

        return this.repository.list();

    }


    /**
     * List archived opportunities.
     */
    async listArchived(): Promise<Opportunity[]> {

        return this.repository.listArchived();

    }


    /**
     * Find opportunity by id.
     */
    async findById(
        id: string,
    ): Promise<Opportunity | null> {

        return this.repository.findById(
            id,
        );

    }


    /**
     * Opportunity details.
     */
    async details(
        id: string,
    ): Promise<Opportunity | null> {

        return this.repository.details(
            id,
        );

    }


    /**
     * Create opportunity.
     */
    async create(
        input: CreateOpportunityInput,
    ): Promise<Opportunity> {

        if (!input) {

            throw new Error(
                "Opportunity input is required.",
            );

        }


        const name =
            input.name?.trim()
            ||
            input.title?.trim();


        if (!name) {

            throw new Error(
                "Opportunity name is required.",
            );

        }


        if (
            input.value !== undefined
            &&
            (
                !Number.isFinite(
                    input.value,
                )
                ||
                input.value < 0
            )
        ) {

            throw new Error(
                "Opportunity value must be a non-negative number.",
            );

        }


        if (
            input.probability !== undefined
            &&
            (
                !Number.isFinite(
                    input.probability,
                )
                ||
                input.probability < 0
                ||
                input.probability > 100
            )
        ) {

            throw new Error(
                "Opportunity probability must be between 0 and 100.",
            );

        }


        return this.repository.create(
            {
                ...input,
                name,
            },
        );

    }


    /**
     * Update opportunity.
     */
    async update(
        id: string,
        input: UpdateOpportunityInput,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        if (!input) {

            throw new Error(
                "Opportunity update data is required.",
            );

        }


        if (
            input.value !== undefined
            &&
            (
                !Number.isFinite(
                    input.value,
                )
                ||
                input.value < 0
            )
        ) {

            throw new Error(
                "Opportunity value must be a non-negative number.",
            );

        }


        if (
            input.probability !== undefined
            &&
            (
                !Number.isFinite(
                    input.probability,
                )
                ||
                input.probability < 0
                ||
                input.probability > 100
            )
        ) {

            throw new Error(
                "Opportunity probability must be between 0 and 100.",
            );

        }


        return this.repository.update(
            id,
            input,
        );

    }


    /**
     * Update opportunity stage.
     */
    async updateStage(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        if (!stage) {

            throw new Error(
                "Opportunity stage is required.",
            );

        }


        return this.repository.update(
            id,
            {
                stage,
            },
        );

    }


    /**
     * Update opportunity status.
     */
    async updateStatus(
        id: string,
        status: OpportunityStatus,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        if (!status) {

            throw new Error(
                "Opportunity status is required.",
            );

        }


        return this.repository.update(
            id,
            {
                status,
            },
        );

    }


    /**
     * Mark opportunity as won.
     */
    async markWon(
        id: string,
        reasonWon?: string,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        return this.repository.update(
            id,
            {
                stage: "Won",
                status: "Won",
                ...(reasonWon?.trim()
                    ? {
                        reasonWon:
                            reasonWon.trim(),
                    }
                    : {}),
            },
        );

    }


    /**
     * Mark opportunity as lost.
     */
    async markLost(
        id: string,
        reasonLost?: string,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        return this.repository.update(
            id,
            {
                stage: "Lost",
                status: "Lost",
                ...(reasonLost?.trim()
                    ? {
                        reasonLost:
                            reasonLost.trim(),
                    }
                    : {}),
            },
        );

    }


    /**
     * Put opportunity on hold.
     */
    async putOnHold(
        id: string,
    ): Promise<Opportunity> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        return this.repository.update(
            id,
            {
                status: "On Hold",
            },
        );

    }


    /**
     * Soft delete opportunity.
     */
    async delete(
        id: string,
    ): Promise<void> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        await this.repository.delete(
            id,
        );

    }


    /**
     * Restore opportunity.
     */
    async restore(
        id: string,
    ): Promise<boolean> {

        if (!id?.trim()) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        return this.repository.restore(
            id,
        );

    }


    /**
     * Search opportunities.
     */
    async search(
        filters?: OpportunitySearchFilters,
    ): Promise<Opportunity[]> {

        return this.repository.search(
            filters,
        );

    }


    /**
     * Dashboard summary.
     */
    async summary(): Promise<OpportunitySummary> {

        return this.repository.summary();

    }


    /**
     * Find opportunities related to an entity.
     */
    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Opportunity[]> {

        if (!entityType?.trim()) {

            throw new Error(
                "Entity type is required.",
            );

        }


        if (!entityId?.trim()) {

            throw new Error(
                "Entity id is required.",
            );

        }


        return this.repository.findByEntity(
            entityType.trim(),
            entityId.trim(),
        );

    }

}


/**
 * Production service factory.
 *
 * This factory intentionally accepts a resolved SupabaseClient.
 *
 * Correct usage:
 *
 * const supabase = await createClient();
 * const service = createOpportunitiesService(supabase);
 *
 * This prevents Promise<SupabaseClient> from being incorrectly passed
 * into the repository layer.
 */
function createOpportunitiesService(
    supabase: SupabaseClient,
): OpportunitiesService {

    return new OpportunitiesService(
        supabase,
    );

}


/**
 * Request-scoped compatibility service contract.
 *
 * Existing CRM consumers use:
 *
 * opportunitiesService.list()
 * opportunitiesService.create()
 * opportunitiesService.update()
 *
 * and:
 *
 * OpportunitiesServiceInstance.details()
 *
 * These are deliberately preserved while ensuring that every call
 * receives a fresh authenticated/server Supabase client.
 */
export interface OpportunitiesServiceFacade {

    list(): Promise<Opportunity[]>;

    listArchived(): Promise<Opportunity[]>;

    findById(
        id: string,
    ): Promise<Opportunity | null>;

    details(
        id: string,
    ): Promise<Opportunity | null>;

    create(
        input: CreateOpportunityInput,
    ): Promise<Opportunity>;

    update(
        id: string,
        input: UpdateOpportunityInput,
    ): Promise<Opportunity>;

    updateStage(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity>;

    updateStatus(
        id: string,
        status: OpportunityStatus,
    ): Promise<Opportunity>;

    markWon(
        id: string,
        reasonWon?: string,
    ): Promise<Opportunity>;

    markLost(
        id: string,
        reasonLost?: string,
    ): Promise<Opportunity>;

    putOnHold(
        id: string,
    ): Promise<Opportunity>;

    delete(
        id: string,
    ): Promise<void>;

    restore(
        id: string,
    ): Promise<boolean>;

    search(
        filters?: OpportunitySearchFilters,
    ): Promise<Opportunity[]>;

    summary(): Promise<OpportunitySummary>;

    findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Opportunity[]>;

}


/**
 * Resolve a request-scoped OpportunitiesService.
 *
 * The server Supabase client is asynchronous because it restores
 * the authenticated request/session context.
 */
async function getOpportunitiesService():
    Promise<OpportunitiesService> {

    const supabase =
        await createClient();


    return createOpportunitiesService(
        supabase,
    );

}


/**
 * Compatibility facade.
 *
 * IMPORTANT:
 * This is an object containing service methods.
 * It is NOT the factory function.
 *
 * Therefore existing code such as:
 *
 * await opportunitiesService.list()
 *
 * remains valid.
 */
export const opportunitiesService:
    OpportunitiesServiceFacade = {

    async list() {

        const service =
            await getOpportunitiesService();

        return service.list();

    },


    async listArchived() {

        const service =
            await getOpportunitiesService();

        return service.listArchived();

    },


    async findById(
        id: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.findById(
            id,
        );

    },


    async details(
        id: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.details(
            id,
        );

    },


    async create(
        input: CreateOpportunityInput,
    ) {

        const service =
            await getOpportunitiesService();

        return service.create(
            input,
        );

    },


    async update(
        id: string,
        input: UpdateOpportunityInput,
    ) {

        const service =
            await getOpportunitiesService();

        return service.update(
            id,
            input,
        );

    },


    async updateStage(
        id: string,
        stage: OpportunityStage,
    ) {

        const service =
            await getOpportunitiesService();

        return service.updateStage(
            id,
            stage,
        );

    },


    async updateStatus(
        id: string,
        status: OpportunityStatus,
    ) {

        const service =
            await getOpportunitiesService();

        return service.updateStatus(
            id,
            status,
        );

    },


    async markWon(
        id: string,
        reasonWon?: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.markWon(
            id,
            reasonWon,
        );

    },


    async markLost(
        id: string,
        reasonLost?: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.markLost(
            id,
            reasonLost,
        );

    },


    async putOnHold(
        id: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.putOnHold(
            id,
        );

    },


    async delete(
        id: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.delete(
            id,
        );

    },


    async restore(
        id: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.restore(
            id,
        );

    },


    async search(
        filters?: OpportunitySearchFilters,
    ) {

        const service =
            await getOpportunitiesService();

        return service.search(
            filters,
        );

    },


    async summary() {

        const service =
            await getOpportunitiesService();

        return service.summary();

    },


    async findByEntity(
        entityType: string,
        entityId: string,
    ) {

        const service =
            await getOpportunitiesService();

        return service.findByEntity(
            entityType,
            entityId,
        );

    },

};


/**
 * Backward-compatible export.
 *
 * Existing routes/pages import:
 *
 * OpportunitiesServiceInstance
 *
 * Keep it as the service facade, NOT as the factory.
 */
export const OpportunitiesServiceInstance:
    OpportunitiesServiceFacade =
    opportunitiesService;