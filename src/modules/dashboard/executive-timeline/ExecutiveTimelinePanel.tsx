"use client";

import { Clock3, Circle } from "lucide-react";

import { executiveTimeline } from "./data";

export default function ExecutiveTimelinePanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-white/5 bg-slate-950/45 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
          <Clock3 className="h-4 w-4 text-cyan-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Executive Timeline
          </h3>
          <p className="text-[11px] text-slate-500">
            Recent leadership events and signals
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {executiveTimeline.map((item) => (
          <div
            key={`${item.time}-${item.event}`}
            className="flex min-w-0 gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.025]"
          >
            <div className="flex w-16 shrink-0 items-start gap-1.5 pt-0.5">
              <Circle className="mt-1 h-2 w-2 shrink-0 fill-cyan-400 text-cyan-400" />

              <span className="text-[10px] font-medium text-cyan-300">
                {item.time}
              </span>
            </div>

            <p className="min-w-0 text-xs leading-5 text-slate-300">
              {item.event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}