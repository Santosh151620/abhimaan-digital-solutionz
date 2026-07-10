"use client";

import { marketIntelligence } from "./data";

export default function MarketIntelligencePanel(){

 return(

  <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-sky-400">
    Market Intelligence
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {marketIntelligence.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-xl font-bold text-white">
          {item.value}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}
