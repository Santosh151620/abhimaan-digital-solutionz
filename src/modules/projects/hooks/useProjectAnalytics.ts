"use client";

import { useMemo } from "react";
import type { Project } from "@/modules/projects/types/project";

export function useProjectAnalytics(projects: Project[]) {
  return useMemo(() => {
    const totalCost = projects.reduce(
      (sum, p) => sum + Number(p.budget ?? 0),
      0
    );

    const active = projects.filter((p) => p.status === "Active").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const onHold = projects.filter((p) => p.status === "On Hold").length;

    const highValue = projects.filter((p) => p.budget >= 100000).length;
    const midValue = projects.filter(
      (p) => p.budget >= 25000 && p.budget < 100000
    ).length;
    const lowValue = projects.filter((p) => p.budget < 25000).length;

    const started = projects.filter((p) => p.startDate).length;

    const completedTimeline = projects.filter(
      (p) => p.endDate && p.status === "Completed"
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
              (sum, p) => sum + (p.progressPercent ?? 0),
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














