$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\insights\data.ts"=@'
export const insights=[
 {title:"Revenue Trend",value:"+18%"},
 {title:"Lead Velocity",value:"+12%"},
 {title:"Win Rate",value:"31%"},
 {title:"Forecast Accuracy",value:"92%"}
];
'@

"src\modules\dashboard\insights\InsightsPanel.tsx"=@'
"use client";

import { insights } from "./data";

export default function InsightsPanel(){

 return(
  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Business Insights
   </h3>

   <div className="grid gap-3 md:grid-cols-2">

    {insights.map((i)=>(

     <div
      key={i.title}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
     >
      <div className="text-sm text-slate-400">{i.title}</div>
      <div className="mt-2 text-2xl font-bold text-teal-400">
       {i.value}
      </div>
     </div>

    ))}

   </div>

  </section>
 );

}
'@

"src\modules\dashboard\insights\index.ts"=@'
export { default as InsightsPanel } from "./InsightsPanel";
'@

}

foreach($f in $files.Keys){

 $dir=Split-Path $f

 if(!(Test-Path $dir)){
   New-Item -ItemType Directory -Force -Path $dir|Out-Null
 }

 Set-Content -LiteralPath $f -Value $files[$f]

 Write-Host "Created $f"

}

Write-Host "Dashboard Insights created."