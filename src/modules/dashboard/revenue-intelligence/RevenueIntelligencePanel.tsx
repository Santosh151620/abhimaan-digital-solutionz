"use client";

import { revenueIntelligence } from "./data";

export default function RevenueIntelligencePanel() {
  const hasData = revenueIntelligence.length > 0;

  return (
    <section
      aria-labelledby="revenue-intelligence-title"
      className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          Revenue Signals
        </p>

        <h3
          id="revenue-intelligence-title"
          className="mt-1 text-base font-semibold text-white"
        >
          Revenue Intelligence
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Key indicators supporting revenue planning and decision-making.
        </p>
      </div>

      {hasData ? (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {revenueIntelligence.map((item) => (
            <article
              key={item.title}
              className="group min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/20"
            >
              <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.title}
              </p>

              <p className="mt-3 truncate text-2xl font-bold tracking-tight text-emerald-300">
                {item.value}
              </p>

              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800"
                aria-hidden="true"
              >
                <div className="h-full w-2/3 rounded-full bg-emerald-500/60" />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-7 text-center">
          <p className="text-sm font-medium text-slate-400">
            No revenue intelligence available
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Revenue indicators will appear when financial and pipeline data is
            available.
          </p>
        </div>
      )}
    </section>
  );
}
