$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\command-center\data.ts"=@'
export const commandCenter=[
 {title:"Critical Alerts",value:"2"},
 {title:"Pending Approvals",value:"5"},
 {title:"AI Actions",value:"8"},
 {title:"Automations",value:"14"}
];
'@

"src\modules\dashboard\command-center\CommandCenterPanel.tsx"=@'
"use client";

import { commandCenter } from "./data";

export default function CommandCenterPanel(){

 return(

  <section className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-cyan-400">
    Command Center
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {commandCenter.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-2xl font-bold text-white">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\command-center\index.ts"=@'
export { default as CommandCenterPanel } from "./CommandCenterPanel";
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

Write-Host "Command Center created."