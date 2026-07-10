"use client";

import { useMemo } from "react";
import type { Project } from "@/modules/projects/types/project";

export function useProjectAnalytics(projects: Project[]) {
  return useMemo(() => {
    const totalCost = projects.reduce(
      (sum, p) => sum + Number(p.project_cost ?? 0),
      0
    );

    const active = projects.filter((p) => p.status === "active").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const onHold = projects.filter((p) => p.status === "on_hold").length;

    const highValue = projects.filter((p) => p.project_cost >= 100000).length;
    const midValue = projects.filter(
      (p) => p.project_cost >= 25000 && p.project_cost < 100000
    ).length;
    const lowValue = projects.filter((p) => p.project_cost < 25000).length;

    const started = projects.filter((p) => p.start_date).length;

    const completedTimeline = projects.filter(
      (p) => p.end_date && p.status === "completed"
    ).length;

    const avgCost =
      projects.length === 0
        ? 0
        : Math.round(totalCost / projects.length);

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
      highValue,
      midValue,
      lowValue,
      started,
      completedTimeline,
      avgCost,
      avgProgress,
      completionRate,
    };
  }, [projects]);
}
