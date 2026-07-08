$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\sales-funnel"

@'
export const salesFunnel = [
  { stage:"New Leads", count:120 },
  { stage:"Qualified", count:78 },
  { stage:"Proposal", count:42 },
  { stage:"Negotiation", count:18 },
  { stage:"Closed", count:12 }
];
'@ | Set-Content "$dir\data.ts"

@'
"use client";

import { salesFunnel } from "./data";

export default function SalesFunnelPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Sales Funnel
      </h3>

      <div className="space-y-3">

        {salesFunnel.map((item)=>(

          <div
            key={item.stage}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
          >

            <span className="text-slate-300">
              {item.stage}
            </span>

            <span className="font-bold text-teal-400">
              {item.count}
            </span>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\SalesFunnelPanel.tsx"

@'
export { default as SalesFunnelPanel } from "./SalesFunnelPanel";
'@ | Set-Content "$dir\index.ts"

Write-Host "Sales Funnel implemented."