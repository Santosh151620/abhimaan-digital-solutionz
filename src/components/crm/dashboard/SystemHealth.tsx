const items=[

["API","Operational"],

["Database","Healthy"],

["Storage","Healthy"],

["Email","Connected"],

["Backup","Running"]

];

export default function SystemHealth(){

return(

<div className="rounded-3xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-bold">

System Health

</h2>

<div className="space-y-5">

{

items.map(([name,status])=>(

<div

key={name}

className="flex items-center justify-between"

>

<span className="font-medium">

{name}

</span>

<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

{status}

</span>

</div>

))

}

</div>

</div>

);

}