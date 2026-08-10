"use client";

import { Gauge, Target } from "lucide-react";

import { executiveScorecard } from "./data";

export default function ExecutiveScorecardPanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-indigo-400/15 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-400/5">
          <Gauge className="h-4 w-4 text-indigo-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Executive Scorecard
          </h3>
          <p className="text-[11px] text-slate-500">
            Leadership performance indicators
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {executiveScorecard.map((item) => (
          <div
            key={item.title}
            className="min-w-0 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 shrink-0 text-indigo-400/70" />
              <p className="truncate text-[11px] font-medium text-slate-500">
                {item.title}
              </p>
            </div>

            <p className="mt-2 truncate text-xl font-bold tracking-tight text-white">
              {item.score}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}