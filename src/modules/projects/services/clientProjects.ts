import { getProjects } from "@/modules/projects/services/projects";

import type { Project } from "@/modules/projects/types/project";

import {
  enrichProject,
  calculateProjectKPIs,
} from "@/modules/projects/services/projectExtensions";

export interface ClientProjectSummary {
  clientId: string;

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
  clientId: string
): Promise<Project[]> {
  const result = await getProjects({
    clientId,
    page: 1,
    pageSize: 1000,
  });

  return result.projects;
}

export async function getClientProjectSummary(
  clientId: string
): Promise<ClientProjectSummary> {
  const projects = await getClientProjects(clientId);

  const enriched = projects.map(enrichProject);

  const kpis = calculateProjectKPIs(projects);

  const totalRevenue = projects.reduce(
    (sum, project) =>
      sum + Number(project.project_cost ?? 0),
    0
  );

  const latestProject =
    [...projects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];

  return {
    clientId,

    totalProjects: kpis.total,

    activeProjects: kpis.active,

    completedProjects: kpis.completed,

    delayedProjects: kpis.delayed,

    totalRevenue,

    averageProjectCost:
      projects.length === 0
        ? 0
        : Math.round(totalRevenue / projects.length),

    latestProject,

    projects: enriched,
  };
}

export async function getClientsProjectSummaries(
  clientIds: string[]
): Promise<ClientProjectSummary[]> {
  const summaries: ClientProjectSummary[] = [];

  for (const clientId of clientIds) {
    summaries.push(
      await getClientProjectSummary(clientId)
    );
  }

  return summaries;
}

export async function getClientRevenue(
  clientId: string
): Promise<number> {
  const projects = await getClientProjects(clientId);

  return projects.reduce(
    (sum, project) =>
      sum + Number(project.project_cost ?? 0),
    0
  );
}

export async function getClientActiveProjects(
  clientId: string
): Promise<Project[]> {
  const projects = await getClientProjects(clientId);

  return projects.filter(
    (project) => enrichProject(project).isActive
  );
}

export async function getClientCompletedProjects(
  clientId: string
): Promise<Project[]> {
  const projects = await getClientProjects(clientId);

  return projects.filter(
    (project) => enrichProject(project).isCompleted
  );
}

export async function hasActiveProjects(
  clientId: string
): Promise<boolean> {
  const active = await getClientActiveProjects(clientId);

  return active.length > 0;
}
