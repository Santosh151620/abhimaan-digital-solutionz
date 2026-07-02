import type { Project } from "@/types/project";

/**
 * v5 ENTERPRISE ANALYTICS ENGINE
 * Centralized business intelligence layer
 */

export function calculateProjectAnalytics(projects: Project[]) {
  const totalCost = projects.reduce(
    (sum, p) => sum + Number(p.project_cost ?? 0),
    0
  );

  const active = projects.filter(
    (p) => p.status === "active"
  ).length;

  const completed = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const onHold = projects.filter(
    (p) => p.status === "on_hold"
  ).length;

  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce(
            (sum, p) => sum + (p.progress_percentage ?? 0),
            0
          ) / projects.length
        );

  const completionRate =
    projects.length === 0
      ? 0
      : Math.round((completed / projects.length) * 100);

  return {
    totalCost,
    active,
    completed,
    onHold,
    avgProgress,
    completionRate,
  };
}