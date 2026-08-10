"use client";

import { kpiTrends } from "./data";

export default function KPITrendsPanel() {
  const hasTrends = kpiTrends.length > 0;

  return (
    <section
      aria-labelledby="kpi-trends-title"
      className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Performance Signals
        </p>

        <h3
          id="kpi-trends-title"
          className="mt-1 text-base font-semibold text-white"
        >
          KPI Trends
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Current directional movement across key business indicators.
        </p>
      </div>

      {hasTrends ? (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpiTrends.map((kpi) => (
            <article
              key={kpi.name}
              className="group min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  {kpi.name}
                </span>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-emerald-400"
                >
                  ↗
                </span>
              </div>

              <div className="mt-3 truncate text-2xl font-bold tracking-tight text-cyan-300">
                {kpi.trend}
              </div>

              <div
                className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"
                aria-hidden="true"
              >
                <div className="h-full w-2/3 rounded-full bg-cyan-500/60" />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-7 text-center">
          <p className="text-sm font-medium text-slate-400">
            No KPI trends available
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Trend indicators will appear when business performance data is
            available.
          </p>
        </div>
      )}
    </section>
  );
}
