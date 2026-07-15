"use client";

import { businessHealth } from "./data";

export default function BusinessHealthPanel(){

 return(

  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-4 text-lg font-bold text-white">
    Business Health
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {businessHealth.map((item)=>(

      <div
        key={item.name}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.name}
        </div>

        <div className="mt-2 text-lg font-bold text-emerald-400">
          {item.status}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}





