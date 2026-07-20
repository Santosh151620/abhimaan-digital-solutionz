'use server';

import { ProjectsServiceInstance } from '@/services/crm/ProjectsService';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

export async function getProjects() {
    return ProjectsServiceInstance.list();
}

export async function getArchivedProjects() {
    return ProjectsServiceInstance.listArchived();
}

export async function getProject(
    id: string
) {
    return ProjectsServiceInstance.details(id);
}

export async function createProject(
    data: Partial<Project>
) {
    return ProjectsServiceInstance.create(data);
}

export async function updateProject(
    id: string,
    data: Partial<Project>
) {
    return ProjectsServiceInstance.update(
        id,
        data
    );
}

export async function updateProjectStatus(
    id: string,
    status: ProjectStatus
) {
    return ProjectsServiceInstance.updateStatus(
        id,
        status
    );
}