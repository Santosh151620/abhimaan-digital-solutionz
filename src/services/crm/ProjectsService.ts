import type { SupabaseClient } from "@supabase/supabase-js";

import {
    ProjectsRepository,
} from "@/repositories/projects.repository";

import type {
    Project,
    ProjectStatus,
} from "@/types/crm/Projects";


export class ProjectsService {

    constructor(
        private readonly repository: ProjectsRepository,
    ) {}


    list() {
        return this.repository.findAll();
    }


    listArchived() {
        return this.repository.listArchived();
    }


    details(
        id: string,
    ) {
        return this.repository.findById(id);
    }


    create(
        data: Partial<Project>,
    ) {
        return this.repository.create(data);
    }


    update(
        id: string,
        data: Partial<Project>,
    ) {
        return this.repository.update(
            id,
            data,
        );
    }


    updateStatus(
        id: string,
        status: ProjectStatus,
    ) {
        return this.repository.update(
            id,
            {
                status,
            },
        );
    }


    delete(
        id: string,
    ) {
        return this.repository.delete(id);
    }


    restore(
        id: string,
    ) {

        if (
            typeof this.repository.restore === "function"
        ) {

            return this.repository.restore(id);

        }


        return Promise.resolve(false);

    }


    summary() {
        return this.repository.summary();
    }

}



export function createProjectsService(
    supabase: SupabaseClient,
) {

    return new ProjectsService(
        new ProjectsRepository(
            supabase,
        ),
    );

}



export let ProjectsServiceInstance: ProjectsService;



export function initializeProjectsService(
    supabase: SupabaseClient,
) {

    ProjectsServiceInstance =
        createProjectsService(
            supabase,
        );


    return ProjectsServiceInstance;

}