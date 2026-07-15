"use client";

import { aiRecommendations } from "./data";

export default function AIRecommendationsPanel(){

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        AI Recommendations
      </h3>

      <div className="space-y-3">

        {aiRecommendations.map((item)=>(

          <div
            key={item.title}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >

            <div className="flex justify-between">

              <h4 className="font-semibold text-white">
                {item.title}
              </h4>

              <span className="text-xs text-emerald-400">
                {item.priority}
              </span>

            </div>

            <p className="mt-2 text-sm text-slate-400">
              {item.impact}
            </p>

          </div>

        ))}

      </div>

    </section>
  );

}





