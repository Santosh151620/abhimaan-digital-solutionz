import {
    ProjectsAPI,
} from "@/modules/projects/api/projects.api";

import type {
    GetProjectsParams,
} from "@/modules/projects/api/projects.api";

import type {
    Project,
    ProjectCreateInput,
    ProjectUpdateInput,
} from "@/modules/projects/types/project";


export type FindProjectsParams =
    GetProjectsParams;


export class ProjectRepository {


    static async findAll(
        params: FindProjectsParams = {},
    ): Promise<{
        data: Project[];
        total: number;
        page: number;
        totalPages: number;
    }> {

        return ProjectsAPI.getProjects(
            params,
        );

    }


    static async findById(
        id: string,
    ): Promise<Project> {

        return ProjectsAPI.getProject(
            id,
        );

    }


    static async create(
        data: ProjectCreateInput,
    ): Promise<Project> {

        return ProjectsAPI.createProject(
            data,
        );

    }


    static async update(
        id: string,
        data: ProjectUpdateInput,
    ): Promise<Project> {

        return ProjectsAPI.updateProject(
            id,
            data,
        );

    }


    static async remove(
        id: string,
    ): Promise<{
        success: boolean;
    }> {

        return ProjectsAPI.deleteProject(
            id,
        );

    }

}