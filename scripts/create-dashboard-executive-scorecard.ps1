$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\executive-scorecard\data.ts"=@'
export const executiveScorecard=[
 {title:"Revenue",score:"98"},
 {title:"Growth",score:"95"},
 {title:"Customer Success",score:"96"},
 {title:"Operations",score:"94"}
];
'@

"src\modules\dashboard\executive-scorecard\ExecutiveScorecardPanel.tsx"=@'
"use client";

import { executiveScorecard } from "./data";

export default function ExecutiveScorecardPanel(){

 return(

  <section className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-indigo-400">
    Executive Scorecard
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {executiveScorecard.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-3xl font-bold text-white">
          {item.score}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\executive-scorecard\index.ts"=@'
export { default as ExecutiveScorecardPanel } from "./ExecutiveScorecardPanel";
'@

}

foreach($f in $files.Keys){

 $d=Split-Path $f

 if(!(Test-Path $d)){
  New-Item -ItemType Directory -Force -Path $d | Out-Null
 }

 Set-Content -LiteralPath $f -Value $files[$f]

 Write-Host "Created $f"

}

Write-Host "Executive Scorecard created."