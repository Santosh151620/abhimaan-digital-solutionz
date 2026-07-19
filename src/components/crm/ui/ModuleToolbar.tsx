"use client";

import { Plus, Search } from "lucide-react";

interface Props {

title:string;

buttonText:string;

onCreate?:()=>void;

children?:React.ReactNode;

}

export default function ModuleToolbar({

buttonText,

onCreate,

children

}:Props){

return(

<div className="crm-toolbar flex flex-wrap items-center justify-between gap-4 p-4">

<div className="relative w-full max-w-md">

<Search
size={18}
className="absolute left-3 top-3 text-slate-400"
/>

<input

placeholder="Search..."

className="crm-input pl-10"

/>

</div>

<div className="flex gap-3">

{children}

<button

onClick={onCreate}

className="crm-button flex items-center gap-2"

>

<Plus size={18}/>

{buttonText}

</button>

</div>

</div>

);

}