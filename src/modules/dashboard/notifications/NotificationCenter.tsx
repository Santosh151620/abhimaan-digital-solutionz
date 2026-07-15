"use client";

import { dashboardNotifications } from "./data";

export default function NotificationCenter(){

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

<h3 className="mb-4 text-lg font-semibold text-white">
Notifications
</h3>

<div className="space-y-3">

{dashboardNotifications.map(item=>(

<div
key={item.id}
className="rounded-xl border border-slate-800 p-3"
>

<div className="font-medium text-white">
{item.title}
</div>

<div className="text-sm text-slate-400">
{item.description}
</div>

<div className="text-xs text-slate-500 mt-2">
{item.createdAt}
</div>

</div>

))}

</div>

</div>

);

}





