"use client";

import { marketIntelligence } from "./data";

export default function MarketIntelligencePanel() {
  return (
    <section
      aria-labelledby="market-intelligence-title"
      className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3
          id="market-intelligence-title"
          className="text-lg font-bold text-sky-400"
        >
          Market Intelligence
        </h3>

        <span className="text-xs text-slate-500">
          Current signals
        </span>
      </div>

      {marketIntelligence.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 text-sm text-slate-500">
          No market intelligence is available right now.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketIntelligence.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-slate-700"
            >
              <div className="text-xs font-medium text-slate-400">
                {item.title}
              </div>

              <div className="mt-2 text-xl font-bold text-white">
                {item.value}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}