"use client";

import { teamPerformance } from "./data";

export default function TeamPerformancePanel() {
  return (
    <section
      aria-labelledby="team-performance-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
          Performance
        </p>

        <h3
          id="team-performance-heading"
          className="mt-1 text-lg font-bold text-white"
        >
          Team Performance
        </h3>
      </div>

      {teamPerformance.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-6 text-center">
          <p className="text-sm text-slate-400">
            No team performance data available.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {teamPerformance.map((item, index) => {
            const value = Math.min(100, Math.max(0, Number(item.value) || 0));

            return (
              <div key={`${item.name}-${index}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-white">
                    {item.name}
                  </span>

                  <span className="shrink-0 text-xs font-semibold text-cyan-400">
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
                    className="h-full rounded-full bg-cyan-500 transition-all duration-500"
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