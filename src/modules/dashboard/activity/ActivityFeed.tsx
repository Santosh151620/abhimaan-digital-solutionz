"use client";

import { dashboardActivities } from "./data";

export default function ActivityFeed(){

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

<h3 className="mb-4 text-lg font-semibold text-white">
Recent Activity
</h3>

<div className="space-y-3">

{dashboardActivities.map(item=>(

<div key={item.id} className="border-b border-slate-800 pb-2">

<div className="text-white">
{item.title}
</div>

<div className="text-xs text-slate-500">
{item.time}
</div>

</div>

))}

</div>

</div>

);

}
