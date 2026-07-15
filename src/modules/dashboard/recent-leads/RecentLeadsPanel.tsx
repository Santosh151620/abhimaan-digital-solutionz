"use client";

import { recentLeads } from "./data";

export default function RecentLeadsPanel() {

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Recent Leads
      </h3>

      <div className="space-y-3">

        {recentLeads.map((lead)=>(

          <div
            key={lead.name}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
          >

            <span className="text-white">
              {lead.name}
            </span>

            <span className="text-xs text-teal-400">
              {lead.status}
            </span>

          </div>

        ))}

      </div>

    </section>

  );

}





