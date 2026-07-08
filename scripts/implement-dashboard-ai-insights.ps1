$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\ai"

@'
export const aiInsights = [
  {
    title:"Follow up overdue",
    value:"12 leads require follow-up today"
  },
  {
    title:"High-value opportunity",
    value:"3 enterprise deals above target value"
  },
  {
    title:"Revenue forecast",
    value:"Forecast indicates +18% this month"
  }
];
'@ | Set-Content "$dir\data.ts"

@'
"use client";

import { aiInsights } from "./data";

export default function AIInsightsPanel() {

  return (

    <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-cyan-300">
        AI Insights
      </h3>

      <div className="space-y-3">

        {aiInsights.map((item)=>(

          <div
            key={item.title}
            className="rounded-lg border border-slate-800 bg-slate-950 p-3"
          >

            <div className="font-semibold text-white">
              {item.title}
            </div>

            <div className="text-sm text-slate-400">
              {item.value}
            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\AIInsightsPanel.tsx"

@'
export { default as AIInsightsPanel } from "./AIInsightsPanel";
'@ | Set-Content "$dir\index.ts"

Write-Host "AI Insights implemented."