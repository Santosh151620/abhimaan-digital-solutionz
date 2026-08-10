"use client";

import { goals } from "./data";

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export default function GoalsPanel() {
  return (
    <section
      aria-labelledby="business-goals-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <h3
        id="business-goals-heading"
        className="mb-4 text-lg font-bold text-white"
      >
        Business Goals
      </h3>

      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
          No business goals configured.
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => {
            const progress = clampProgress(goal.progress);

            return (
              <div key={goal.name}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-300">
                    {goal.name}
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-teal-400">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${goal.name} progress`}
                >
                  <div
                    className="h-full rounded-full bg-teal-500 transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  Target:{" "}
                  <span className="text-slate-400">
                    {goal.target}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}