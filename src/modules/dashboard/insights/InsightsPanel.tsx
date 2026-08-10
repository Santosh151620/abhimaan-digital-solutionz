"use client";

import { insights } from "./data";

export default function InsightsPanel() {
  return (
    <section
      aria-labelledby="business-insights-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <h3
        id="business-insights-heading"
        className="mb-4 text-lg font-bold text-white"
      >
        Business Insights
      </h3>

      {insights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
          No business insights available.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-slate-700"
            >
              <div className="text-sm font-medium text-slate-400">
                {insight.title}
              </div>

              <div className="mt-2 text-2xl font-bold text-teal-400">
                {insight.value}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}