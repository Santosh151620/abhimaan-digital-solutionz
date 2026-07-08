$ErrorActionPreference="Stop"

$root=(Get-Location).Path
$dir=Join-Path $root "src\modules\dashboard\team-performance"

@'
export const teamPerformance = [
  { name:"Sales", value:92 },
  { name:"Marketing", value:87 },
  { name:"Support", value:95 },
  { name:"Development", value:90 }
];
'@ | Set-Content (Join-Path $dir "data.ts")

@'
"use client";

import { teamPerformance } from "./data";

export default function TeamPerformancePanel() {

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Team Performance
      </h3>

      <div className="space-y-4">

        {teamPerformance.map((item)=>(

          <div key={item.name}>

            <div className="mb-1 flex justify-between text-sm">
              <span className="text-white">{item.name}</span>
              <span className="text-teal-400">{item.value}%</span>
            </div>

            <div className="h-2 rounded bg-slate-800">
              <div
                className="h-2 rounded bg-teal-500"
                style={{ width: item.value + "%" }}
              />
            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content (Join-Path $dir "TeamPerformancePanel.tsx")

@'
export { default as TeamPerformancePanel } from "./TeamPerformancePanel";
'@ | Set-Content (Join-Path $dir "index.ts")

Write-Host "Team Performance implemented."