"use client";

import { dealIntelligence } from "./data";

export default function DealIntelligencePanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-white">
    Deal Intelligence
   </h3>

   <div className="space-y-3">

    {dealIntelligence.map((d)=>(

      <div
        key={d.deal}
        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <span className="font-medium text-white">
          {d.deal}
        </span>

        <span className="font-bold text-emerald-400">
          {d.score}
        </span>

      </div>

    ))}

   </div>

  </section>

 );

}





