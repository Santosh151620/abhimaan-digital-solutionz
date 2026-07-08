$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\executive\data.ts"=@'
export const executiveMetrics=[
 {label:"MRR",value:"₹18.2L"},
 {label:"ARR",value:"₹2.18Cr"},
 {label:"Cash Flow",value:"Healthy"},
 {label:"Growth",value:"+24%"}
];
'@

"src\modules\dashboard\executive\ExecutiveMetricsPanel.tsx"=@'
"use client";

import { executiveMetrics } from "./data";

export default function ExecutiveMetricsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Executive Metrics
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {executiveMetrics.map((m)=>(

     <div
      key={m.label}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
     >
      <div className="text-xs text-slate-400">
       {m.label}
      </div>

      <div className="mt-2 text-2xl font-bold text-emerald-400">
       {m.value}
      </div>

     </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\executive\index.ts"=@'
export { default as ExecutiveMetricsPanel } from "./ExecutiveMetricsPanel";
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

Write-Host "Executive module created."