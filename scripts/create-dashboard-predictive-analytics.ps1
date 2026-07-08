$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\predictive-analytics\data.ts"=@'
export const predictiveAnalytics=[
 {metric:"Revenue Confidence",value:"94%"},
 {metric:"Forecast Risk",value:"Low"},
 {metric:"Growth Probability",value:"89%"},
 {metric:"Expansion Potential",value:"High"}
];
'@

"src\modules\dashboard\predictive-analytics\PredictiveAnalyticsPanel.tsx"=@'
"use client";

import { predictiveAnalytics } from "./data";

export default function PredictiveAnalyticsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Predictive Analytics
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {predictiveAnalytics.map((item)=>(

      <div
        key={item.metric}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.metric}
        </div>

        <div className="mt-2 text-2xl font-bold text-amber-400">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\predictive-analytics\index.ts"=@'
export { default as PredictiveAnalyticsPanel } from "./PredictiveAnalyticsPanel";
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

Write-Host "Predictive Analytics module created."