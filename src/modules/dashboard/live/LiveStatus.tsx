"use client";

export default function LiveStatus(){

const items=[
"CRM Online",
"API Healthy",
"Email Connected",
"Payments Online"
];

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

<h3 className="mb-4 text-lg font-semibold text-white">
System Status
</h3>

<div className="space-y-2">

{items.map(item=>(

<div
key={item}
className="flex items-center justify-between rounded-lg border border-slate-800 p-2"
>

<span className="text-slate-300">
{item}
</span>

<span className="text-emerald-400">
●
</span>

</div>

))}

</div>

</div>

);

}
