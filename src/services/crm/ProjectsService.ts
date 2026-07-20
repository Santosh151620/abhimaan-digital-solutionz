import {
    ProjectsRepositoryInstance,
} from '@/repositories/crm/ProjectsRepository';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

export class ProjectsService {

    list() {
        return ProjectsRepositoryInstance.list();
    }

    listArchived() {
        return ProjectsRepositoryInstance.listArchived();
    }

    details(
        id: string,
    ) {
        return ProjectsRepositoryInstance.details(
            id,
        );
    }

    create(
        data: Partial<Project>,
    ) {
        return ProjectsRepositoryInstance.create(
            data,
        );
    }

    update(
        id: string,
        data: Partial<Project>,
    ) {
        return ProjectsRepositoryInstance.update(
            id,
            data,
        );
    }

    updateStatus(
        id: string,
        status: ProjectStatus,
    ) {
        return ProjectsRepositoryInstance.updateStatus(
            id,
            status,
        );
    }

    delete(
        id: string,
    ) {
        return ProjectsRepositoryInstance.delete(
            id,
        );
    }

    restore(
        id: string,
    ) {
        return ProjectsRepositoryInstance.restore(
            id,
        );
    }

    summary() {
        return ProjectsRepositoryInstance.summary();
    }

}

export async function createProjectsService() {

    return new ProjectsService();

}

export const ProjectsServiceInstance =
    new ProjectsService();