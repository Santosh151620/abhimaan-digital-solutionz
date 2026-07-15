"use client";

import { useMemo, useState } from "react";

import CommandPaletteModal from "./CommandPaletteModal";
import { useCommandPalette } from "./CommandPaletteContext";
import { commandRegistry } from "./commands";

export default function CommandPalette() {

const { open, setOpen } = useCommandPalette();

const [query,setQuery]=useState("");

const commands=useMemo(()=>{

return commandRegistry.filter(c=>{

const text=[
c.title,
c.subtitle,
c.group,
...(c.keywords ?? [])
].join(" ").toLowerCase();

return text.includes(query.toLowerCase());

});

},[query]);

return(

<CommandPaletteModal open={open} onClose={() => setOpen(false)}>

<div className="border-b border-slate-800 p-4">

<input
autoFocus
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search..."
className="w-full bg-transparent text-white outline-none"
/>

<div className="mt-2 text-xs text-slate-500">
{commands.length} commands
</div>

</div>

<div className="max-h-[520px] overflow-auto p-2">

{commands.length===0 && (

<div className="p-6 text-center text-slate-500">
No commands found.
</div>

)}

{commands.map(cmd=>(

<div key={cmd.id}>

<div className="mb-1 mt-4 text-[10px] uppercase tracking-wider text-slate-500">
{cmd.group}
</div>

<button
onClick={cmd.run}
className="w-full rounded-xl border border-transparent p-3 text-left hover:border-slate-700 hover:bg-slate-900"
>

<div className="flex items-center justify-between">

<div>

<div className="font-semibold text-white">

{cmd.icon ?? "•"} {cmd.title}

{cmd.badge && (
<span className="ml-2 rounded bg-teal-600 px-2 py-0.5 text-[10px]">
{cmd.badge}
</span>
)}

</div>

<div className="text-xs text-slate-400">
{cmd.subtitle}
</div>

</div>

<div className="text-[10px] text-slate-500">
{cmd.shortcut}
</div>

</div>

</button>

</div>

))}

</div>

</CommandPaletteModal>

);

}





