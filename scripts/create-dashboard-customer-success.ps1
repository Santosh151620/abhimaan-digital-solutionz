$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\customer-success\data.ts"=@'
export const customerSuccess=[
 {metric:"Health Score",value:"94%"},
 {metric:"NPS",value:"68"},
 {metric:"Renewals",value:"96%"},
 {metric:"Churn Risk",value:"Low"}
];
'@

"src\modules\dashboard\customer-success\CustomerSuccessPanel.tsx"=@'
"use client";

import { customerSuccess } from "./data";

export default function CustomerSuccessPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Customer Success
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {customerSuccess.map((item)=>(

      <div
        key={item.metric}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.metric}
        </div>

        <div className="mt-2 text-2xl font-bold text-cyan-400">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
'@

"src\modules\dashboard\customer-success\index.ts"=@'
export { default as CustomerSuccessPanel } from "./CustomerSuccessPanel";
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

Write-Host "Customer Success module created."