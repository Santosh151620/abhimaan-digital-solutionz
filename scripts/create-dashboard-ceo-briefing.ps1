$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\ceo-briefing\data.ts"=@'
export const ceoBriefing=[
 {title:"Revenue",summary:"Quarter pacing ahead by 18%."},
 {title:"Pipeline",summary:"Enterprise opportunities continue to grow."},
 {title:"Risk",summary:"No critical operational risks detected."},
 {title:"AI Focus",summary:"Prioritize top renewal accounts this week."}
];
'@

"src\modules\dashboard\ceo-briefing\CEOBriefingPanel.tsx"=@'
"use client";

import { ceoBriefing } from "./data";

export default function CEOBriefingPanel(){

 return(

  <section className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-amber-400">
    CEO Daily Briefing
   </h3>

   <div className="space-y-4">

    {ceoBriefing.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="font-semibold text-white">
          {item.title}
        </div>

        <div className="mt-2 text-sm text-slate-300">
          {item.summary}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\ceo-briefing\index.ts"=@'
export { default as CEOBriefingPanel } from "./CEOBriefingPanel";
'@

}

foreach($f in $files.Keys){

 $d=Split-Path $f

 if(!(Test-Path $d)){
  New-Item -ItemType Directory -Force -Path $d|Out-Null
 }

 Set-Content -LiteralPath $f -Value $files[$f]

 Write-Host "Created $f"

}

Write-Host "CEO Briefing created."