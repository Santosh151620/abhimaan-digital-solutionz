$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\business-health\data.ts"=@'
export const businessHealth=[
 {name:"Sales",status:"Excellent"},
 {name:"Marketing",status:"Healthy"},
 {name:"Support",status:"Stable"},
 {name:"Operations",status:"Optimal"}
];
'@

"src\modules\dashboard\business-health\BusinessHealthPanel.tsx"=@'
"use client";

import { businessHealth } from "./data";

export default function BusinessHealthPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Business Health
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {businessHealth.map((item)=>(

      <div
        key={item.name}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.name}
        </div>

        <div className="mt-2 text-lg font-bold text-emerald-400">
          {item.status}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\business-health\index.ts"=@'
export { default as BusinessHealthPanel } from "./BusinessHealthPanel";
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

Write-Host "Business Health module created."