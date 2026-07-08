$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\goals"

@'
export const goals = [
  { name:"Monthly Revenue", target:"₹10,00,000", progress:82 },
  { name:"New Customers", target:"100", progress:64 },
  { name:"Conversion Rate", target:"25%", progress:76 },
  { name:"Customer Retention", target:"95%", progress:91 }
];
'@ | Set-Content "$dir\data.ts"

@'
"use client";

import { goals } from "./data";

export default function GoalsPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Business Goals
      </h3>

      <div className="space-y-4">

        {goals.map((goal)=>(

          <div key={goal.name}>

            <div className="mb-1 flex justify-between text-sm">

              <span className="text-slate-300">
                {goal.name}
              </span>

              <span className="text-teal-400">
                {goal.progress}%
              </span>

            </div>

            <div className="h-2 rounded bg-slate-800">

              <div
                className="h-2 rounded bg-teal-500"
                style={{
                  width:`${goal.progress}%`
                }}
              />

            </div>

            <div className="mt-1 text-xs text-slate-500">
              Target: {goal.target}
            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\GoalsPanel.tsx"

@'
export { default as GoalsPanel } from "./GoalsPanel";
'@ | Set-Content "$dir\index.ts"

Write-Host "Goals implemented."