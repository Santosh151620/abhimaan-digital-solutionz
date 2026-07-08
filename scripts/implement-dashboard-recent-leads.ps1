$ErrorActionPreference="Stop"

$root=(Get-Location).Path
$dir=Join-Path $root "src\modules\dashboard\recent-leads"

@'
export const recentLeads = [
  { name:"Acme Pvt Ltd", status:"New" },
  { name:"Vertex Industries", status:"Qualified" },
  { name:"Nova Tech", status:"Proposal" },
  { name:"Skyline Group", status:"Follow-up" },
  { name:"Future Labs", status:"Won" }
];
'@ | Set-Content (Join-Path $dir "data.ts")

@'
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
'@ | Set-Content (Join-Path $dir "RecentLeadsPanel.tsx")

@'
export { default as RecentLeadsPanel } from "./RecentLeadsPanel";
'@ | Set-Content (Join-Path $dir "index.ts")

Write-Host "Recent Leads implemented."