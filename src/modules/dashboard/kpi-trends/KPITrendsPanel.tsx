"use client";

import { kpiTrends } from "./data";

export default function KPITrendsPanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Performance Signals
        </p>

        <h3 className="mt-1 text-base font-semibold text-white">
          KPI Trends
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Current directional movement across key business indicators.
        </p>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiTrends.map((kpi) => (
          <div
            key={kpi.name}
            className="group rounded-xl border border-white/5 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/20"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                {kpi.name}
              </span>

              <span className="text-emerald-400">
                ↗
              </span>
            </div>

            <div className="mt-3 text-2xl font-bold tracking-tight text-cyan-300">
              {kpi.trend}
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-cyan-500/60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
