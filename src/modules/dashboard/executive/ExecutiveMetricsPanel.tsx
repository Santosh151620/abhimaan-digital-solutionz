"use client";

import { executiveMetrics } from "./data";

export default function ExecutiveMetricsPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Executive Metrics
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {executiveMetrics.map((m)=>(

     <div
      key={m.label}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
     >
      <div className="text-xs text-slate-400">
       {m.label}
      </div>

      <div className="mt-2 text-2xl font-bold text-emerald-400">
       {m.value}
      </div>

     </div>

    ))}

   </div>

  </section>

 );

}
