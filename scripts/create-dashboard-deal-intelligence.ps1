$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\deal-intelligence\data.ts"=@'
export const dealIntelligence=[
 {deal:"Enterprise Upgrade",score:"97"},
 {deal:"Healthcare CRM",score:"94"},
 {deal:"Manufacturing Suite",score:"91"},
 {deal:"Retail Expansion",score:"88"}
];
'@

"src\modules\dashboard\deal-intelligence\DealIntelligencePanel.tsx"=@'
"use client";

import { dealIntelligence } from "./data";

export default function DealIntelligencePanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-white">
    Deal Intelligence
   </h3>

   <div className="space-y-3">

    {dealIntelligence.map((d)=>(

      <div
        key={d.deal}
        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <span className="font-medium text-white">
          {d.deal}
        </span>

        <span className="font-bold text-emerald-400">
          {d.score}
        </span>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\deal-intelligence\index.ts"=@'
export { default as DealIntelligencePanel } from "./DealIntelligencePanel";
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

Write-Host "Deal Intelligence module created."