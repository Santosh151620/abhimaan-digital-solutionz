"use client";

import { commandCenter } from "./data";

export default function CommandCenterPanel(){

 return(

  <section className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-cyan-400">
    Command Center
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {commandCenter.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-2xl font-bold text-white">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
