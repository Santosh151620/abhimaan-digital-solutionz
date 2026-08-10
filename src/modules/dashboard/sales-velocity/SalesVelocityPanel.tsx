"use client";

import { salesVelocity } from "./data";

export default function SalesVelocityPanel() {
  const hasData = salesVelocity.length > 0;

  return (
    <section
      aria-labelledby="sales-velocity-title"
      className="overflow-hidden rounded-2xl border border-violet-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
          Sales Performance
        </p>

        <h3
          id="sales-velocity-title"
          className="mt-1 text-base font-semibold text-white"
        >
          Sales Velocity
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Indicators showing the speed and efficiency of sales execution.
        </p>
      </div>

      {hasData ? (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {salesVelocity.map((item) => (
            <article
              key={item.label}
              className="group min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/20"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-violet-400"
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
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-7 text-center">
          <p className="text-sm font-medium text-slate-400">
            No sales velocity data available
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Sales execution indicators will appear when sufficient activity
            data is available.
          </p>
        </div>
      )}
    </section>
  );
}
