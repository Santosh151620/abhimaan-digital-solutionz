"use client";

import { dashboardActivities } from "./data";

export default function ActivityFeed() {
  return (
    <section
      aria-labelledby="activity-feed-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          CRM Activity
        </p>

        <h3
          id="activity-feed-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Recent Activity
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Latest business activities recorded in the CRM.
        </p>
      </div>

      {dashboardActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No recent activity available.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {dashboardActivities.map((item) => (
            <article
              key={item.id}
              className="relative rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-white/5 hover:bg-slate-950/60"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.45)]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.time}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
