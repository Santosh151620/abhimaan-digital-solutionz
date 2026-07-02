import type { Project } from "@/types/project";

export function normalizeProjects(projects: any[]): Project[] {
  return projects.map((p) => ({
    ...p,

    project_cost: Number(p.project_cost ?? 0),

    progress_percentage: Number(p.progress_percentage ?? 0),

    client_id: p.client_id ?? "",

    name: p.name ?? "Untitled Project",

    service_type: p.service_type ?? "unknown"
  }));
}