import {
    createClient as createSupabaseClient,
} from "@/lib/supabase/server";

import type {
    Project,
    ProjectFilters,
    PaginatedProjects,
    ProjectStatus,
} from "@/modules/projects/types/project";
import {
    ProjectsRepository,
} from "@/repositories/crm/ProjectsRepository";


const TABLE = "projects";


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


const PROJECT_STATUSES:
    ProjectStatus[] = [
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

        id:
            row.id,

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
                row.budget_amount ??
                0,
            ),

        actualCost:
            row.actual_cost ??
            undefined,

        metadata:
            row.metadata ??
            undefined,

        archived:
            false,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,

    };
}


export async function getProjects(
    filters: ProjectFilters = {},
): Promise<PaginatedProjects> {

    const supabase =
        await createSupabaseClient();


    const repository =
        new ProjectsRepository(
            supabase,
        );


    return repository.findPaginated(
        filters,
    );

}

export async function getActiveProjectsCount():
    Promise<number> {

    const supabase =
        await createSupabaseClient();


    const repository =
        new ProjectsRepository(
            supabase,
        );


    return repository.countActive();

}

export async function getProjectRevenue():
    Promise<number> {

    const supabase =
        await createSupabaseClient();


    const repository =
        new ProjectsRepository(
            supabase,
        );


    return repository.getBudgetTotal();

}

export async function getClientProjects(
    companyId: string,
): Promise<Project[]> {

    const result =
        await getProjects({
            companyId,
            page: 1,
            pageSize: 1000,
        });


    return result.projects;
}

