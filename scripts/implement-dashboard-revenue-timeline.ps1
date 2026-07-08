$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\revenue-timeline"

@'
export const revenueTimeline = [
  { month:"Jan", value:45000 },
  { month:"Feb", value:52000 },
  { month:"Mar", value:61000 },
  { month:"Apr", value:73000 },
  { month:"May", value:82000 }
];
'@ | Set-Content "$dir\data.ts"

@'
"use client";

import { revenueTimeline } from "./data";

export default function RevenueTimelinePanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Revenue Timeline
      </h3>

      <div className="space-y-3">

        {revenueTimeline.map((item)=>(

          <div
            key={item.month}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
          >

            <span className="text-slate-300">
              {item.month}
            </span>

            <span className="font-bold text-emerald-400">
              ₹{item.value.toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\RevenueTimelinePanel.tsx"

@'
export { default as RevenueTimelinePanel } from "./RevenueTimelinePanel";
'@ | Set-Content "$dir\index.ts"

Write-Host "Revenue Timeline implemented."