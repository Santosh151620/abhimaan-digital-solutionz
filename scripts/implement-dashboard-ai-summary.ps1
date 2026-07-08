$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\ai-summary"

if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

@'
export const aiSummary = {
  headline:"Business performance is stable with growth opportunities identified.",
  insights:[
    "Pipeline quality improved this month.",
    "High-value leads require immediate attention.",
    "Revenue trend is moving toward target."
  ]
};
'@ | Set-Content "$dir\data.ts"


@'
"use client";

import { aiSummary } from "./data";

export default function AISummaryPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-3 text-lg font-bold text-white">
        AI Executive Summary
      </h3>

      <p className="mb-4 text-sm text-slate-300">
        {aiSummary.headline}
      </p>

      <div className="space-y-2">

        {aiSummary.insights.map((item)=>(

          <div
            key={item}
            className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300"
          >
            {item}
          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\AISummaryPanel.tsx"


@'
export { default as AISummaryPanel } from "./AISummaryPanel";
'@ | Set-Content "$dir\index.ts"


Write-Host "AI Summary implemented."