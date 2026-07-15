"use client";

import { revenueIntelligence } from "./data";

export default function RevenueIntelligencePanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Revenue Intelligence
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {revenueIntelligence.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-2xl font-bold text-emerald-400">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}





