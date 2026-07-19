import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props{
title:string;
value:string;
change?:string;
icon:ReactNode;
color:string;
}

export default function KPICard({
title,
value,
change,
icon,
color
}:Props){

return(

<div className="
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-white/90
to-blue-50
backdrop-blur-xl
shadow-xl
p-6
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl">

<div className="flex items-center justify-between p-6">

<div>

<p className="text-sm font-medium text-slate-500">

{title}

</p>

<h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">

{value}

</h2>

{

change&&(

<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">

<ArrowUpRight size={15}/>

{change}

</div>

)

}

</div>

<div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${color}`}>

{icon}

</div>

</div>

<div className={`h-1 w-full ${color}`}/>

</div>

);

}