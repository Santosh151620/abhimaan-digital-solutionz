$ErrorActionPreference="Stop"

$files=@{

"src\modules\dashboard\automation\data.ts"=@'
export const automationRules = [
  {
    title:"Lead Follow-up Automation",
    status:"Active",
    action:"Auto reminder after 24 hours"
  },
  {
    title:"Pipeline Monitoring",
    status:"Active",
    action:"Detect stalled opportunities"
  },
  {
    title:"Revenue Alert Automation",
    status:"Active",
    action:"Notify when targets shift"
  }
];
'@

"src\modules\dashboard\automation\AutomationPanel.tsx"=@'
"use client";

import { automationRules } from "./data";

export default function AutomationPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        CRM Automation Engine
      </h3>

      <div className="space-y-3">

        {automationRules.map((rule)=>(

          <div
            key={rule.title}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >

            <div className="flex justify-between">

              <span className="font-semibold text-white">
                {rule.title}
              </span>

              <span className="text-xs text-emerald-400">
                {rule.status}
              </span>

            </div>

            <p className="mt-2 text-sm text-slate-400">
              {rule.action}
            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
'@

"src\modules\dashboard\automation\index.ts"=@'
export { default as AutomationPanel } from "./AutomationPanel";
'@

}


foreach($file in $files.Keys){

    $directory=Split-Path $file

    if(!(Test-Path $directory)){
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    Set-Content -LiteralPath $file -Value $files[$file]

    Write-Host "Created $file"

}


Write-Host "Dashboard Automation files created."