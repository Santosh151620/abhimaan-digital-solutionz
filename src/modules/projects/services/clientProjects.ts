import { getProjects } from "@/modules/projects/services/projects";

import type {
    Project,
} from "@/modules/projects/types/project";

import {
    enrichProject,
    calculateProjectKPIs,
} from "@/modules/projects/services/projectExtensions";


export interface ClientProjectSummary {

    companyId: string;

    totalProjects: number;

    activeProjects: number;

    completedProjects: number;

    delayedProjects: number;

    totalRevenue: number;

    averageProjectCost: number;

    latestProject?: Project;

    projects: ReturnType<typeof enrichProject>[];

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


export async function getClientProjectSummary(
    companyId: string,
): Promise<ClientProjectSummary> {

    const projects =
        await getClientProjects(companyId);

    const enriched =
        projects.map(enrichProject);

    const kpis =
        calculateProjectKPIs(projects);

    const totalRevenue =
        projects.reduce(
            (sum, project) =>
                sum +
                Number(project.budget ?? 0),
            0,
        );

    const latestProject =
        [...projects]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )[0];

    return {

        companyId,

        totalProjects:
            kpis.total,

        activeProjects:
            kpis.active,

        completedProjects:
            kpis.completed,

        delayedProjects:
            kpis.delayed,

        totalRevenue,

        averageProjectCost:
            projects.length === 0
                ? 0
                : Math.round(
                    totalRevenue /
                    projects.length,
                ),

        latestProject,

        projects: enriched,

    };
}


export async function getClientsProjectSummaries(
    companyIds: string[],
): Promise<ClientProjectSummary[]> {

    return Promise.all(
        companyIds.map(
            (companyId) =>
                getClientProjectSummary(
                    companyId,
                ),
        ),
    );
}


export async function getClientRevenue(
    companyId: string,
): Promise<number> {

    const projects =
        await getClientProjects(
            companyId,
        );

    return projects.reduce(
        (sum, project) =>
            sum +
            Number(project.budget ?? 0),
        0,
    );
}


export async function getClientActiveProjects(
    companyId: string,
): Promise<Project[]> {

    const projects =
        await getClientProjects(
            companyId,
        );

    return projects.filter(
        (project) =>
            enrichProject(project).isActive,
    );
}


export async function getClientCompletedProjects(
    companyId: string,
): Promise<Project[]> {

    const projects =
        await getClientProjects(
            companyId,
        );

    return projects.filter(
        (project) =>
            enrichProject(project).isCompleted,
    );
}


export async function hasActiveProjects(
    companyId: string,
): Promise<boolean> {

    const active =
        await getClientActiveProjects(
            companyId,
        );

    return active.length > 0;
}