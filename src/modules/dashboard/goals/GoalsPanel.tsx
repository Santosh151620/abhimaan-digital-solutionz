"use client";

import { goals } from "./data";

export default function GoalsPanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Business Goals
      </h3>

      <div className="space-y-4">

        {goals.map((goal)=>(

          <div key={goal.name}>

            <div className="mb-1 flex justify-between text-sm">

              <span className="text-slate-300">
                {goal.name}
              </span>

              <span className="text-teal-400">
                {goal.progress}%
              </span>

            </div>

            <div className="h-2 rounded bg-slate-800">

              <div
                className="h-2 rounded bg-teal-500"
                style={{
                  width:`${goal.progress}%`
                }}
              />

            </div>

            <div className="mt-1 text-xs text-slate-500">
              Target: {goal.target}
            </div>

          </div>

        ))}

      </div>

    </section>

  );

}





