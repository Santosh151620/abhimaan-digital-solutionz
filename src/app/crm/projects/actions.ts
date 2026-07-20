'use server';

import {
    createProjectsService,
} from '@/services/crm/ProjectsService';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

async function service() {

    return createProjectsService();

}

export async function getProjects() {

    return (await service()).list();

}

export async function getArchivedProjects() {

    return (await service()).listArchived();

}

export async function getProject(
    id: string,
) {

    return (await service()).details(
        id,
    );

}

export async function createProject(
    data: Partial<Project>,
) {

    return (await service()).create(
        data,
    );

}

export async function updateProject(
    id: string,
    data: Partial<Project>,
) {

    return (await service()).update(
        id,
        data,
    );

}

export async function updateProjectStatus(
    id: string,
    status: ProjectStatus,
) {

    return (await service()).updateStatus(
        id,
        status,
    );

}

export async function deleteProject(
    id: string,
) {

    return (await service()).delete(
        id,
    );

}

export async function restoreProject(
    id: string,
) {

    return (await service()).restore(
        id,
    );

}

export async function getProjectsSummary() {

    return (await service()).summary();

}