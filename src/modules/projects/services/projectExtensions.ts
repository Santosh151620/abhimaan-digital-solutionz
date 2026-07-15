//import type { Project } from "@/modules/projects/types/project";
/**
 * This layer extends core project service WITHOUT modifying existing production logic.
 * Safe for incremental CRM expansion.
 */
import type {
  Project,
  ProjectStatus,
} from "@/modules/projects/types/project";
/**
 * Normalizes status values coming from legacy DB (string-based)
 */
export function normalizeProjectStatus(status: string): ProjectStatus {
  const s = status?.toLowerCase();

  switch (s) {
    case "active":
    case "in_progress":
      return "active";
    case "planning":
      return "planning";
    case "on_hold":
    case "hold":
      return "on_hold";
    case "completed":
      return "completed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    default:
      return "planning";
  }
}

/**
 * Converts raw DB project into safe enriched project object
 */
export function enrichProject(project: Project) {
  return {
    ...project,

    normalizedStatus: normalizeProjectStatus(project.status),

    isActive:
      normalizeProjectStatus(project.status) === "active",

    isCompleted:
      normalizeProjectStatus(project.status) === "completed",

    isDelayed:
      project.end_date
        ? new Date(project.end_date).getTime() < Date.now() &&
          normalizeProjectStatus(project.status) !== "completed"
        : false,

    durationDays: calculateProjectDuration(
      project.start_date,
      project.end_date
    ),

    progress: calculateProgressFromDates(
      project.start_date,
      project.end_date
    ),
  };
}

/**
 * Calculates project duration in days
 */
export function calculateProjectDuration(
  start?: string | null,
  end?: string | null
): number {
  if (!start || !end) return 0;

  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  if (isNaN(startDate) || isNaN(endDate)) return 0;

  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
}

/**
 * Auto progress estimation based on timeline (fallback logic)
 */
export function calculateProgressFromDates(
  start?: string | null,
  end?: string | null
): number {
  if (!start || !end) return 0;

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const now = Date.now();

  if (now <= startTime) return 0;
  if (now >= endTime) return 100;

  const total = endTime - startTime;
  const elapsed = now - startTime;

  return Math.round((elapsed / total) * 100);
}

/**
 * Project health scoring (for dashboard analytics)
 */
export function getProjectHealthScore(project: Project): {
  score: number;
  label: "GOOD" | "AT_RISK" | "CRITICAL";
} {
  let score = 100;

  const enriched = enrichProject(project);

  // Penalize delay
  if (enriched.isDelayed) score -= 40;

  // Penalize long inactive projects
  if (enriched.normalizedStatus === "on_hold") score -= 20;

  // Penalize missing timeline
  if (!project.start_date || !project.end_date) score -= 15;

  // Reward completion
  if (enriched.isCompleted) score = 100;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  let label: "GOOD" | "AT_RISK" | "CRITICAL" = "GOOD";

  if (score < 40) label = "CRITICAL";
  else if (score < 70) label = "AT_RISK";

  return { score, label };
}

/**
 * Group projects by client (for CRM UI)
 */
export function groupProjectsByClient(projects: Project[]) {
  return projects.reduce((acc: Record<string, Project[]>, project) => {
    if (!acc[project.client_id]) {
      acc[project.client_id] = [];
    }

    acc[project.client_id].push(project);
    return acc;
  }, {});
}

/**
 * KPI helper for dashboard integration
 */
export function calculateProjectKPIs(projects: Project[]) {
  const total = projects.length;

  const active = projects.filter(
    (p) => normalizeProjectStatus(p.status) === "active"
  ).length;

  const completed = projects.filter(
    (p) => normalizeProjectStatus(p.status) === "completed"
  ).length;

  const delayed = projects.filter((p) => {
    const enriched = enrichProject(p);
    return enriched.isDelayed;
  }).length;

  const avgDuration =
    projects.reduce((sum, p) => {
      return sum + calculateProjectDuration(p.start_date, p.end_date);
    }, 0) / (total || 1);

  return {
    total,
    active,
    completed,
    delayed,
    avgDuration: Math.round(avgDuration),
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  };
}





