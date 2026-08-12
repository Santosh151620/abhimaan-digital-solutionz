import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    Opportunity,
    OpportunityStage,
    OpportunityStatus,
    OpportunitySearchFilters,
    OpportunitySummary,
    CreateOpportunityInput,
    UpdateOpportunityInput,
} from "@/types/crm/Opportunities";


/**
 * Database representation of the opportunities table.
 *
 * Kept separate from the domain Opportunity contract.
 */
type OpportunityRow = {

    id: string;

    organization_id: string | null;

    entity_type: string | null;

    entity_id: string | null;

    opportunity_number: string | null;

    name: string | null;

    title: string | null;

    description: string | null;

    company_id: string | null;

    contact_id: string | null;

    lead_id: string | null;

    owner_id: string | null;

    owner: string | null;

    assigned_to: string | null;

    stage: string | null;

    status: string | null;

    value: number | null;

    probability: number | null;

    expected_close_date: string | null;

    forecast_revenue: number | null;

    recurring_revenue: number | null;

    currency: string | null;

    source: string | null;

    competitor: string | null;

    reason_won: string | null;

    reason_lost: string | null;

    notes: string | null;

    metadata: Record<string, unknown> | null;

    archived: boolean | null;

    is_deleted: boolean | null;

    deleted_at: string | null;

    created_at: string;

    updated_at: string;

};


/**
 * Production Opportunities Repository.
 *
 * Responsibilities:
 * - Tenant-safe CRUD
 * - Soft deletion
 * - Restore
 * - Search/filtering
 * - Opportunity summary
 * - Entity-driven relationships
 */
export class OpportunitiesRepository
    extends BaseRepository<Opportunity> {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "opportunities",
        );
    }


    /**
     * List active opportunities.
     */
    async list(): Promise<Opportunity[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "is_deleted",
                    false,
                )
                .neq(
                    "status",
                    "ARCHIVED",
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

        return (data ?? [])
            .map(
                row =>
                    this.mapOpportunity(
                        row as OpportunityRow,
                    ),
            );
    }


    /**
     * List archived/deleted opportunities.
     */
    async listArchived(): Promise<Opportunity[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .or(
                    "is_deleted.eq.true,archived.eq.true,status.eq.ARCHIVED",
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

        return (data ?? [])
            .map(
                row =>
                    this.mapOpportunity(
                        row as OpportunityRow,
                    ),
            );
    }


    /**
     * Find one opportunity.
     */
    async findById(
        id: string,
    ): Promise<Opportunity | null> {

        const normalizedId =
            this.requireId(
                id,
                "Opportunity id",
            );

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? this.mapOpportunity(
                data as OpportunityRow,
            )
            : null;
    }


    /**
     * Opportunity details.
     */
    async details(
        id: string,
    ): Promise<Opportunity | null> {

        return this.findById(id);
    }


    /**
     * Create opportunity.
     */
    async create(
        data: Partial<Opportunity>,
    ): Promise<Opportunity> {

        if (!data) {
            throw new Error(
                "Opportunity data is required.",
            );
        }

        const name =
            data.name?.trim()
            ||
            data.title?.trim();

        if (!name) {
            throw new Error(
                "Opportunity name is required.",
            );
        }

        const id =
            data.id?.trim()
            ||
            crypto.randomUUID();

        const now =
            new Date()
                .toISOString();

        const input =
            data as CreateOpportunityInput;

        const opportunityNumber =
            input.opportunityNumber?.trim()
            ||
            this.generateOpportunityNumber();

        const stage =
            input.stage
            ??
            "New";

        const status =
            input.status
            ??
            "Open";

        const value =
            typeof input.value === "number"
                ? input.value
                : 0;

        const probability =
            typeof input.probability === "number"
                ? this.normalizeProbability(
                    input.probability,
                )
                : 0;

        const payload = {

            id,

            entity_type:
                "Opportunity",

            entity_id:
                id,

            opportunity_number:
                opportunityNumber,

            name,

            title:
                input.title?.trim()
                ||
                name,

            description:
                this.normalizeOptional(
                    input.description,
                ),

            company_id:
                input.companyId
                ??
                null,

            contact_id:
                input.contactId
                ??
                null,

            lead_id:
                input.leadId
                ??
                null,

            owner_id:
                input.ownerId
                ??
                null,

            assigned_to:
                input.assignedTo
                ??
                null,

            stage,

            status,

            value,

            probability,

            expected_close_date:
                input.expectedCloseDate
                ??
                null,

            forecast_revenue:
                input.forecastRevenue
                ??
                value * probability / 100,

            recurring_revenue:
                input.recurringRevenue
                ??
                null,

            currency:
                this.normalizeOptional(
                    input.currency,
                )
                ??
                "INR",

            source:
                this.normalizeOptional(
                    input.source,
                ),

            competitor:
                this.normalizeOptional(
                    input.competitor,
                ),

            reason_won:
                null,

            reason_lost:
                null,

            notes:
                this.normalizeOptional(
                    input.notes,
                ),

            metadata:
                input.metadata
                ??
                {},

            archived:
                false,

            is_deleted:
                false,

            deleted_at:
                null,

            created_at:
                now,

            updated_at:
                now,
        };

        const {
            data: created,
            error,
        } =
            await this.tableRef()
                .insert(
                    this.withCreateTenant(
                        payload,
                    ),
                )
                .select("*")
                .single();

        if (error) {
            throw error;
        }

        return this.mapOpportunity(
            created as OpportunityRow,
        );
    }


    /**
     * Update opportunity.
     */
    async update(
        id: string,
        data: UpdateOpportunityInput,
    ): Promise<Opportunity> {

        const normalizedId =
            this.requireId(
                id,
                "Opportunity id",
            );

        if (!data) {
            throw new Error(
                "Opportunity update data is required.",
            );
        }

        const payload: Record<
            string,
            unknown
        > = {

            updated_at:
                new Date()
                    .toISOString(),

        };

        if (
            data.opportunityNumber !== undefined
        ) {
            payload.opportunity_number =
                this.normalizeOptional(
                    data.opportunityNumber,
                );
        }

        if (
            data.name !== undefined
        ) {
            const value =
                data.name.trim();

            if (!value) {
                throw new Error(
                    "Opportunity name cannot be empty.",
                );
            }

            payload.name =
                value;

            if (
                data.title === undefined
            ) {
                payload.title =
                    value;
            }
        }

        if (
            data.title !== undefined
        ) {
            payload.title =
                this.normalizeOptional(
                    data.title,
                );
        }

        if (
            data.description !== undefined
        ) {
            payload.description =
                this.normalizeOptional(
                    data.description,
                );
        }

        if (
            data.companyId !== undefined
        ) {
            payload.company_id =
                data.companyId
                ??
                null;
        }

        if (
            data.contactId !== undefined
        ) {
            payload.contact_id =
                data.contactId
                ??
                null;
        }

        if (
            data.leadId !== undefined
        ) {
            payload.lead_id =
                data.leadId
                ??
                null;
        }

        if (
            data.ownerId !== undefined
        ) {
            payload.owner_id =
                data.ownerId
                ??
                null;
        }

        if (
            data.assignedTo !== undefined
        ) {
            payload.assigned_to =
                data.assignedTo
                ??
                null;
        }

        if (
            data.stage !== undefined
        ) {
            payload.stage =
                data.stage;
        }

        if (
            data.status !== undefined
        ) {
            payload.status =
                data.status;
        }

        if (
            data.value !== undefined
        ) {
            payload.value =
                data.value;
        }

        if (
            data.probability !== undefined
        ) {
            payload.probability =
                this.normalizeProbability(
                    data.probability,
                );
        }

        if (
            data.expectedCloseDate !== undefined
        ) {
            payload.expected_close_date =
                data.expectedCloseDate
                ??
                null;
        }

        if (
            data.forecastRevenue !== undefined
        ) {
            payload.forecast_revenue =
                data.forecastRevenue
                ??
                null;
        }

        if (
            data.recurringRevenue !== undefined
        ) {
            payload.recurring_revenue =
                data.recurringRevenue
                ??
                null;
        }

        if (
            data.currency !== undefined
        ) {
            payload.currency =
                this.normalizeOptional(
                    data.currency,
                );
        }

        if (
            data.source !== undefined
        ) {
            payload.source =
                this.normalizeOptional(
                    data.source,
                );
        }

        if (
            data.competitor !== undefined
        ) {
            payload.competitor =
                this.normalizeOptional(
                    data.competitor,
                );
        }

        if (
            data.notes !== undefined
        ) {
            payload.notes =
                this.normalizeOptional(
                    data.notes,
                );
        }

        if (
            data.metadata !== undefined
        ) {
            payload.metadata =
                data.metadata;
        }

        const {
            data: updated,
            error,
        } =
            await this.tableRef()
                .update(
                    payload,
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .select("*")
                .single();

        if (error) {
            throw error;
        }

        return this.mapOpportunity(
            updated as OpportunityRow,
        );
    }


    /**
     * Soft delete.
     */
    async delete(
        id: string,
    ): Promise<void> {

        await this.update(
            id,
            {
                status:
                    "Lost",
            },
        );

        const {
            error,
        } =
            await this.tableRef()
                .update({
                    is_deleted:
                        true,

                    archived:
                        true,

                    deleted_at:
                        new Date()
                            .toISOString(),

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
                    this.requireId(
                        id,
                        "Opportunity id",
                    ),
                );

        if (error) {
            throw error;
        }
    }


    /**
     * Restore opportunity.
     */
    async restore(
        id: string,
    ): Promise<boolean> {

        const normalizedId =
            this.requireId(
                id,
                "Opportunity id",
            );

        const existing =
            await this.findById(
                normalizedId,
            );

        if (!existing) {
            return false;
        }

        const {
            error,
        } =
            await this.tableRef()
                .update({
                    is_deleted:
                        false,

                    archived:
                        false,

                    deleted_at:
                        null,

                    status:
                        "Open",

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
                );

        if (error) {
            throw error;
        }

        return true;
    }


    /**
     * Search opportunities.
     */
    async search(
        filters?: OpportunitySearchFilters,
    ): Promise<Opportunity[]> {

        let query =
            this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                );

        if (
            !filters?.includeArchived
        ) {
            query =
                query
                    .eq(
                        "is_deleted",
                        false,
                    )
                    .neq(
                        "status",
                        "ARCHIVED",
                    )
                    .neq(
                        "archived",
                        true,
                    );
        }

        if (
            filters?.stage
        ) {
            query =
                query.eq(
                    "stage",
                    filters.stage,
                );
        }

        if (
            filters?.status
        ) {
            query =
                query.eq(
                    "status",
                    filters.status,
                );
        }

        if (
            filters?.companyId
        ) {
            query =
                query.eq(
                    "company_id",
                    filters.companyId,
                );
        }

        if (
            filters?.contactId
        ) {
            query =
                query.eq(
                    "contact_id",
                    filters.contactId,
                );
        }

        if (
            filters?.leadId
        ) {
            query =
                query.eq(
                    "lead_id",
                    filters.leadId,
                );
        }

        if (
            filters?.ownerId
        ) {
            query =
                query.eq(
                    "owner_id",
                    filters.ownerId,
                );
        }

        if (
            filters?.assignedTo
        ) {
            query =
                query.eq(
                    "assigned_to",
                    filters.assignedTo,
                );
        }

        const keyword =
            (
                filters?.search
                ??
                filters?.keyword
            )?.trim();

        if (keyword) {

            const escaped =
                this.escapeIlike(
                    keyword,
                );

            query =
                query.or(
                    [
                        `opportunity_number.ilike.%${escaped}%`,
                        `name.ilike.%${escaped}%`,
                        `title.ilike.%${escaped}%`,
                        `description.ilike.%${escaped}%`,
                        `source.ilike.%${escaped}%`,
                        `competitor.ilike.%${escaped}%`,
                    ].join(","),
                );
        }

        const {
            data,
            error,
        } =
            await query.order(
                "created_at",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        let opportunities =
            (data ?? [])
                .map(
                    row =>
                        this.mapOpportunity(
                            row as OpportunityRow,
                        ),
                );

        if (
            filters?.page !== undefined
            &&
            filters?.limit !== undefined
        ) {

            const page =
                Math.max(
                    filters.page,
                    1,
                );

            const limit =
                Math.max(
                    filters.limit,
                    1,
                );

            const offset =
                (page - 1) * limit;

            opportunities =
                opportunities.slice(
                    offset,
                    offset + limit,
                );
        }

        return opportunities;
    }


    /**
     * Opportunity dashboard summary.
     */
    async summary(): Promise<OpportunitySummary> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select(
                    "status,value,probability,is_deleted,archived",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "is_deleted",
                    false,
                )
                .neq(
                    "archived",
                    true,
                );

        if (error) {
            throw error;
        }

        const rows =
            (data ?? []) as Array<{
                status: string | null;
                value: number | null;
                probability: number | null;
                is_deleted: boolean | null;
                archived: boolean | null;
            }>;

        const active =
            rows.filter(
                row =>
                    !row.is_deleted
                    &&
                    !row.archived,
            );

        const open =
            active.filter(
                row =>
                    row.status === "Open",
            );

        const won =
            active.filter(
                row =>
                    row.status === "Won",
            );

        const lost =
            active.filter(
                row =>
                    row.status === "Lost",
            );

        const pipelineValue =
            open.reduce(
                (
                    total,
                    row,
                ) =>
                    total +
                    (row.value ?? 0),
                0,
            );

        const weightedValue =
            open.reduce(
                (
                    total,
                    row,
                ) =>
                    total +
                    (
                        (row.value ?? 0)
                        *
                        (row.probability ?? 0)
                        /
                        100
                    ),
                0,
            );

        const totalValue =
            active.reduce(
                (
                    total,
                    row,
                ) =>
                    total +
                    (row.value ?? 0),
                0,
            );

        const averageDealSize =
            active.length === 0
                ? 0
                : totalValue /
                    active.length;

        const averageProbability =
            active.length === 0
                ? 0
                : active.reduce(
                    (
                        total,
                        row,
                    ) =>
                        total +
                        (row.probability ?? 0),
                    0,
                ) /
                    active.length;

        const closed =
            won.length +
            lost.length;

        const winRate =
            closed === 0
                ? 0
                : (
                    won.length /
                    closed
                ) * 100;

        return {

            total:
                active.length,

            open:
                open.length,

            won:
                won.length,

            lost:
                lost.length,

            pipelineValue,

            weightedValue,

            totalValue,

            averageDealSize,

            averageProbability,

            winRate,
        };
    }


    /**
     * Find opportunities belonging to an entity.
     */
    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Opportunity[]> {

        const normalizedEntityType =
            entityType.trim();

        const normalizedEntityId =
            this.requireId(
                entityId,
                "Entity id",
            );

        if (!normalizedEntityType) {
            throw new Error(
                "Entity type is required.",
            );
        }

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "entity_type",
                    normalizedEntityType,
                )
                .eq(
                    "entity_id",
                    normalizedEntityId,
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

        return (data ?? [])
            .map(
                row =>
                    this.mapOpportunity(
                        row as OpportunityRow,
                    ),
            );
    }


    /**
     * Convert database row to domain object.
     */
    private mapOpportunity(
        row: OpportunityRow,
    ): Opportunity {

        const id =
            row.id;

        const name =
            row.name
            ??
            row.title
            ??
            "";

        const title =
            row.title
            ??
            name;

        const stage =
            this.normalizeStage(
                row.stage,
            );

        const status =
            this.normalizeStatus(
                row.status,
            );

        const value =
            row.value
            ??
            0;

        const probability =
            this.normalizeProbability(
                row.probability
                ??
                0,
            );

        return {

            entityType:
                "Opportunity",

            entityId:
                row.entity_id
                ??
                id,

            id,

            organizationId:
                row.organization_id
                ??
                undefined,

            opportunityNumber:
                row.opportunity_number
                ??
                id,

            name,

            title,

            description:
                row.description
                ??
                undefined,

            companyId:
                row.company_id
                ??
                undefined,

            contactId:
                row.contact_id
                ??
                undefined,

            leadId:
                row.lead_id
                ??
                undefined,

            ownerId:
                row.owner_id
                ??
                undefined,

            owner:
                row.owner
                ??
                undefined,

            assignedTo:
                row.assigned_to
                ??
                undefined,

            stage,

            status,

            value,

            probability,

            expectedCloseDate:
                row.expected_close_date
                ??
                undefined,

            forecastRevenue:
                row.forecast_revenue
                ??
                value *
                probability /
                100,

            recurringRevenue:
                row.recurring_revenue
                ??
                undefined,

            currency:
                row.currency
                ??
                undefined,

            source:
                row.source
                ??
                undefined,

            competitor:
                row.competitor
                ??
                undefined,

            reasonWon:
                row.reason_won
                ??
                undefined,

            reasonLost:
                row.reason_lost
                ??
                undefined,

            notes:
                row.notes
                ??
                undefined,

            metadata:
                row.metadata
                ??
                {},

            archived:
                row.archived
                ??
                false,

            isDeleted:
                row.is_deleted
                ??
                false,

            deletedAt:
                row.deleted_at
                ??
                null,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }


    private normalizeStage(
        value: string | null,
    ): OpportunityStage {

        switch (value) {

            case "Qualified":
                return "Qualified";

            case "Proposal":
                return "Proposal";

            case "Negotiation":
                return "Negotiation";

            case "Won":
                return "Won";

            case "Lost":
                return "Lost";

            case "New":
            default:
                return "New";
        }
    }


    private normalizeStatus(
        value: string | null,
    ): OpportunityStatus {

        switch (value) {

            case "Won":
                return "Won";

            case "Lost":
                return "Lost";

            case "On Hold":
                return "On Hold";

            case "Open":
            default:
                return "Open";
        }
    }


    private normalizeProbability(
        value: number,
    ): number {

        if (!Number.isFinite(value)) {
            return 0;
        }

        return Math.min(
            100,
            Math.max(
                0,
                value,
            ),
        );
    }


    private normalizeOptional(
        value?: string | null,
    ): string | null {

        const normalized =
            value?.trim();

        return normalized || null;
    }


    private requireId(
        value: string,
        fieldName: string,
    ): string {

        const normalized =
            value?.trim();

        if (!normalized) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }

        return normalized;
    }


    private escapeIlike(
        value: string,
    ): string {

        return value
            .replace(
                /\\/g,
                "\\\\",
            )
            .replace(
                /%/g,
                "\\%",
            )
            .replace(
                /_/g,
                "\\_",
            )
            .replace(
                /,/g,
                "\\,",
            );
    }


    private generateOpportunityNumber(): string {

        const timestamp =
            Date.now()
                .toString()
                .slice(-8);

        return `OPP-${timestamp}`;
    }
}


/**
 * Production factory.
 */
export function createOpportunitiesRepository(
    supabase: SupabaseClient,
): OpportunitiesRepository {

    return new OpportunitiesRepository(
        supabase,
    );
}


/**
 * Standard repository export.
 */
const OpportunitiesRepositoryInstance =
    createOpportunitiesRepository;