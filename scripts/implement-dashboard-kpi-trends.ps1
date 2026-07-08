$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\kpi-trends"

@'
export const kpiTrends = [
  { label:"Leads", value:"+18%" },
  { label:"Revenue", value:"+11%" },
  { label:"Conversion", value:"+7%" },
  { label:"Retention", value:"+5%" }
];
'@ | Set-Content "$dir\data.ts"

@'
"use client";

import { kpiTrends } from "./data";

export default function KPITrendsPanel() {

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        KPI Trends
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">

        {kpiTrends.map((item)=>(

          <div
            key={item.label}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="text-sm text-slate-400">
              {item.label}
            </div>

            <div className="mt-2 text-2xl font-bold text-emerald-400">
              {item.value}
            </div>
          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\KPITrendsPanel.tsx"

@'
export { default as KPITrendsPanel } from "./KPITrendsPanel";
'@ | Set-Content "$dir\index.ts"

Write-Host "KPI Trends implemented."