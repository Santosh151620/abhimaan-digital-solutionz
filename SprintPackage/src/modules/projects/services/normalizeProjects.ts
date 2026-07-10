import type { Project } from "@/modules/projects/types/project";

export function normalizeProjects(projects: Project[]): Project[] {
  return projects.map((p) => ({
    ...p,

    project_cost: Number(p.project_cost ?? 0),
    progress_percentage: Number(p.progress_percentage ?? 0),
    client_id: p.client_id ?? "",
    name: p.name ?? "Untitled Project",
    service_type: p.service_type ?? "unknown",

    entityType: "project",
    status: p.status ?? "planning",
    priority: p.priority ?? "MEDIUM",
    start_date: p.start_date ?? null,
    end_date: p.end_date ?? null,
    notes: p.notes ?? null,
    milestones: p.milestones ?? [],


    organizationId: p.organizationId ?? "",
    createdAt: p.createdAt ?? "",
    updatedAt: p.updatedAt ?? "",

  }));
}
