"use client";

import { ceoBriefing } from "./data";

export default function CEOBriefingPanel(){

 return(

  <section className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-amber-400">
    CEO Daily Briefing
   </h3>

   <div className="space-y-4">

    {ceoBriefing.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="font-semibold text-white">
          {item.title}
        </div>

        <div className="mt-2 text-sm text-slate-300">
          {item.summary}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
