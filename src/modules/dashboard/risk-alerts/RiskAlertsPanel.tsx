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





