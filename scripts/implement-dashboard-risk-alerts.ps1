$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\risk-alerts"

if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

@'
export const riskAlerts = [
  {
    title:"Pipeline slowdown detected",
    severity:"High",
    detail:"Multiple opportunities have exceeded expected follow-up time."
  },
  {
    title:"Lead response delay",
    severity:"Medium",
    detail:"New inbound leads require faster engagement."
  },
  {
    title:"Revenue target variance",
    severity:"Low",
    detail:"Current trajectory is below monthly forecast."
  }
];
'@ | Set-Content "$dir\data.ts"


@'
"use client";

import { riskAlerts } from "./data";

export default function RiskAlertsPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        AI Risk Alerts
      </h3>

      <div className="space-y-3">

        {riskAlerts.map((alert)=>(

          <div
            key={alert.title}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >

            <div className="flex justify-between">

              <span className="font-semibold text-white">
                {alert.title}
              </span>

              <span className="text-xs text-amber-400">
                {alert.severity}
              </span>

            </div>

            <p className="mt-2 text-sm text-slate-400">
              {alert.detail}
            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\RiskAlertsPanel.tsx"


@'
export { default as RiskAlertsPanel } from "./RiskAlertsPanel";
'@ | Set-Content "$dir\index.ts"


Write-Host "Risk Alerts implemented."