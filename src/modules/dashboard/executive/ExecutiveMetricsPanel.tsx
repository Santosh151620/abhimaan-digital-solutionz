"use client";

import { BarChart3, TrendingUp } from "lucide-react";

import { executiveMetrics } from "./data";

export default function ExecutiveMetricsPanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-400/10 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/5">
          <BarChart3 className="h-4 w-4 text-emerald-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Executive Metrics
          </h3>
          <p className="text-[11px] text-slate-500">
            Key business performance measures
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {executiveMetrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
              <p className="truncate text-[11px] font-medium text-slate-500">
                {metric.label}
              </p>
            </div>

            <p className="mt-2 truncate text-xl font-bold tracking-tight text-emerald-300">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}