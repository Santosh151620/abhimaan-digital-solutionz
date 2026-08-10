"use client";

import { aiSummary } from "./data";

export default function AISummaryPanel() {
  return (
    <section
      aria-labelledby="ai-summary-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Executive Intelligence
        </p>

        <h3
          id="ai-summary-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          AI Executive Summary
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          A concise interpretation of the current business signals.
        </p>
      </div>

      <div className="rounded-xl border border-cyan-500/10 bg-slate-950/70 p-4">
        <p className="text-sm font-semibold leading-6 text-slate-200">
          {aiSummary.headline}
        </p>
      </div>

      {aiSummary.insights.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            No additional AI insights available.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2.5">
          {aiSummary.insights.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/5 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-slate-300 transition-colors hover:border-cyan-500/15"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
