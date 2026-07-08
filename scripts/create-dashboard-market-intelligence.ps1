$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\market-intelligence\data.ts"=@'
export const marketIntelligence=[
 {title:"Industry Growth",value:"+12.8%"},
 {title:"Competitive Position","value":"Top 10%"},
 {title:"Market Share",value:"8.4%"},
 {title:"Demand Trend",value:"Increasing"}
'@

"src\modules\dashboard\market-intelligence\MarketIntelligencePanel.tsx"=@'
"use client";

import { marketIntelligence } from "./data";

export default function MarketIntelligencePanel(){

 return(

  <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-sky-400">
    Market Intelligence
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {marketIntelligence.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-xl font-bold text-white">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\market-intelligence\index.ts"=@'
export { default as MarketIntelligencePanel } from "./MarketIntelligencePanel";
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

Write-Host "Market Intelligence created."