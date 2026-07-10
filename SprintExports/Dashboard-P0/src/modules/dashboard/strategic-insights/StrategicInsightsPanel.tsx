"use client";

import { strategicInsights } from "./data";

export default function StrategicInsightsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-white">
    Strategic Insights
   </h3>

   <div className="space-y-4">

    {strategicInsights.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="font-semibold text-cyan-400">
          {item.title}
        </div>

        <div className="mt-2 text-sm text-slate-300">
          {item.detail}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
