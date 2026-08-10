"use client";

import { Activity, Command } from "lucide-react";

import { commandCenter } from "./data";

export default function CommandCenterPanel() {
  return (
    <section className="min-w-0 rounded-2xl border border-cyan-400/15 bg-slate-950/50 p-4 shadow-lg shadow-cyan-950/10 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/5">
          <Command className="h-4 w-4 text-cyan-300" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Command Center
          </h3>
          <p className="text-[11px] text-slate-500">
            Current executive operating signals
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {commandCenter.map((item) => (
          <div
            key={item.title}
            className="min-w-0 rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 shrink-0 text-cyan-400/70" />
              <p className="truncate text-[11px] font-medium text-slate-500">
                {item.title}
              </p>
            </div>

            <p className="mt-2 truncate text-xl font-bold tracking-tight text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}