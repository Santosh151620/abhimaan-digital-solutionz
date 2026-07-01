"use client";

import type { WorkflowTask } from "@/types/workflow";

interface Metrics {
  pendingTasks: number;
  overdueTasks: number;
  completedToday?: number;
  completionRate?: number;
}

interface TodayWorkPanelProps {
  tasks: WorkflowTask[];
  metrics: Metrics;
}

export default function TodayWorkPanel({
  tasks,
  metrics,
}: TodayWorkPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Today's Work
        </h2>

        <p className="text-sm text-slate-400">
          {metrics.pendingTasks} pending ·{" "}
          {metrics.overdueTasks} overdue
        </p>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-slate-500">
            No work scheduled.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded border border-slate-700 p-3"
            >
              <div className="font-medium">
                {task.title}
              </div>

              <div className="text-sm text-slate-400">
                {task.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}