"use server";

import {
    revalidatePath,
} from "next/cache";

import {
    createProjectsService,
} from "@/services/crm/ProjectsService";

import {
    createClient,
} from "@/lib/supabase/server";

import type {
    Project,
    ProjectStatus,
} from "@/types/crm/Projects";

const PROJECTS_PATH =
    "/crm/projects";

async function service() {

    const supabase =
        await createClient();

    return createProjectsService(
        supabase,
    );

}

export async function getProjects() {

    return (
        await service()
    ).list();

}

export async function getArchivedProjects() {

    return (
        await service()
    ).listArchived();

}

export async function getProject(
    id: string,
) {

    return (
        await service()
    ).details(id);

}

export async function getProjectsSummary() {

    return (
        await service()
    ).summary();

}

export async function createProject(
    data: Partial<Project>,
) {

    try {

        const project =
            await (
                await service()
            ).create(data);

        revalidatePath(
            PROJECTS_PATH,
        );

        return {
            success: true,
            data: project,
        };

    } catch (error) {

        console.error(
            "CREATE_PROJECT_ACTION_ERROR",
            error,
        );

        return {
            success: false,
            message:
                "Unable to create project",
        };

    }

}

export async function updateProject(
    id: string,
    data: Partial<Project>,
) {

    try {

        const project =
            await (
                await service()
            ).update(
                id,
                data,
            );

        revalidatePath(
            PROJECTS_PATH,
        );

        return {
            success: true,
            data: project,
        };

    } catch (error) {

        console.error(
            "UPDATE_PROJECT_ACTION_ERROR",
            error,
        );

        return {
            success: false,
            message:
                "Unable to update project",
        };

    }

}

export async function updateProjectStatus(
    id: string,
    status: ProjectStatus,
) {

    try {

        const project =
            await (
                await service()
            ).updateStatus(
                id,
                status,
            );

        revalidatePath(
            PROJECTS_PATH,
        );

        return {
            success: true,
            data: project,
        };

    } catch (error) {

        console.error(
            "UPDATE_PROJECT_STATUS_ACTION_ERROR",
            error,
        );

        return {
            success: false,
            message:
                "Unable to update project status",
        };

    }

}

export async function deleteProject(
    id: string,
) {

    try {

        await (
            await service()
        ).delete(id);

        revalidatePath(
            PROJECTS_PATH,
        );

        return {
            success: true,
        };

    } catch (error) {

        console.error(
            "DELETE_PROJECT_ACTION_ERROR",
            error,
        );

        return {
            success: false,
            message:
                "Unable to delete project",
        };

    }

}

export async function restoreProject(
    id: string,
) {

    try {

        await (
            await service()
        ).restore(id);

        revalidatePath(
            PROJECTS_PATH,
        );

        return {
            success: true,
        };

    } catch (error) {

        console.error(
            "RESTORE_PROJECT_ACTION_ERROR",
            error,
        );

        return {
            success: false,
            message:
                "Unable to restore project",
        };

    }

}