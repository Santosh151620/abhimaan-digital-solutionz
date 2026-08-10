"use client";

import { recentLeads } from "./data";

export default function RecentLeadsPanel() {
  return (
    <section
      aria-labelledby="recent-leads-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            CRM Activity
          </p>

          <h3
            id="recent-leads-heading"
            className="mt-1 text-base font-semibold text-white"
          >
            Recent Leads
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Latest lead activity across the CRM workspace.
          </p>
        </div>

        <span
          aria-label={`${recentLeads.length} recent leads`}
          className="shrink-0 rounded-full border border-slate-700/80 bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold text-slate-400"
        >
          {recentLeads.length}
        </span>
      </div>

      {recentLeads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No recent leads available.
          </p>

          <p className="mt-1 text-xs text-slate-600">
            New CRM leads will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentLeads.map((lead, index) => (
            <article
              key={`${lead.name}-${index}`}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 transition duration-200 hover:border-cyan-500/20 hover:bg-slate-950"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {lead.name}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">
                  Recent CRM lead
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                {lead.status}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
