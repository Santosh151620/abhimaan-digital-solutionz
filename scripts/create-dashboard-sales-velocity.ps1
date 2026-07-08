$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\sales-velocity\data.ts"=@'
export const salesVelocity=[
 {label:"Avg Sales Cycle",value:"21 Days"},
 {label:"Deals Closed",value:"146"},
 {label:"Velocity Score",value:"91"},
 {label:"Opportunity Growth",value:"+19%"}
];
'@

"src\modules\dashboard\sales-velocity\SalesVelocityPanel.tsx"=@'
"use client";

import { salesVelocity } from "./data";

export default function SalesVelocityPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Sales Velocity
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {salesVelocity.map((item)=>(

      <div
        key={item.label}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.label}
        </div>

        <div className="mt-2 text-2xl font-bold text-violet-400">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\sales-velocity\index.ts"=@'
export { default as SalesVelocityPanel } from "./SalesVelocityPanel";
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

Write-Host "Sales Velocity module created."