"use client";

import { BarChart3, BriefcaseBusiness } from "lucide-react";

import { boardSummary } from "./data";

export default function BoardSummaryPanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-400/10 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/5">
          <BriefcaseBusiness className="h-4 w-4 text-emerald-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Board Summary
          </h3>
          <p className="text-[11px] text-slate-500">
            High-level business position
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
        {boardSummary.map((item) => (
          <div
            key={item.title}
            className="min-w-0 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
              <p className="truncate text-[11px] font-medium text-slate-500">
                {item.title}
              </p>
            </div>

            <p className="mt-2 truncate text-lg font-bold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}