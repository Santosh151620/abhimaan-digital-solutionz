"use client";

import { aiInsights } from "./data";

export default function AIInsightsPanel() {
  return (
    <section
      aria-labelledby="ai-insights-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Decision Support
        </p>

        <h3
          id="ai-insights-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          AI Insights
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Key signals generated from current business intelligence.
        </p>
      </div>

      {aiInsights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No AI insights available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {aiInsights.map((item) => (
            <article
              key={item.title}
              className="min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-colors hover:border-cyan-500/20"
            >
              <h4 className="truncate text-sm font-semibold text-white">
                {item.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.value}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
