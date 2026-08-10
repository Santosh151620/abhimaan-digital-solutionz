"use client";

import { teamPerformance } from "./data";

function clampPercentage(value: unknown): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericValue));
}

export default function TeamPerformancePanel() {
  return (
    <section
      aria-labelledby="team-performance-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
          Performance
        </p>

        <h3
          id="team-performance-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Team Performance
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Current performance indicators across the sales team.
        </p>
      </div>

      {teamPerformance.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No team performance data available.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {teamPerformance.map((item, index) => {
            const value = clampPercentage(item.value);

            return (
              <div key={`${item.name}-${index}`} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-200">
                    {item.name}
                  </span>

                  <span className="shrink-0 text-xs font-semibold text-violet-300">
                    {value}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-label={`${item.name} performance`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={value}
                >
                  <div
                    className="h-full rounded-full bg-violet-500/80 transition-[width] duration-500"
                    style={{ width: `${value}%` }}
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
