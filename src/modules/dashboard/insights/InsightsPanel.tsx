"use client";

import { insights } from "./data";

export default function InsightsPanel() {
  return (
    <section
      aria-labelledby="business-insights-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-teal-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">
          Business Intelligence
        </p>

        <h3
          id="business-insights-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Business Insights
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Key indicators highlighting current business performance.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No business insights available.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-colors hover:border-teal-500/20 hover:bg-slate-950"
            >
              <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                {insight.title}
              </p>

              <p className="mt-2 truncate text-2xl font-bold tracking-tight text-teal-300">
                {insight.value}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
