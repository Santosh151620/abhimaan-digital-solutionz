'use server';

import {
    createProjectsService,
} from '@/services/crm/ProjectsService';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

function service() {

    return createProjectsService();

}

export async function getProjects() {

    return service().list();

}

export async function getArchivedProjects() {

    return service().listArchived();

}

export async function getProject(
    id: string,
) {

    return service().details(
        id,
    );

}

export async function createProject(
    data: Partial<Project>,
) {

    return service().create(
        data,
    );

}

export async function updateProject(
    id: string,
    data: Partial<Project>,
) {

    return service().update(
        id,
        data,
    );

}

export async function updateProjectStatus(
    id: string,
    status: ProjectStatus,
) {

    return service().updateStatus(
        id,
        status,
    );

}

export async function deleteProject(
    id: string,
) {

    return service().delete(
        id,
    );

}

export async function restoreProject(
    id: string,
) {

    return service().restore(
        id,
    );

}

export async function getProjectsSummary() {

    return service().summary();

}
