"use client";

import { Lightbulb, Sparkles } from "lucide-react";

import { ceoBriefing } from "./data";

export default function CEOBriefingPanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-amber-400/10 bg-slate-950/50 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/15 bg-amber-400/5">
          <Sparkles className="h-4 w-4 text-amber-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            CEO Daily Briefing
          </h3>
          <p className="text-[11px] text-slate-500">
            Leadership priorities and business signals
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {ceoBriefing.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
          >
            <div className="flex items-start gap-2.5">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" />

              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white">
                  {item.title}
                </h4>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}