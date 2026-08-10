"use client";

import { salesVelocity } from "./data";

export default function SalesVelocityPanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-violet-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
          Sales Performance
        </p>

        <h3 className="mt-1 text-base font-semibold text-white">
          Sales Velocity
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Indicators showing the speed and efficiency of sales execution.
        </p>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {salesVelocity.map((item) => (
          <article
            key={item.label}
            className="group min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:border-violet-400/20"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.label}
              </p>

              <span
                aria-hidden="true"
                className="text-violet-400"
              >
                ↗
              </span>
            </div>

            <p className="mt-3 truncate text-2xl font-bold tracking-tight text-violet-300">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
