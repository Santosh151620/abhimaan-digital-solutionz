"use client";

import { recentLeads } from "./data";

export default function RecentLeadsPanel() {
  return (
    <section
      aria-labelledby="recent-leads-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            CRM Activity
          </p>

          <h3
            id="recent-leads-heading"
            className="mt-1 text-lg font-bold text-white"
          >
            Recent Leads
          </h3>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-medium text-slate-400">
          {recentLeads.length}
        </span>
      </div>

      {recentLeads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-6 text-center">
          <p className="text-sm text-slate-400">
            No recent leads available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentLeads.map((lead, index) => (
            <div
              key={`${lead.name}-${index}`}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {lead.name}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Recent CRM lead
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-400">
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}