import {
  WorkflowPriority,
  WorkflowTask,
  WorkflowSummary,
  WorkflowMetrics,
} from "@/types/workflow";

import { logger } from "@/lib/observability/logger";

type WorkflowEngineConfig = {
  overdueWeight: number;
  highPriorityWeight: number;
  dueSoonHours: number;
};

const DEFAULT_CONFIG: WorkflowEngineConfig = {
  overdueWeight: 40,
  highPriorityWeight: 25,
  dueSoonHours: 24,
};

export class WorkflowEngine {
  private config: WorkflowEngineConfig;

  constructor(config?: Partial<WorkflowEngineConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  public buildTodayWork(tasks: WorkflowTask[]): WorkflowSummary {
    const enriched = tasks.map((task) => {
      const score = this.calculateScore(task);

      logger.debug("Task scored", {
        module: "WorkflowEngine",
        meta: {
          taskId: task.id,
          score,
          priority: task.priority,
          status: task.status,
        },
      });

      return {
        ...task,
        score,
      };
    });

    const sorted = enriched.sort((a, b) => b.score - a.score);

    const metrics = this.calculateMetrics(tasks);

    logger.info("Workflow snapshot built", {
      module: "WorkflowEngine",
      meta: {
        totalTasks: tasks.length,
        highPriority: metrics.highPriorityTasks,
        overdue: metrics.overdueTasks,
      },
    });

    return {
      tasks: sorted,
      metrics,
    };
  }

  private calculateScore(task: WorkflowTask): number {
    let score = 0;

    const now = Date.now();
    const dueAt = task.dueAt ? new Date(task.dueAt).getTime() : null;

    score += this.getPriorityWeight(task.priority);

    if (dueAt && dueAt < now) {
      score += this.config.overdueWeight;
    }

    if (dueAt && dueAt > now) {
      const hoursUntilDue = (dueAt - now) / (1000 * 60 * 60);
      if (hoursUntilDue <= this.config.dueSoonHours) {
        score += 15;
      }
    }

    if (task.status === "blocked") score += 20;
    if (task.status === "pending") score += 5;
    if (task.status === "completed") score -= 50;

    if (task.source === "lead") score += 10;
    if (task.source === "automation") score += 5;

    return score;
  }

  private getPriorityWeight(priority: WorkflowPriority): number {
    switch (priority) {
      case "urgent":
        return this.config.highPriorityWeight + 30;
      case "high":
        return this.config.highPriorityWeight + 15;
      case "medium":
        return 10;
      case "low":
        return 3;
      default:
        return 0;
    }
  }

  private calculateMetrics(tasks: WorkflowTask[]): WorkflowMetrics {
    const now = Date.now();

    const totalTasks = tasks.length;
    let pendingTasks = 0;
    let overdueTasks = 0;
    let highPriorityTasks = 0;
    let completed = 0;

    for (const task of tasks) {
      const dueAt = task.dueAt ? new Date(task.dueAt).getTime() : null;

      if (task.status === "pending") pendingTasks++;
      if (task.status === "completed") completed++;

      if (dueAt && dueAt < now && task.status !== "completed") {
        overdueTasks++;
      }

      if (task.priority === "high" || task.priority === "urgent") {
        highPriorityTasks++;
      }
    }

    return {
      totalTasks,
      pendingTasks,
      overdueTasks,
      highPriorityTasks,
      completionRate:
        totalTasks === 0 ? 0 : completed / totalTasks,
    };
  }
}
