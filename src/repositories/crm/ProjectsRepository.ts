import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    Project,
    ProjectStatus,
} from "@/types/crm/Projects";

import type {
    ProjectFilters,
} from "@/modules/projects/types/project";


export type ProjectListQuery =
    ProjectFilters;

type ProjectRow = {
    id: string;
    organization_id: string;
    project_number: string;
    company_id: string | null;
    contract_id: string | null;
    project_name: string;
    project_code: string | null;
    project_type: string | null;
    project_status: string | null;
    priority: string | null;
    start_date: string | null;
    planned_end_date: string | null;
    actual_end_date: string | null;
    budget_amount: number | null;
    estimated_cost: number | null;
    actual_cost: number | null;
    progress_percent: number | null;
    project_manager: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    metadata: Record<string, unknown> | null;
};

const PROJECT_STATUSES: ProjectStatus[] = [
    "Planning",
    "Active",
    "On Hold",
    "Completed",
    "Cancelled",
];

function toProjectStatus(
    value: string | null,
): ProjectStatus {
    if (
        value &&
        PROJECT_STATUSES.includes(
            value as ProjectStatus,
        )
    ) {
        return value as ProjectStatus;
    }

    return "Planning";
}

function toProject(
    row: ProjectRow,
): Project {
    return {
        id: row.id,

        projectNumber:
            row.project_number,

        companyId:
            row.company_id ??
            undefined,

        contractId:
            row.contract_id ??
            undefined,

        name:
            row.project_name,

        description:
            row.description ??
            undefined,

        status:
            toProjectStatus(
                row.project_status,
            ),

        projectType:
            row.project_type ??
            undefined,

        priority:
            row.priority ??
            undefined,

        ownerUserId:
            row.project_manager ??
            undefined,

        manager:
            row.project_manager ??
            undefined,

        startDate:
            row.start_date ??
            undefined,

        endDate:
            row.planned_end_date ??
            undefined,

        actualEndDate:
            row.actual_end_date ??
            undefined,

        budget:
            Number(
                row.budget_amount ?? 0,
            ),

        actualCost:
            row.actual_cost ??
            undefined,

        metadata:
            row.metadata ??
            undefined,

        progressPercent:
            row.progress_percent ??
            0,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,
    };
}

function toDatabasePayload(
    data: Partial<Project>,
): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (
        data.projectNumber !== undefined
    ) {
        payload.project_number =
            data.projectNumber;
    }

    if (
        data.companyId !== undefined
    ) {
        payload.company_id =
            data.companyId;
    }

    if (
        data.contractId !== undefined
    ) {
        payload.contract_id =
            data.contractId;
    }

    if (
        data.name !== undefined
    ) {
        payload.project_name =
            data.name;
    }

    if (
        data.projectType !== undefined
    ) {
        payload.project_type =
            data.projectType;
    }

    if (
        data.status !== undefined
    ) {
        payload.project_status =
            data.status;
    }

    if (
        data.priority !== undefined
    ) {
        payload.priority =
            data.priority;
    }

    if (
        data.startDate !== undefined
    ) {
        payload.start_date =
            data.startDate;
    }

    if (
        data.endDate !== undefined
    ) {
        payload.planned_end_date =
            data.endDate;
    }

    if (
        data.actualEndDate !== undefined
    ) {
        payload.actual_end_date =
            data.actualEndDate;
    }

    if (
        data.budget !== undefined
    ) {
        payload.budget_amount =
            data.budget;
    }

    if (
        data.actualCost !== undefined
    ) {
        payload.actual_cost =
            data.actualCost;
    }

    if (
        data.manager !== undefined
    ) {
        payload.project_manager =
            data.manager;
    } else if (
        data.ownerUserId !== undefined
    ) {
        payload.project_manager =
            data.ownerUserId;
    }

    if (
        data.description !== undefined
    ) {
        payload.description =
            data.description;
    }

    if (
        data.metadata !== undefined
    ) {
        payload.metadata =
            data.metadata;
    }

    return payload;
}

export class ProjectsRepository
    extends BaseRepository<Project> {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "projects",
        );
    }

    async findById(
        id: string,
    ): Promise<Project | null> {

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
                    id,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        return toProject(
            data as ProjectRow,
        );
    }

    async findAll(): Promise<Project[]> {

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
                .is(
                    "deleted_at",
                    null,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                );

        if (error) {
            throw error;
        }

        return (
            data as ProjectRow[] | null
        )?.map(toProject) ?? [];
    }

    async findPaginated(
        filters: ProjectFilters = {},
    ): Promise<{
        projects: Project[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }> {

        const page =
            Math.max(
                1,
                filters.page ?? 1,
            );

        const pageSize =
            Math.min(
                1000,
                Math.max(
                    1,
                    filters.pageSize ?? 20,
                ),
            );

        const from =
            (page - 1) *
            pageSize;

        const to =
            from +
            pageSize -
            1;        let query =
            this.tableRef()
                .select(
                    "*",
                    {
                        count: "exact",
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                );
        if (
            filters.status &&
            filters.status !== "All"
        ) {
            query =
                query.eq(
                    "project_status",
                    filters.status,
                );
        }

        if (
            filters.companyId
        ) {
            query =
                query.eq(
                    "company_id",
                    filters.companyId,
                );
        }

        if (
            filters.contractId
        ) {
            query =
                query.eq(
                    "contract_id",
                    filters.contractId,
                );
        }

        if (
            filters.projectType
        ) {
            query =
                query.eq(
                    "project_type",
                    filters.projectType,
                );
        }

        if (
            filters.priority
        ) {
            query =
                query.eq(
                    "priority",
                    filters.priority,
                );
        }

        if (
            filters.search?.trim()
        ) {

            const search =
                filters.search
                    .trim()
                    .replace(
                        /[%_\\]/g,
                        "\\$&",
                    );

            query =
                query.or(
                    [
                        `project_name.ilike.%${search}%`,
                        `project_number.ilike.%${search}%`,
                        `project_code.ilike.%${search}%`,
                    ].join(","),
                );
        }

        const {
            data,
            count,
            error,
        } =
            await query
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                )
                .range(
                    from,
                    to,
                );

        if (error) {
            throw new Error(
                `Failed to load projects: ${error.message}`,
            );
        }

        const projects =
            (
                data as ProjectRow[] | null
            )?.map(
                toProject,
            ) ?? [];

        const total =
            count ?? 0;

        return {

            projects,

            total,

            page,

            pageSize,

            totalPages:
                Math.ceil(
                    total /
                    pageSize,
                ),

        };
    }


    async countActive(): Promise<number> {

        const {
            count,
            error,
        } =
            await this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "project_status",
                    "Active",
                )
                .is(
                    "deleted_at",
                    null,
                );

        if (error) {
            throw new Error(
                `Failed to load active project count: ${error.message}`,
            );
        }

        return count ?? 0;
    }

    async getBudgetTotal(): Promise<number> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select(
                    "budget_amount",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                );

        if (error) {
            throw new Error(
                `Failed to load project revenue: ${error.message}`,
            );
        }

        return (
            data ?? []
        ).reduce(
            (
                total,
                project,
            ) =>
                total +
                (
                    Number(
                        project.budget_amount,
                    ) || 0
                ),
            0,
        );
    }

    async create(
        data: Partial<Project>,
    ): Promise<Project> {

        const payload =
            this.withCreateTenant(
                toDatabasePayload(data),
            );

        const {
            data: created,
            error,
        } =
            await this.tableRef()
                .insert(payload)
                .select("*")
                .single();

        if (error) {
            throw error;
        }

        return toProject(
            created as ProjectRow,
        );
    }

    async update(
        id: string,
        data: Partial<Project>,
    ): Promise<Project> {

        const payload =
            toDatabasePayload(data);

        const {
            data: updated,
            error,
        } =
            await this.tableRef()
                .update(payload)
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .select("*")
                .single();

        if (error) {
            throw error;
        }

        return toProject(
            updated as ProjectRow,
        );
    }

    async listArchived(): Promise<Project[]> {

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
                .not(
                    "deleted_at",
                    "is",
                    null,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                );

        if (error) {
            throw error;
        }

        return (
            data as ProjectRow[] | null
        )?.map(toProject) ?? [];
    }


    async restore(
        id: string,
    ): Promise<Project> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .update({
                    deleted_at: null,
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .not(
                    "deleted_at",
                    "is",
                    null,
                )
                .select("*")
                .single();

        if (error) {
            throw error;
        }

        return toProject(
            data as ProjectRow,
        );
    }

    async delete(
        id: string,
    ): Promise<void> {

        const {
            error,
        } =
            await this.tableRef()
                .update({
                    deleted_at:
                        new Date().toISOString(),
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                )
                .is(
                    "deleted_at",
                    null,
                );

        if (error) {
            throw error;
        }

    }

    async summary() {

        const [

            planningResult,
            activeResult,
            onHoldResult,
            completedResult,
            cancelledResult,
            financialResult,

        ] = await Promise.all([

            this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .eq(
                    "project_status",
                    "Planning",
                ),

            this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .eq(
                    "project_status",
                    "Active",
                ),

            this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .eq(
                    "project_status",
                    "On Hold",
                ),

            this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .eq(
                    "project_status",
                    "Completed",
                ),

            this.tableRef()
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true,
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                )
                .eq(
                    "project_status",
                    "Cancelled",
                ),

            this.tableRef()
                .select(
                    "budget_amount, actual_cost",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .is(
                    "deleted_at",
                    null,
                ),

        ]);

        if (
            planningResult.error ||
            activeResult.error ||
            onHoldResult.error ||
            completedResult.error ||
            cancelledResult.error ||
            financialResult.error
        ) {

            const errorMessage =
                planningResult.error?.message ??
                activeResult.error?.message ??
                onHoldResult.error?.message ??
                completedResult.error?.message ??
                cancelledResult.error?.message ??
                financialResult.error?.message ??
                "Unknown database error";

            throw new Error(
                `Failed to load project summary: ${errorMessage}`,
            );
        }

        const financialRows =
            financialResult.data as Array<{
                budget_amount: number | null;
                actual_cost: number | null;
            }> | null;

        const totalBudget =
            financialRows?.reduce(
                (sum, project) =>
                    sum +
                    (project.budget_amount ?? 0),
                0,
            ) ?? 0;

        const totalActualCost =
            financialRows?.reduce(
                (sum, project) =>
                    sum +
                    (project.actual_cost ?? 0),
                0,
            ) ?? 0;

        const planning =
            planningResult.count ?? 0;

        const active =
            activeResult.count ?? 0;

        const onHold =
            onHoldResult.count ?? 0;

        const completed =
            completedResult.count ?? 0;

        const cancelled =
            cancelledResult.count ?? 0;

        return {

            total:
                planning +
                active +
                onHold +
                completed +
                cancelled,

            planning,

            active,

            onHold,

            completed,

            cancelled,

            archived: 0,

            totalBudget,

            totalActualCost,

        };
    }
}















