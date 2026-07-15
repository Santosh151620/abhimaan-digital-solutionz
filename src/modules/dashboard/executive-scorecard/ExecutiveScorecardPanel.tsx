"use client";

import { executiveScorecard } from "./data";

export default function ExecutiveScorecardPanel(){

 return(

  <section className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-indigo-400">
    Executive Scorecard
   </h3>

   <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {executiveScorecard.map((item)=>(

      <div
        key={item.title}
        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
      >
        <div className="text-xs text-slate-400">
          {item.title}
        </div>

        <div className="mt-2 text-3xl font-bold text-white">
          {item.score}
        </div>

      </div>

    ))}

   </div>

  </section>

 );

}





