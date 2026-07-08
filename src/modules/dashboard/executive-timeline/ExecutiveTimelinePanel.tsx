"use client";

import { executiveTimeline } from "./data";

export default function ExecutiveTimelinePanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Executive Timeline
   </h3>

   <div className="space-y-3">

    {executiveTimeline.map((item)=>(

      <div
        key={item.time}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-cyan-400">
          {item.time}
        </div>

        <div className="mt-1 text-sm text-slate-200">
          {item.event}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
