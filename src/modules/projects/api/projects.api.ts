import { apiRequest } from "@/api/client";

import type {
    Project,
    ProjectCreateInput,
    ProjectFilters,
    ProjectUpdateInput,
    PaginatedProjects,
} from "@/modules/projects/types/project";


export type GetProjectsParams = ProjectFilters;
export interface ProjectsResponse {

    data: Project[];

    total: number;

    page: number;

    totalPages: number;

}


function buildQuery(
    params: ProjectFilters = {},
): string {

    const query =
        new URLSearchParams();


    if (
        params.status &&
        params.status !== "All"
    ) {
        query.set(
            "status",
            params.status,
        );
    }


    if (
        params.search?.trim()
    ) {
        query.set(
            "search",
            params.search.trim(),
        );
    }


    if (
        params.companyId
    ) {
        query.set(
            "companyId",
            params.companyId,
        );
    }


    if (
        params.contractId
    ) {
        query.set(
            "contractId",
            params.contractId,
        );
    }


    if (
        params.projectType
    ) {
        query.set(
            "projectType",
            params.projectType,
        );
    }


    if (
        params.priority
    ) {
        query.set(
            "priority",
            params.priority,
        );
    }


    if (
        params.page !== undefined
    ) {
        query.set(
            "page",
            String(params.page),
        );
    }


    if (
        params.pageSize !== undefined
    ) {
        query.set(
            "pageSize",
            String(params.pageSize),
        );
    }


    const queryString =
        query.toString();


    return queryString
        ? `?${queryString}`
        : "";
}


export const ProjectsAPI = {


    async getProjects(
        params: ProjectFilters = {},
    ): Promise<ProjectsResponse> {

        return apiRequest<ProjectsResponse>(
            `/projects${buildQuery(params)}`,
        );

    },


    async getProject(
        id: string,
    ): Promise<Project> {

        return apiRequest<Project>(
            `/projects/${id}`,
        );

    },


    async createProject(
        data: ProjectCreateInput,
    ): Promise<Project> {

        return apiRequest<Project>(
            "/projects",
            {
                method: "POST",

                body:
                    JSON.stringify(data),
            },
        );

    },


    async updateProject(
        id: string,
        data: ProjectUpdateInput,
    ): Promise<Project> {

        return apiRequest<Project>(
            `/projects/${id}`,
            {
                method: "PUT",

                body:
                    JSON.stringify(data),
            },
        );

    },


    async deleteProject(
        id: string,
    ): Promise<{
        success: boolean;
    }> {

        return apiRequest<{
            success: boolean;
        }>(
            `/projects/${id}`,
            {
                method: "DELETE",
            },
        );

    },

};
