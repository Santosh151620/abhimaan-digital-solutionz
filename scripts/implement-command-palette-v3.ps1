$root = Get-Location

$dir = Join-Path $root "src\components\command-palette"

New-Item -ItemType Directory -Force -Path $dir | Out-Null

# -----------------------------
# types.ts
# -----------------------------
@'
export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  group?: string;
  shortcut?: string;

  icon?: string;
  badge?: string;

  keywords?: string[];

  priority?: number;

  disabled?: boolean;
  hidden?: boolean;

  run: () => void;
}
'@ | Set-Content (Join-Path $dir "types.ts")

# -----------------------------
# navigation.ts
# -----------------------------
@'
export function navigate(path: string) {
  window.location.href = path;
}
'@ | Set-Content (Join-Path $dir "navigation.ts")

# -----------------------------
# commands.ts
# -----------------------------
@'
import { navigate } from "./navigation";
import { CommandItem } from "./types";

export const commandRegistry: CommandItem[] = [

{
id:"dashboard",
title:"Dashboard",
subtitle:"CRM Home",
group:"Navigation",
shortcut:"G D",
keywords:["crm","dashboard","home"],
priority:1,
run:()=>navigate("/en/dashboard")
},

{
id:"leads",
title:"Leads",
subtitle:"Lead Management",
group:"CRM",
shortcut:"G L",
keywords:["lead","crm"],
priority:2,
run:()=>navigate("/en/dashboard/leads")
},

{
id:"analytics",
title:"Analytics",
subtitle:"Business Analytics",
group:"CRM",
shortcut:"G A",
keywords:["analytics","reports"],
priority:3,
run:()=>navigate("/en/dashboard/analytics")
},

{
id:"clients",
title:"Clients",
subtitle:"Customer Workspace",
group:"CRM",
shortcut:"G C",
keywords:["clients","customers"],
priority:4,
run:()=>navigate("/en/dashboard/clients")
},

{
id:"projects",
title:"Projects",
subtitle:"Project Workspace",
group:"CRM",
shortcut:"G P",
keywords:["projects"],
priority:5,
run:()=>navigate("/en/dashboard/projects")
},

{
id:"payments",
title:"Payments",
subtitle:"Finance",
group:"CRM",
shortcut:"G Y",
keywords:["payments","finance"],
priority:6,
run:()=>navigate("/en/dashboard/payments")
},

{
id:"email",
title:"Email",
subtitle:"Email Center",
group:"Actions",
shortcut:"G E",
keywords:["email"],
priority:7,
run:()=>navigate("/en/dashboard/email")
},

{
id:"logout",
title:"Logout",
subtitle:"Sign out",
group:"Actions",
shortcut:"",
keywords:["logout"],
priority:100,
run:()=>navigate("/logout")
}

];
'@ | Set-Content (Join-Path $dir "commands.ts")

# -----------------------------
# CommandPalette.tsx
# -----------------------------
@'
"use client";

import { useMemo, useState } from "react";

import CommandPaletteModal from "./CommandPaletteModal";
import { commandRegistry } from "./commands";

export default function CommandPalette() {

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

<CommandPaletteModal open>

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
'@ | Set-Content (Join-Path $dir "CommandPalette.tsx")

Write-Host ""
Write-Host "Command Palette V3 complete."