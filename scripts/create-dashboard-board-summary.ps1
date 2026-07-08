$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\board-summary\data.ts"=@'
export const boardSummary=[
 {title:"Revenue",value:"Ahead of target"},
 {title:"Profitability",value:"Healthy"},
 {title:"Growth",value:"+24% YoY"},
 {title:"Strategic Risk",value:"Low"}
];
'@

"src\modules\dashboard\board-summary\BoardSummaryPanel.tsx"=@'
"use client";

import { boardSummary } from "./data";

export default function BoardSummaryPanel(){

 return(

  <section className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-emerald-400">
    Board Summary
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {boardSummary.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-lg font-bold text-white">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\board-summary\index.ts"=@'
export { default as BoardSummaryPanel } from "./BoardSummaryPanel";
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

Write-Host "Board Summary created."