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





