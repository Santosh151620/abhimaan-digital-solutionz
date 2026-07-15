"use client";

import { revenueTimeline } from "./data";

export default function RevenueTimelinePanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Revenue Timeline
      </h3>

      <div className="space-y-3">

        {revenueTimeline.map((item)=>(

          <div
            key={item.month}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
          >

            <span className="text-slate-300">
              {item.month}
            </span>

            <span className="font-bold text-emerald-400">
              ₹{item.value.toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    </section>

  );

}





