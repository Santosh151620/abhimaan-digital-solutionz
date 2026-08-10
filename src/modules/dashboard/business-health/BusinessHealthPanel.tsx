"use client";

import { businessHealth } from "./data";

export default function BusinessHealthPanel() {
  return (
    <section
      aria-labelledby="business-health-title"
      className="group min-w-0 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:shadow-xl hover:shadow-emerald-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            Business Intelligence
          </p>

          <h2
            id="business-health-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            Business Health
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Key operating areas and their current status.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
        />
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {businessHealth.length > 0 ? (
          businessHealth.map((item) => (
            <div
              key={item.name}
              className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-950 sm:px-4"
            >
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {item.name}
              </p>

              <p className="mt-1.5 truncate text-sm font-bold text-emerald-400 sm:text-base">
                {item.status || "No data"}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-400">
              No business health data available
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Health indicators will appear when operational data is
              available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}