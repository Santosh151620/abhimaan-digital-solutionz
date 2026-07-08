$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\kpi-trends\data.ts"=@'
export const kpiTrends=[
 {name:"Revenue",trend:"+18%"},
 {name:"Leads",trend:"+11%"},
 {name:"Conversion",trend:"+7%"},
 {name:"Retention",trend:"+5%"}
];
'@

"src\modules\dashboard\kpi-trends\KPITrendsPanel.tsx"=@'
"use client";

import { kpiTrends } from "./data";

export default function KPITrendsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    KPI Trends
   </h3>

   <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

    {kpiTrends.map((k)=>(

     <div
      key={k.name}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
     >
      <div className="text-sm text-slate-400">{k.name}</div>

      <div className="mt-2 text-xl font-bold text-teal-400">
       {k.trend}
      </div>

     </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\kpi-trends\index.ts"=@'
export { default as KPITrendsPanel } from "./KPITrendsPanel";
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

Write-Host "KPI Trends created."