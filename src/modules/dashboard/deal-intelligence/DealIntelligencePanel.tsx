"use client";

import { dealIntelligence } from "./data";

export default function DealIntelligencePanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Opportunity Signals
        </p>

        <h3 className="mt-1 text-base font-semibold text-white">
          Deal Intelligence
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Current deal-level signals and opportunity quality indicators.
        </p>
      </div>

      <div className="space-y-2.5">
        {dealIntelligence.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center">
            <p className="text-xs text-slate-500">
              No deal intelligence available.
            </p>
          </div>
        ) : (
          dealIntelligence.map((deal) => (
            <article
              key={deal.deal}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/70 px-4 py-3.5 transition hover:border-cyan-400/20 hover:bg-slate-950"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {deal.deal}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Deal intelligence score
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-cyan-300">
                  {deal.score}
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-600">
                  Score
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
