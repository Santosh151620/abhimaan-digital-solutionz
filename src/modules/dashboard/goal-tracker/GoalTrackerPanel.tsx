"use client";

import { goals } from "./data";

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export default function GoalTrackerPanel() {
  return (
    <section
      aria-labelledby="goal-tracker-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3
          id="goal-tracker-heading"
          className="text-lg font-bold text-white"
        >
          Goal Tracker
        </h3>

        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Progress
        </span>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
          No goals configured.
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => {
            const progress = clampProgress(goal.progress);

            return (
              <div key={goal.goal}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-200">
                    {goal.goal}
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-emerald-400">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${goal.goal} progress`}
                >
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}