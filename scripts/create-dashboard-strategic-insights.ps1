$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\strategic-insights\data.ts"=@'
export const strategicInsights=[
 {title:"Revenue Outlook",detail:"Growth trajectory remains above quarterly target."},
 {title:"Pipeline Quality",detail:"Enterprise opportunities increased by 18%."},
 {title:"AI Recommendation",detail:"Prioritize high-value renewals this week."},
 {title:"Executive Focus",detail:"Expand partner-led opportunities in Q3."}
];
'@

"src\modules\dashboard\strategic-insights\StrategicInsightsPanel.tsx"=@'
"use client";

import { strategicInsights } from "./data";

export default function StrategicInsightsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-white">
    Strategic Insights
   </h3>

   <div className="space-y-4">

    {strategicInsights.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="font-semibold text-cyan-400">
          {item.title}
        </div>

        <div className="mt-2 text-sm text-slate-300">
          {item.detail}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\strategic-insights\index.ts"=@'
export { default as StrategicInsightsPanel } from "./StrategicInsightsPanel";
'@

}

foreach($file in $files.Keys){

 $dir=Split-Path $file

 if(!(Test-Path $dir)){
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
 }

 Set-Content -LiteralPath $file -Value $files[$file]

 Write-Host "Created $file"

}

Write-Host "Strategic Insights created."