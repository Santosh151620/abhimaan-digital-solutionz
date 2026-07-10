"use client";

import { goals } from "./data";

export default function GoalTrackerPanel(){

 return(
  <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

   <h3 className="mb-5 text-lg font-bold text-white">
    Goal Tracker
   </h3>

   <div className="space-y-4">

    {goals.map((g)=>(
      <div key={g.goal}>

        <div className="mb-1 flex justify-between text-sm">
          <span>{g.goal}</span>
          <span>{g.progress}%</span>
        </div>

        <div className="h-2 rounded bg-slate-800">
          <div
            className="h-2 rounded bg-emerald-500"
            style={{width:`${g.progress}%`}}
          />
        </div>

      </div>
    ))}

   </div>

  </section>
 );

}
